import { SignedTransactionWithNonce } from '../../entities/transaction';

export class TransactionInterruptedError extends Error {
  constructor({
    nonce,
    gas,
    gasPriceInWei,
    maxPriorityFeePerGasInWei,
    maxFeePerGasInWei
  }: SignedTransactionWithNonce) {
    super(
      `Transaction with nonce:${nonce} gas:${gas} gasPriceInWei:${gasPriceInWei} maxPriorityFeePerGasInWei:${maxPriorityFeePerGasInWei} maxFeePerGasInWei:${maxFeePerGasInWei} 
      has been interrupted`
    );
  }
}
