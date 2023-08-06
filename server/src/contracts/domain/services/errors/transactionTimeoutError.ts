import { BN } from '../../../../deps';

export class TransactionTimeoutError extends Error {
  private _nonce: number;
  private _gasPriceInWei?: string;
  private _maxPriorityFeePerGasInWei?: BN;
  private _maxFeePerGasInWei?: BN;
  private _gas: number;

  constructor(
    txHash: string | undefined,
    nonce: number,
    gasPriceInWei: string | undefined,
    maxPriorityFeePerGasInWei: BN | undefined,
    maxFeePerGasInWei: BN | undefined,
    gas: number,
    timeout: number
  ) {
    super(
      `Transaction ${txHash} with nonce ${nonce} timed out after ${timeout} ms`
    );
    this._nonce = nonce;
    this._gasPriceInWei = gasPriceInWei;
    this._maxPriorityFeePerGasInWei = maxPriorityFeePerGasInWei;
    this._maxFeePerGasInWei = maxFeePerGasInWei;
    this._gas = gas;
  }

  getNonce() {
    return this._nonce;
  }

  getGasPriceInWei() {
    return this._gasPriceInWei;
  }

  getMaxPriorityFeePerGasInWei() {
    return this._maxPriorityFeePerGasInWei;
  }

  getMaxFeePerGasInWei() {
    return this._maxFeePerGasInWei;
  }

  getGas() {
    return this._gas;
  }
}
