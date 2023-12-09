export interface ChainsRepository {
  getGasWrappedTokenAddress(chainId: string): string | undefined;
  getNativeTokenSymbol(chainId: string): string | undefined;
  getMempoolBlockAge(chainId: string): number | undefined;
  getBlockTime(chainId: string): number | undefined;
}
