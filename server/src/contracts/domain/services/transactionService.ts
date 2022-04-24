import {
  SignedTransaction,
  TransactionReceipt,
  Unit as EthereUnit,
  Web3
} from '../../../deps';
import { Account } from './deployContractService';

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
    value?: number
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
  value?: number
): Promise<SignedTransaction> => {
  return await web3.eth.accounts.signTransaction(
    {
      from: account.address,
      to: toAddress,
      data: sendMethodEncoded,
      gas, //750000
      gasPrice: web3.utils.toWei(gasPrice, ethereUnit), //1.2444,
      value
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
