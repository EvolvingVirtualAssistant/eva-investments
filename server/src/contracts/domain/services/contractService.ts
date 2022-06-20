import { getContractsRepository } from '../../../appContext';
import { ContractData } from '../entities/contract';

export const getContractByName = (
  name: string,
  isCompiled = true
): ContractData => {
  const contract = getCompiledContractByName(name);

  if (!isCompiled && contract.path == null) {
    throw new Error(`${name} contract missing path`);
  } else if (isCompiled && contract.compiledPath == null) {
    throw new Error(`${name} contract missing compiled path`);
  }

  return contract;
};

const getCompiledContractByName = (name: string): ContractData => {
  const contracts = getContractsRepository().getContractsData({ name });

  if (contracts.length != 1) {
    throw new Error(`Found ${contracts.length} ${name} contracts`);
  }

  return contracts[0];
};
