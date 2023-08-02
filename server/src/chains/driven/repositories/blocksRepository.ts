import { Block } from '../../domain/entities/block';
import { BlockTransactionString } from '../../../deps';

export interface BlocksRepository {
  getLatestBlockNumber(chainId: number): number | undefined;
  setLatestBlockNumber(chainId: number, blockNumber: number): void;
  getLatestBlock(chainId: number): Block | undefined;
  setLatestBlock(chainId: number, block: BlockTransactionString): void;
}
