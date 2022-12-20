import { BlockHeader, Web3 } from '../../../deps';
import { getBlocksRepository } from '../../../appContext';

export const getLatestBlockNumber = (
  web3: Web3,
  chainId: number
): Promise<number> => {
  const blockNumber = getBlocksRepository().getLatestBlockNumber(chainId);
  if (blockNumber == null) {
    return web3.eth.getBlockNumber();
  }
  return Promise.resolve(blockNumber);
};

export const getPendingBlockNumber = (
  web3: Web3,
  chainId: number
): Promise<number> => {
  return getLatestBlockNumber(web3, chainId).then(
    (blockNumber) => blockNumber + 1
  );
};

export const getBlockNumberTrackerSubscriptionCallback =
  (chainId: number) =>
  (event: BlockHeader): void => {
    if (event.number) {
      getBlocksRepository().setLatestBlockNumber(chainId, event.number);
    }
  };
