import { isType } from '../../../utils/typeGuards';
import { getObjFromJson } from '../../../utils/files';
import { ChainsRepository } from '../repositories/chainsRepository';
import { ROOT_PATH } from '../../../deps';

const CHAINS_ENV_KEY = 'CHAINS';

type ChainByChainId = {
  chainId: string;
  nativeTokenSymbol: string;
  gasWrappedTokenAddress: string;
  mempoolBlockAge: number;
  blockTime: number;
};

export class ChainsFileAdapter implements ChainsRepository {
  private static instance: ChainsFileAdapter;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): ChainsFileAdapter {
    if (!ChainsFileAdapter.instance) {
      ChainsFileAdapter.instance = new ChainsFileAdapter();
    }

    return ChainsFileAdapter.instance;
  }

  getGasWrappedTokenAddress(chainId: string): string | undefined {
    const chains = getObjFromJson(
      CHAINS_ENV_KEY,
      ROOT_PATH,
      buildChains,
      chainsValidation
    );

    return chains.find((chain) => chain.chainId === chainId)
      ?.gasWrappedTokenAddress;
  }

  getNativeTokenSymbol(chainId: string): string | undefined {
    const chains = getObjFromJson(
      CHAINS_ENV_KEY,
      ROOT_PATH,
      buildChains,
      chainsValidation
    );

    return chains.find((chain) => chain.chainId === chainId)?.nativeTokenSymbol;
  }

  getMempoolBlockAge(chainId: string): number | undefined {
    const chains = getObjFromJson(
      CHAINS_ENV_KEY,
      ROOT_PATH,
      buildChains,
      chainsValidation
    );

    return chains.find((chain) => chain.chainId === chainId)?.mempoolBlockAge;
  }

  getBlockTime(chainId: string): number | undefined {
    const chains = getObjFromJson(
      CHAINS_ENV_KEY,
      ROOT_PATH,
      buildChains,
      chainsValidation
    );

    return chains.find((chain) => chain.chainId === chainId)?.blockTime;
  }
}

const chainsValidation = (chains: unknown): void => {
  if (!Array.isArray(chains)) {
    throw new Error('Unable to retrieve a collection of chains from json file');
  }
};

const buildChains = (chains: unknown[]): ChainByChainId[] => {
  return chains.map(buildChainByChainId);
};

const buildChainByChainId = (obj: any): ChainByChainId => {
  if (!isChainByChainId(obj)) {
    throw new Error(
      `There was an error building chain by chainId from ${JSON.stringify(obj)}`
    );
  }

  return {
    ...(obj as ChainByChainId)
  };
};

const isChainByChainId = (obj: any): boolean => {
  return (
    isType(
      obj,
      [
        'chainId',
        'nativeTokenSymbol',
        'gasWrappedTokenAddress',
        'mempoolBlockAge',
        'blockTime'
      ],
      []
    ) &&
    (obj as ChainByChainId).chainId != null &&
    !isNaN(Number((obj as ChainByChainId).chainId)) &&
    (obj as ChainByChainId).gasWrappedTokenAddress != null &&
    (obj as ChainByChainId).nativeTokenSymbol != null &&
    (obj as ChainByChainId).mempoolBlockAge != null &&
    !isNaN(Number((obj as ChainByChainId).mempoolBlockAge)) &&
    (obj as ChainByChainId).blockTime != null &&
    !isNaN(Number((obj as ChainByChainId).blockTime))
  );
};
