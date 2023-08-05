export class TransactionTimeoutError extends Error {
  private _nonce: bigint;
  private _gasPriceInWei?: string;
  private _maxPriorityFeePerGasInWei?: bigint;
  private _maxFeePerGasInWei?: bigint;
  private _gas: bigint;

  constructor(
    txHash: string | undefined,
    nonce: bigint,
    gasPriceInWei: string | undefined,
    maxPriorityFeePerGasInWei: bigint | undefined,
    maxFeePerGasInWei: bigint | undefined,
    gas: bigint,
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
