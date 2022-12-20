import { Dictionary } from '../../../types/types';
import { BlocksRepository } from '../repositories/blocksRepository';

export class BlocksMemoryAdapter implements BlocksRepository {
  private static instance: BlocksMemoryAdapter;

  private blockNumberByChainId: Dictionary<number>;

  private constructor() {
    this.blockNumberByChainId = {};
  }

  static getInstance(): BlocksMemoryAdapter {
    if (this.instance == null) {
      this.instance = new BlocksMemoryAdapter();
    }
    return this.instance;
  }

  getLatestBlockNumber(chainId: number): number | undefined {
    return this.blockNumberByChainId[chainId];
  }

  setLatestBlockNumber(chainId: number, blockNumber: number): void {
    this.blockNumberByChainId[chainId] = blockNumber;
  }
}
