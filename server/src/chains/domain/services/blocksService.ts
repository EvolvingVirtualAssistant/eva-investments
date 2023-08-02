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

export const getBlockSubscriptionCallback =
  (web3: Web3, chainId: number) =>
  (event: BlockHeader): Promise<void> => {
    if (event.number) {
      return web3.eth
        .getBlock(event.number)
        .then((block) => getBlocksRepository().setLatestBlock(chainId, block));
    }
    return Promise.resolve();
  };

export const getBlockTransactionHashes = (
  web3: Web3,
  chainId: number,
  blockNumber: number
): Promise<string[]> => {
  const block = getBlocksRepository().getLatestBlock(chainId);
  if (block == null || block?.number !== blockNumber) {
    return web3.eth.getBlock(blockNumber).then((block) => block.transactions);
  }
  return Promise.resolve(block.transactionsHashes);
};

export const getNextBlockBaseFee = (chainId: number): number | undefined => {
  const block = getBlocksRepository().getLatestBlock(chainId);
  if (!block) {
    return undefined;
  }

  const { baseFeePerGas, gasLimit, gasUsed } = block;
  return getNextBlockBaseFeeEthNetwork(baseFeePerGas, gasLimit, gasUsed);
};

const getNextBlockBaseFeeEthNetwork = (
  baseFeePerGas: number,
  gasLimit: number,
  gasUsed: number
) => {
  const blockTargetGas = gasLimit / 2;
  return gasUsed > blockTargetGas ? baseFeePerGas * 1.125 : baseFeePerGas;
};
