import { SignTransactionResult } from '../../../deps';

export type SignedTransactionWithNonce = {
  signedTransaction: SignTransactionResult;
  nonce: bigint;
  gasPriceInWei?: string;
  maxPriorityFeePerGasInWei?: bigint;
  maxFeePerGasInWei?: bigint;
  gas: bigint;
};
