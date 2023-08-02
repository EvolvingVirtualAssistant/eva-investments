import { isType } from '../../../utils/typeGuards';
import { FSWatcher, logWarn, pathJoin, ROOT_PATH } from '../../../deps';
import { getObjFromJson } from '../../../utils/files';
import { ContractData } from '../../domain/entities/contract';
import {
  ContractDataFilter,
  ContractsRepository
} from '../repositories/contractsRepository';
import { Dictionary } from '../../../types/types';
import { unwatchFile, watchFile } from '../../../utils/filesystemWatcher';

const CONTRACTS_ENV_KEY = 'CONTRACTS';

type ContractsByChainId = {
  chainId: number;
  contracts: ContractData[];
};

export class ContractsConfigFileAdapter implements ContractsRepository {
  private static instance: ContractsConfigFileAdapter;

  private watchedFiles: Dictionary<FSWatcher[]>;

  private constructor() {
    this.watchedFiles = {};
  }

  static getInstance(): ContractsConfigFileAdapter {
    if (!ContractsConfigFileAdapter.instance) {
      ContractsConfigFileAdapter.instance = new ContractsConfigFileAdapter();
    }

    return ContractsConfigFileAdapter.instance;
  }

  getContractsData(
    chainId: number,
    filter?: ContractDataFilter
  ): ContractData[] {
    try {
      const contractsData = getObjFromJson(
        CONTRACTS_ENV_KEY,
        ROOT_PATH,
        buildContracts,
        contractsValidation
      );

      const contractsByChainId = contractsData.find(
        (contractsByChainId) => contractsByChainId.chainId === chainId
      );

      if (contractsByChainId == null) {
        return [];
      }

      if (filter == null) {
        return contractsByChainId.contracts;
      }

      return contractsByChainId.contracts.filter(
        (contract) =>
          (filter.name == null || filter.name === contract.name) &&
          (filter.address == null || filter.address === contract.address) &&
          (filter.path == null || filter.path === contract.path) &&
          (filter.compiledPath == null ||
            filter.compiledPath === contract.compiledPath)
      );
    } catch (e) {
      logWarn('Error in ContractsConfigFileAdapter - getContractsData: ' + e);
    }

    return [];
  }

  callOnChange(callback: () => void): void {
    this.disableCallOnChange();

    this.watchFileChanges(callback, process.env[CONTRACTS_ENV_KEY]);
  }

  disableCallOnChange(): void {
    for (const [file, watchers] of Object.entries(this.watchedFiles)) {
      unwatchFile(file, watchers);
    }

    this.watchedFiles = {};
  }

  private watchFileChanges(callback: () => void, filepath?: string): void {
    if (filepath) {
      const path = pathJoin(ROOT_PATH, filepath);
      const watchers = this.watchedFiles[path] || [];
      const watcher = watchFile(path, callback);
      watchers.push(watcher);
      this.watchedFiles[path] = watchers;
    }
  }
}

const contractsValidation = (contracts: unknown): void => {
  if (!Array.isArray(contracts)) {
    throw new Error(
      'Unable to retrieve a collection of contracts from json file'
    );
  }
};

const buildContracts = (contracts: unknown[]): ContractsByChainId[] => {
  return contracts.map(buildContractsByChainId);
};

const buildContractsByChainId = (obj: any): ContractsByChainId => {
  if (!isContractsByChainId(obj)) {
    throw new Error(
      `There was an error building contracts by chainId from ${obj}`
    );
  }

  return {
    ...(obj as ContractsByChainId),
    contracts: (obj as ContractsByChainId).contracts.map(buildContract)
  };
};

const buildContract = (obj: any): ContractData => {
  if (!isContract(obj)) {
    throw new Error(`There was an error building contract from ${obj}`);
  }

  return { ...(obj as ContractData) };
};

const isContractsByChainId = (obj: any): boolean => {
  return (
    isType(obj, ['chainId', 'contracts'], []) &&
    (obj as ContractsByChainId).chainId != null &&
    !isNaN(Number((obj as ContractsByChainId).chainId)) &&
    (obj as ContractsByChainId).contracts != null &&
    Array.isArray((obj as ContractsByChainId).contracts)
  );
};

const isContract = (obj: any): boolean => {
  return (
    isType(obj, ['compiledPath', 'name'], ['path', 'address']) ||
    isType(obj, ['path', 'name'], ['compiledPath', 'address'])
  );
};
