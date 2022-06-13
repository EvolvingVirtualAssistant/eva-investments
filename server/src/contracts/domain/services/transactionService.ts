import { getNonceTracker } from '../../../appContext';
import {
  BN,
  SignedTransaction,
  TransactionReceipt,
  Unit as EthereUnit,
  Web3
} from '../../../deps';
import { Account } from '../../../wallets/domain/entities/accounts';

export class TransactionService {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  async signTransaction(
    account: Account,
    sendMethodEncoded: string,
    gas: number,
    gasPrice: string,
    ethereUnit: EthereUnit,
    toAddress?: string,
    value?: BN
  ): Promise<SignedTransaction> {
    return await signTransaction(
      this.web3,
      account,
      sendMethodEncoded,
      gas,
      gasPrice,
      ethereUnit,
      toAddress,
      value
    );
  }

  async sendSignedTransaction(
    signedTransaction: SignedTransaction
  ): Promise<TransactionReceipt> {
    return await sendSignedTransaction(this.web3, signedTransaction);
  }
}

export const signTransaction = async (
  web3: Web3,
  account: Account,
  sendMethodEncoded: string,
  gas: number,
  gasPrice: string,
  ethereUnit: EthereUnit,
  toAddress?: string,
  value?: BN
): Promise<SignedTransaction> => {
  const nonceTracker = await getNonceTracker();
  let nonce;

  try {
    nonce = await nonceTracker.getNextNonce(web3, account.address);
  } catch (e) {
    await nonceTracker.initAddress(web3, account.address);
    nonce = await nonceTracker.getNextNonce(web3, account.address);
  } finally {
    console.log('Using nonce:', nonce);
  }

  return await web3.eth.accounts.signTransaction(
    {
      from: account.address,
      to: toAddress,
      data: sendMethodEncoded,
      gas, //750000
      gasPrice: web3.utils.toWei(gasPrice, ethereUnit), //1.2444,
      value,
      nonce: nonce
    },
    account.privateKey
  );
};

export const sendSignedTransaction = async (
  web3: Web3,
  signedTransaction: SignedTransaction
): Promise<TransactionReceipt> => {
  return await new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction!)
      .once(
        'confirmation',
        (
          confirmationNumber: number,
          receipt: TransactionReceipt,
          latestBlockHash?: string
        ) => {
          /* console.log(
            `Transaction confirmed. ConfirmationNumber: ${confirmationNumber} , LatestBlockHash: ${latestBlockHash} , Receipt: ${JSON.stringify(
              receipt
            )}`
          ); */
          console.log(
            `Transaction confirmed. ConfirmationNumber: ${confirmationNumber} , LatestBlockHash: ${latestBlockHash} , 
            TxHash: ${receipt.transactionHash}, ContractAddress: ${receipt.contractAddress}, 
            GasUsed: ${receipt.gasUsed}, CumulativeGasUsed: ${receipt.cumulativeGasUsed}`
          );
          resolve(receipt);
        }
      )
      .catch((e) => reject(e));
  });
};
