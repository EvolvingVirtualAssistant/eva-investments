export class TransactionTimeoutError extends Error {
  private _nonce: number;
  private _gasPriceInWei: string;
  private _gas: number;

  constructor(
    txHash: string | undefined,
    nonce: number,
    gasPriceInWei: string,
    gas: number,
    timeout: number
  ) {
    super(
      `Transaction ${txHash} with nonce ${nonce} timed out after ${timeout} ms`
    );
    this._nonce = nonce;
    this._gasPriceInWei = gasPriceInWei;
    this._gas = gas;
  }

  getNonce() {
    return this._nonce;
  }

  getGasPriceInWei() {
    return this._gasPriceInWei;
  }

  getGas() {
    return this._gas;
  }
}
