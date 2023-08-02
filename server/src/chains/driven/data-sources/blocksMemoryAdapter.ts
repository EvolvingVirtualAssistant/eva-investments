import { Block } from '../../domain/entities/block';
import { Dictionary } from '../../../types/types';
import { BlocksRepository } from '../repositories/blocksRepository';
import { BlockTransactionString } from 'web3-eth';

export class BlocksMemoryAdapter implements BlocksRepository {
  private static instance: BlocksMemoryAdapter;

  private latestBlockByChainId: Dictionary<Block | { number: number }>;
  private latestBlockNumberByChainId: Dictionary<number>;

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

  getLatestBlockNumber(chainId: number): number | undefined {
    return this.latestBlockNumberByChainId[chainId];
  }

  setLatestBlockNumber(chainId: number, blockNumber: number): void {
    this.latestBlockNumberByChainId[chainId] = blockNumber;
  }

  getLatestBlock(chainId: number): Block | undefined {
    const block = this.latestBlockByChainId[chainId];
    return block ? (block as Block) : undefined;
  }

  setLatestBlock(chainId: number, block: BlockTransactionString): void {
    this.latestBlockByChainId[chainId] = {
      number: block.number,
      baseFeePerGas: block.baseFeePerGas!,
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      transactionsHashes: block.transactions
    };
  }
}
