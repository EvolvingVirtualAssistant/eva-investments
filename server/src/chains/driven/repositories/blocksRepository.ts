import { Block } from '../../domain/entities/block';
import { GetBlockOutput } from '../../../deps';

export interface BlocksRepository {
  getLatestBlockNumber(chainId: string): bigint | undefined;
  setLatestBlockNumber(chainId: string, blockNumber: bigint): void;
  getLatestBlock(chainId: string): Block | undefined;
  setLatestBlock(chainId: string, block: GetBlockOutput): void;
}
