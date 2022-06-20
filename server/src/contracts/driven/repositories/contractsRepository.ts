import { ContractData } from '../../domain/entities/contract';

export type ContractDataFilter = {
  compiledPath?: string;
  path?: string;
  name?: string;
  address?: string;
};

export interface ContractsRepository {
  getContractsData(filter?: ContractDataFilter): ContractData[];
}
