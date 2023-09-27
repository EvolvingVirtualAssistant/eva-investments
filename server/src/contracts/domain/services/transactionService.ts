import { Dictionary } from '../../../types/types';
import {
  BN,
  SignTransactionResult,
  TransactionReceipt,
  EtherUnits,
  Web3,
  getNonceTracker,
  logDebug,
  logWarn,
  wrapWithLogger
} from '../../../deps';
import { Account } from '../../../wallets/domain/entities/accounts';
import { TRANSACTION_TIMEOUT } from '../constants/contractConstants';
import { TransactionTimeoutError } from './errors/transactionTimeoutError';

type Task = {
  execute: (...args: any[]) => Promise<void>;
  args: any[];
};

type TransactionsQueue = {
  queue: Task[];
  notifyOfNew: ((value: unknown) => void)[];
  lock: boolean;
  lockRequests: ((value: unknown) => void)[];
};

const transactionsQueuesByAccountAddress: Dictionary<TransactionsQueue> = {};

export const sendTransaction = async (
  chainId: string,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice?: string,
  maxPriorityFeePerGas?: bigint,
  maxFeePerGas?: bigint,
  toAddress?: string,
  value?: BN
): Promise<TransactionReceipt> => {
  return sendPartialLockTransaction(
    chainId,
    web3,
    account,
    sendMethodEncoded,
    gas,
    ethereUnit,
    gasPrice,
    maxPriorityFeePerGas,
    maxFeePerGas,
    toAddress,
    value
  );
};

export const estimateGas = async (
  chainId: string,
  web3: Web3,
  account: Account,
  fromAddress: string,
  gasForEstimateCall: number,
  value: BN | undefined,
  method: any,
  ...methodArgs: any[]
): Promise<bigint> => {
  return estimateGasPartialLock(
    chainId,
    web3,
    account,
    fromAddress,
    gasForEstimateCall,
    value,
    method,
    ...methodArgs
  );
};

// TODO: revisit try catch and promise combo (check sendPartialLockTransaction)
const sendLockTransaction = async (
  chainId: string,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice?: string,
  maxPriorityFeePerGas?: bigint,
  maxFeePerGas?: bigint,
  toAddress?: string,
  value?: BN
): Promise<TransactionReceipt> => {
  const transactionsQueue = getOrCreateTransactionsQueue(web3, account);

  if (transactionsQueue.lock) {
    await new Promise((resolve, reject) => {
      //logDebug('Waiting for lock', transactionsQueue.lockRequests.length);
      transactionsQueue.lockRequests.push(resolve);
    });
  }
  transactionsQueue.lock = true;
  //logDebug('Acquired lock', sendMethodEncoded);

  try {
    const signedTransaction = await signTransaction(
      chainId,
      web3,
      account,
      sendMethodEncoded,
      gas,
      ethereUnit,
      gasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
      toAddress,
      value
    );
    return await sendSignedTransaction(web3, signedTransaction);
  } catch (e) {
    logWarn('Error executing send transaction', e);

    if (e instanceof TransactionTimeoutError) {
      cancelTransaction(
        web3,
        account,
        e.getNonce(),
        e.getGas(),
        e.getGasPriceInWei(),
        e.getMaxPriorityFeePerGasInWei(),
        e.getMaxFeePerGasInWei()
      );
    } else {
      //recovering nonce value
      const { syncLocalNonce } = getNonceTracker();
      await syncLocalNonce(web3, chainId, account.address);
    }

    throw e;
  } finally {
    //logDebug('Releasing lock', transactionsQueue.lockRequests.length);
    transactionsQueue.lock = false;
    transactionsQueue.lockRequests.shift()?.('');
  }
};

const getOrCreateTransactionsQueue = (web3: Web3, account: Account) => {
  const accountAddressKey = web3.currentProvider + account.address;
  let transactionsQueue = transactionsQueuesByAccountAddress[accountAddressKey];
  if (!transactionsQueue) {
    transactionsQueue = {
      queue: [],
      notifyOfNew: [],
      lock: false,
      lockRequests: []
    };
    transactionsQueuesByAccountAddress[accountAddressKey] = transactionsQueue;
  }

  return transactionsQueue;
};

