export interface ChainsRepository {
  getGasWrappedTokenAddress(chainId: number): string | undefined;
  getNativeTokenSymbol(chainId: number): string | undefined;
  getMempoolBlockAge(chainId: number): number | undefined;
}
