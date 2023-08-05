import { BlockHeaderOutput, Web3 } from '../../../deps';
import { getBlocksRepository } from '../../../appContext';

export const getLatestBlockNumber = (
  web3: Web3,
  chainId: string
): Promise<bigint> => {
  const blockNumber = getBlocksRepository().getLatestBlockNumber(chainId);
  if (blockNumber == null) {
    return web3.eth.getBlockNumber();
  }
  return Promise.resolve(blockNumber);
};

export const getPendingBlockNumber = (
  web3: Web3,
  chainId: string
): Promise<bigint> => {
  return getLatestBlockNumber(web3, chainId).then(
    (blockNumber) => blockNumber + 1n
  );
};

export const getPendingBlockNumberSync = (
  chainId: string
): bigint | undefined => {
  const blockNumber = getBlocksRepository().getLatestBlockNumber(chainId);
  return blockNumber == null ? blockNumber : blockNumber + 1n;
};

export const getBlockNumberTrackerSubscriptionCallback =
  (chainId: string) =>
  (event: BlockHeaderOutput): void => {
    if (event.number) {
      getBlocksRepository().setLatestBlockNumber(
        chainId,
        event.number as bigint
      );
    }
  };

export const getBlockSubscriptionCallback =
  (web3: Web3, chainId: string) =>
  (event: BlockHeaderOutput): Promise<void> => {
    if (event.number) {
      return web3.eth
        .getBlock(event.number)
        .then((block) => getBlocksRepository().setLatestBlock(chainId, block));
    }
    return Promise.resolve();
  };

export const getBlockTransactionHashes = (
  web3: Web3,
  chainId: string,
  blockNumber: bigint
): Promise<string[]> => {
  const block = getBlocksRepository().getLatestBlock(chainId);
  if (block == null || block?.number !== blockNumber) {
    return web3.eth
      .getBlock(blockNumber)
      .then((block) => block.transactions as string[]);
  }
  return Promise.resolve(block.transactionsHashes);
};

export const getNextBlockBaseFee = (chainId: string): bigint | undefined => {
  const block = getBlocksRepository().getLatestBlock(chainId);
  if (!block) {
    return undefined;
  }

  const { baseFeePerGas, gasLimit, gasUsed } = block;
  return getNextBlockBaseFeeEthNetwork(baseFeePerGas, gasLimit, gasUsed);
};

export const getBlockGasLimit = (chainId: string): bigint | undefined =>
  getBlocksRepository().getLatestBlock(chainId)?.gasLimit;

const getNextBlockBaseFeeEthNetwork = (
  baseFeePerGas: bigint,
  gasLimit: bigint,
  gasUsed: bigint
): bigint => {
  const blockTargetGas = gasLimit / 2n;
  return gasUsed > blockTargetGas
    ? (baseFeePerGas * 1125n) / 1000n
    : baseFeePerGas;
};