// TODO: revisit try catch and promise combo (check sendPartialLockTransaction)
const sendNoLockTransaction = async (
  chainId: string,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice?: string,
  maxPriorityFeePerGas?: bigint,
  maxFeePerGas?: bigint,
  toAddress?: string,
  value?: BN
): Promise<TransactionReceipt> => {
  try {
    const signedTransaction = await signTransaction(
      chainId,
      web3,
      account,
      sendMethodEncoded,
      gas,
      ethereUnit,
      gasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
      toAddress,
      value,
      true
    );
    return sendSignedTransaction(web3, signedTransaction);
  } catch (e) {
    logWarn('Error executing send transaction', e);

    if (e instanceof TransactionTimeoutError) {
      cancelTransaction(
        web3,
        account,
        e.getNonce(),
        e.getGas(),
        e.getGasPriceInWei(),
        e.getMaxPriorityFeePerGasInWei(),
        e.getMaxFeePerGasInWei()
      );
    } else {
      //recovering nonce value
      const { syncLocalNonce } = getNonceTracker();
      await syncLocalNonce(web3, chainId, account.address);
    }

    throw e;
  }
};

const sendPartialLockTransaction = async (
  chainId: string,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice?: string,
  maxPriorityFeePerGas?: bigint,
  maxFeePerGas?: bigint,
  toAddress?: string,
  value?: BN
): Promise<TransactionReceipt> => {
  const transactionsQueue = getOrCreateTransactionsQueue(web3, account);

  if (transactionsQueue.lock) {
    await new Promise((resolve, reject) => {
      //logDebug('Waiting for lock', transactionsQueue.lockRequests.length);
      transactionsQueue.lockRequests.push(resolve);
    });
  }
  transactionsQueue.lock = true;
  //logDebug('Acquired lock', sendMethodEncoded);

  let signedTransaction: SignedTransactionWithNonce;
  try {
    signedTransaction = await signTransaction(
      chainId,
      web3,
      account,
      sendMethodEncoded,
      gas,
      ethereUnit,
      gasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
      toAddress,
      value
    );
  } catch (e) {
    await getSendSignedTransactionErrorHandler(
      chainId,
      web3,
      account
    )(e).finally(() => {
      transactionsQueue.lock = false;
      transactionsQueue.lockRequests.shift()?.('');
    });
  }

  return sendSignedTransaction(web3, signedTransaction!)
    .catch(getSendSignedTransactionErrorHandler(chainId, web3, account))
    .finally(() => {
      transactionsQueue.lock = false;
      transactionsQueue.lockRequests.shift()?.('');
    });
};

//There will be possibly usecases that we are not covering yet on the catch
const getSendSignedTransactionErrorHandler =
  (chainId: string, web3: Web3, account: Account) =>
  async (e: unknown): Promise<never> => {
    logWarn('Error executing send transaction', JSON.stringify(e));

    if (e instanceof TransactionTimeoutError) {
      cancelTransaction(
        web3,
        account,
        e.getNonce(),
        e.getGas(),
        e.getGasPriceInWei(),
        e.getMaxPriorityFeePerGasInWei(),
        e.getMaxFeePerGasInWei()
      );
    } else {
      //recovering nonce value
      //logDebug('Syncing nonce');
      const { syncLocalNonce } = getNonceTracker();
      await syncLocalNonce(web3, chainId, account.address);
    }

    throw e;
  };

const estimateGasPartialLock = async (
  chainId: string,
  web3: Web3,
  account: Account,
  fromAddress: string,
  gasForEstimateCall: number,
  value: BN | undefined,
  method: any,
  ...methodArgs: any[]
): Promise<bigint> => {
  const transactionsQueue = getOrCreateTransactionsQueue(web3, account);

  if (transactionsQueue.lock) {
    await new Promise((resolve, reject) => {
      //logDebug('Waiting for lock', transactionsQueue.lockRequests.length);
      transactionsQueue.lockRequests.push(resolve);
    });
  }
  transactionsQueue.lock = true;
  //logDebug('Acquired lock', sendMethodEncoded);

  try {
    return await _estimateGas(
      chainId,
      web3,
      account,
      false,
      fromAddress,
      gasForEstimateCall,
      value,
      method,
      ...methodArgs
    );
  } catch (e) {
    logWarn('Error executing estimate gas', e);

    throw e;
  } finally {
    //recovering nonce value since estimateGas consists in performing a transaction and reverting it
    //which results in not actually incrementing the nonce
    //logDebug('Syncing nonce');
    const { syncLocalNonce } = getNonceTracker();
    await syncLocalNonce(web3, chainId, account.address);

    //logDebug('Releasing lock', transactionsQueue.lockRequests.length);
    transactionsQueue.lock = false;
    transactionsQueue.lockRequests.shift()?.('');
  }
};

