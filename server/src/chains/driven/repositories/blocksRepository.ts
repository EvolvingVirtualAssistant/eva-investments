export interface BlocksRepository {
  getLatestBlockNumber(chainId: number): number | undefined;
  setLatestBlockNumber(chainId: number, blockNumber: number): void;
}
