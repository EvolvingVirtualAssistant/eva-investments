import { Block } from '../../domain/entities/block';
import { Dictionary } from '../../../types/types';
import { BlocksRepository } from '../repositories/blocksRepository';
import { GetBlockOutput } from '../../../deps';

export class BlocksMemoryAdapter implements BlocksRepository {
  private static instance: BlocksMemoryAdapter;

  private latestBlockByChainId: Dictionary<Block | { number: bigint }>;
  private latestBlockNumberByChainId: Dictionary<bigint>;

  private constructor() {
    this.latestBlockByChainId = {};
    this.latestBlockNumberByChainId = {};
  }

  static getInstance(): BlocksMemoryAdapter {
    if (this.instance == null) {
      this.instance = new BlocksMemoryAdapter();
    }
    return this.instance;
  }

  getLatestBlockNumber(chainId: string): bigint | undefined {
    return this.latestBlockNumberByChainId[chainId];
  }

  setLatestBlockNumber(chainId: string, blockNumber: bigint): void {
    this.latestBlockNumberByChainId[chainId] = blockNumber;
  }

  getLatestBlock(chainId: string): Block | undefined {
    const block = this.latestBlockByChainId[chainId];
    return block ? (block as Block) : undefined;
  }

  setLatestBlock(chainId: string, block: GetBlockOutput): void {
    this.latestBlockByChainId[chainId] = {
      number: block.number as bigint,
      baseFeePerGas: block.baseFeePerGas! as bigint,
      gasLimit: block.gasLimit as bigint,
      gasUsed: block.gasUsed as bigint,
      transactionsHashes: block.transactions as string[]
    };
  }
}