type SignedTransactionWithNonce = {
  signedTransaction: SignTransactionResult;
  nonce: bigint;
  gasPriceInWei?: string;
  maxPriorityFeePerGasInWei?: bigint;
  maxFeePerGasInWei?: bigint;
  gas: bigint;
};

const signTransaction = async (
  chainId: string,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice?: string,
  maxPriorityFeePerGas?: bigint,
  maxFeePerGas?: bigint,
  toAddress?: string,
  value?: BN,
  mutexNonce = false
): Promise<SignedTransactionWithNonce> => {
  const nonceTracker = getNonceTracker();
  let nonce;

  try {
    nonce = mutexNonce
      ? await nonceTracker.getNextNonce(chainId, account.address)
      : nonceTracker.getNextUnsafeNonce(chainId, account.address);
  } catch (e) {
    logWarn(
      `Could not obtain next nonce while signing transaction. Will create new entry for account ${account.address}`,
      e
    );
    await nonceTracker.initAddress(web3, chainId, account.address);
    nonce = mutexNonce
      ? await nonceTracker.getNextNonce(chainId, account.address)
      : nonceTracker.getNextUnsafeNonce(chainId, account.address);
  }

  const tx: { [key: string]: string | bigint | number | undefined } = {
    from: account.address,
    to: toAddress,
    data: sendMethodEncoded,
    gas, //750000
    value: value ? BigInt(value.toString()) : undefined,
    nonce: nonce,
    chainId
  };
  let maxPriorityFeePerGasInWei: bigint | undefined;
  let maxFeePerGasInWei: bigint | undefined;
  let gasPriceInWei: string | undefined;

  // EIP-1559 (type 0x2) transaction
  if (maxPriorityFeePerGas && maxFeePerGas) {
    maxPriorityFeePerGasInWei = web3.utils.toBigInt(
      web3.utils.toWei(maxPriorityFeePerGas.toString(), ethereUnit)
    );
    maxFeePerGasInWei = web3.utils.toBigInt(
      web3.utils.toWei(maxFeePerGas.toString(), ethereUnit)
    );
    tx.maxPriorityFeePerGas = maxPriorityFeePerGasInWei;
    tx.maxFeePerGas = maxFeePerGasInWei;
  } else if (gasPrice) {
    // Legacy (type 0x0) transaction
    const gasPriceInWei = web3.utils.toWei(gasPrice, ethereUnit);
    tx.gasPrice = gasPriceInWei;
  } else {
    throw new Error(
      `Could not sign transaction ${sendMethodEncoded}. No gas prices were provided, gasPrice:${gasPrice} , maxPriorityFeePerGas:${maxPriorityFeePerGas}, maxFeePerGas:${maxFeePerGas}`
    );
  }

  const signedTransaction = await web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  return {
    signedTransaction,
    nonce,
    gasPriceInWei,
    maxPriorityFeePerGasInWei,
    maxFeePerGasInWei,
    gas
  };
};

