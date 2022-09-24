import { Dictionary } from '../../../types/types';
import {
  BN,
  SignedTransaction,
  TransactionReceipt,
  Unit as EthereUnit,
  Web3,
  getNonceTracker,
  logError,
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
  chainId: number,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
  toAddress?: string,
  value?: BN
): Promise<TransactionReceipt> => {
  return sendPartialLockTransaction(
    chainId,
    web3,
    account,
    sendMethodEncoded,
    gas,
    gasPrice,
    ethereUnit,
    toAddress,
    value
  );
};

const sendLockTransaction = async (
  chainId: number,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
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
      gasPrice,
      ethereUnit,
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
        e.getGasPriceInWei(),
        e.getGas()
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

const sendNoLockTransaction = async (
  chainId: number,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
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
      gasPrice,
      ethereUnit,
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
        e.getGasPriceInWei(),
        e.getGas()
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
  chainId: number,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
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
      gasPrice,
      ethereUnit,
      toAddress,
      value
    );
    //There will be possibly usecases that we are not covering yet on the catch
    return sendSignedTransaction(web3, signedTransaction).catch((e) => {
      if (e instanceof TransactionTimeoutError) {
        cancelTransaction(
          web3,
          account,
          e.getNonce(),
          e.getGasPriceInWei(),
          e.getGas()
        );
      }
      throw e;
    });
  } catch (e) {
    logWarn('Error executing send transaction', e);

    if (e instanceof TransactionTimeoutError) {
      cancelTransaction(
        web3,
        account,
        e.getNonce(),
        e.getGasPriceInWei(),
        e.getGas()
      );
    } else {
      //recovering nonce value
      //logDebug('Syncing nonce');
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

type SignedTransactionWithNonce = {
  signedTransaction: SignedTransaction;
  nonce: number;
  gasPriceInWei: string;
  gas: number;
};

const signTransaction = async (
  chainId: number,
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
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

  const gasPriceInWei = web3.utils.toWei(gasPrice, ethereUnit);
  const signedTransaction = await web3.eth.accounts.signTransaction(
    {
      from: account.address,
      to: toAddress,
      data: sendMethodEncoded,
      gas, //750000
      gasPrice: gasPriceInWei, //1.2444,
      value,
      nonce: nonce
    },
    account.privateKey
  );
  return { signedTransaction, nonce, gasPriceInWei, gas };
};

const sendSignedTransaction = async (
  web3: Web3,
  { signedTransaction, nonce, gasPriceInWei, gas }: SignedTransactionWithNonce
): Promise<TransactionReceipt> => {
  return await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () =>
        reject(
          new TransactionTimeoutError(
            signedTransaction.transactionHash,
            nonce,
            gasPriceInWei,
            gas,
            TRANSACTION_TIMEOUT
          )
        ),
      TRANSACTION_TIMEOUT
    );
    web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction!)
      .once(
        'confirmation',
        wrapWithLogger(
          (
            confirmationNumber: number,
            receipt: TransactionReceipt,
            latestBlockHash?: string
          ) => {
            logDebug(
              `Transaction confirmed. ConfirmationNumber: ${confirmationNumber} , LatestBlockHash: ${latestBlockHash} , 
        TxHash: ${receipt.transactionHash}, ContractAddress: ${receipt.contractAddress}, 
        GasUsed: ${receipt.gasUsed}, CumulativeGasUsed: ${receipt.cumulativeGasUsed}`
            );
            clearTimeout(timeoutId);
            resolve(receipt);
          }
        )
      )
      .catch((e) => {
        clearTimeout(timeoutId);
        reject(e);
      });
  });
};

const cancelTransaction = async (
  web3: Web3,
  account: Account,
  nonce: number,
  gasPriceInWei: string,
  gas: number
): Promise<TransactionReceipt> => {
  const signedTransaction = await web3.eth.accounts.signTransaction(
    {
      from: account.address,
      to: account.address,
      gas, //750000
      // in order to cancel it we have to make it at least 10% higher gasPrice than previous tx
      gasPrice: `${Number.parseInt(gasPriceInWei) * 1.1}`,
      value: 0,
      nonce: nonce
    },
    account.privateKey
  );

  return await sendSignedTransaction(web3, {
    signedTransaction,
    nonce,
    gasPriceInWei,
    gas
  });
};
