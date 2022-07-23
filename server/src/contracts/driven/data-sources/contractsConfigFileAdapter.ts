import { isType } from '../../../utils/typeGuards';
import { ROOT_PATH } from '../../../deps';
import { getObjFromJson } from '../../../utils/files';
import { ContractData } from '../../domain/entities/contract';
import {
  ContractDataFilter,
  ContractsRepository
} from '../repositories/contractsRepository';

const CONTRACTS_ENV_KEY = 'CONTRACTS';

export class ContractsConfigFileAdapter implements ContractsRepository {
  private static instance: ContractsConfigFileAdapter;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): ContractsConfigFileAdapter {
    if (!ContractsConfigFileAdapter.instance) {
      ContractsConfigFileAdapter.instance = new ContractsConfigFileAdapter();
    }

    return ContractsConfigFileAdapter.instance;
  }

  getContractsData(filter?: ContractDataFilter): ContractData[] {
    try {
      const contractsData = getObjFromJson(
        CONTRACTS_ENV_KEY,
        ROOT_PATH,
        buildContracts,
        contractsValidation
      );

      if (filter == null) {
        return contractsData;
      }

      return contractsData.filter(
        (contract) =>
          (filter.name == null || filter.name === contract.name) &&
          (filter.address == null || filter.address === contract.address) &&
          (filter.path == null || filter.path === contract.path) &&
          (filter.compiledPath == null ||
            filter.compiledPath === contract.compiledPath)
      );
    } catch (e) {
      console.log(
        'Error in ContractsConfigFileAdapter - getContractsData: ' + e
      );
    }

    return [];
  }
}

const contractsValidation = (contracts: unknown): void => {
  if (!Array.isArray(contracts)) {
    throw new Error(
      'Unable to retrieve a collection of contracts from json file'
    );
  }
};

const buildContracts = (contracts: unknown[]): ContractData[] => {
  return contracts.map(buildContract);
};

const buildContract = (obj: any): ContractData => {
  if (!isContract(obj)) {
    throw new Error(`There was an error building contract from ${obj}`);
  }

  return { ...(obj as ContractData) };
};

const isContract = (obj: any): boolean => {
  return (
    isType(obj, ['compiledPath', 'name'], ['path', 'address']) ||
    isType(obj, ['path', 'name'], ['compiledPath', 'address'])
  );
};