const sendSignedTransaction = async (
  web3: Web3,
  {
    signedTransaction,
    nonce,
    gasPriceInWei,
    maxPriorityFeePerGasInWei,
    maxFeePerGasInWei,
    gas
  }: SignedTransactionWithNonce
): Promise<TransactionReceipt> => {
  const onConfirmation = wrapWithLogger(
    (
      resolve: (
        value: TransactionReceipt | PromiseLike<TransactionReceipt>
      ) => void,
      timeoutId: NodeJS.Timeout,
      confirmations: bigint,
      receipt: TransactionReceipt,
      latestBlockHash?: string
    ) => {
      logDebug(
        `Transaction confirmed. Confirmations: ${confirmations} , LatestBlockHash: ${latestBlockHash} , 
  TxHash: ${receipt.transactionHash}, ContractAddress: ${receipt.contractAddress}, 
  GasUsed: ${receipt.gasUsed}, CumulativeGasUsed: ${receipt.cumulativeGasUsed}`
      );
      clearTimeout(timeoutId);
      resolve(receipt);
    }
  );

  return await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () =>
        reject(
          new TransactionTimeoutError(
            signedTransaction.transactionHash,
            nonce,
            gasPriceInWei,
            maxPriorityFeePerGasInWei,
            maxFeePerGasInWei,
            gas,
            TRANSACTION_TIMEOUT
          )
        ),
      TRANSACTION_TIMEOUT
    );
    web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction!)
      .once('confirmation', ({ confirmations, receipt, latestBlockHash }) =>
        onConfirmation(
          resolve,
          timeoutId,
          confirmations,
          receipt,
          latestBlockHash
        )
      )
      .catch((e) => {
        clearTimeout(timeoutId);
        reject(e);
      });
  });
};

const _estimateGas = async (
  chainId: string,
  web3: Web3,
  account: Account,
  mutexNonce = false,
  fromAddress: string,
  gasForEstimateCall: number,
  value: BN | undefined,
  method: any,
  ...methodArgs: any[]
): Promise<bigint> => {
  const nonceTracker = getNonceTracker();
  let nonce;

  try {
    nonce = mutexNonce
      ? await nonceTracker.getNextNonce(chainId, account.address)
      : nonceTracker.getNextUnsafeNonce(chainId, account.address);
  } catch (e) {
    logWarn(
      `Could not obtain next nonce while estimating gas. Will create new entry for account ${account.address}`,
      e
    );
    await nonceTracker.initAddress(web3, chainId, account.address);
    nonce = mutexNonce
      ? await nonceTracker.getNextNonce(chainId, account.address)
      : nonceTracker.getNextUnsafeNonce(chainId, account.address);
  }

  return method?.(...methodArgs).estimateGas?.({
    from: fromAddress,
    gas: gasForEstimateCall,
    nonce,
    value: value ? BigInt(value.toString()) : undefined
  });
};

const cancelTransaction = async (
  web3: Web3,
  account: Account,
  nonce: bigint,
  gas: bigint,
  gasPriceInWei?: string,
  maxPriorityFeePerGasInWei?: bigint,
  maxFeePerGasInWei?: bigint
): Promise<TransactionReceipt> => {
  const tx: { [key: string]: string | number | bigint | undefined } = {
    from: account.address,
    to: account.address,
    gas, //750000
    value: 0,
    nonce: nonce
  };

  // EIP-1559 (type 0x2) transaction
  if (maxPriorityFeePerGasInWei && maxFeePerGasInWei) {
    // in order to cancel it we have to make it at least 10% higher maxPriorityFeePerGasInWei and maxFeePerGasInWei than previous tx
    tx.maxPriorityFeePerGas = (maxPriorityFeePerGasInWei * 11n) / 10n;
    tx.maxFeePerGas = (maxFeePerGasInWei * 11n) / 10n;
  } else if (gasPriceInWei) {
    // Legacy (type 0x0) transaction
    // in order to cancel it we have to make it at least 10% higher gasPrice than previous tx
    tx.gasPrice = `${Number.parseInt(gasPriceInWei) * 1.1}`;
  } else {
    throw new Error(
      `Could not sign cancel transaction. No gas prices were provided, gasPriceInWei:${gasPriceInWei} , maxPriorityFeePerGasInWei:${maxPriorityFeePerGasInWei}, maxFeePerGasInWei:${maxFeePerGasInWei}`
    );
  }

  const signedTransaction = await web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );

  return await sendSignedTransaction(web3, {
    signedTransaction,
    nonce,
    gasPriceInWei,
    maxPriorityFeePerGasInWei,
    maxFeePerGasInWei,
    gas
  });
};
