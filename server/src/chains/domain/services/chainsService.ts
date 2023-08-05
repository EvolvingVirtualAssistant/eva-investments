import { getChainsRepository } from '../../../appContext';

export const getGasWrappedTokenAddress = (chaindId: string): string => {
  const gasTokenAddress =
    getChainsRepository().getGasWrappedTokenAddress(chaindId);

  if (gasTokenAddress == null) {
    throw new Error(
      `Unable to get gas wrapped token address, for chain ${chaindId}`
    );
  }
  return gasTokenAddress;
};

export const getNativeTokenSymbol = (chaindId: string): string => {
  const nativeTokenSymbol =
    getChainsRepository().getNativeTokenSymbol(chaindId);

  if (nativeTokenSymbol == null) {
    throw new Error(`Unable to get native token symbol, for chain ${chaindId}`);
  }
  return nativeTokenSymbol;
};

export const getMempoolBlockAge = (chaindId: string): number => {
  const mempoolBlockAge = getChainsRepository().getMempoolBlockAge(chaindId);

  if (mempoolBlockAge == null) {
    throw new Error(
      `Unable to get the age of a block inside the mempool, after which should be deleted, for chain ${chaindId}`
    );
  }
  return mempoolBlockAge;
};
