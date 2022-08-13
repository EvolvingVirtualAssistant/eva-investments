import { getContractsRepository } from '../../../appContext';
import { ContractData } from '../entities/contract';

export const getContractByName = (
  chainId: number,
  name: string,
  isCompiled = true
): ContractData => {
  const contract = getCompiledContractByName(chainId, name);

  if (!isCompiled && contract.path == null) {
    throw new Error(`${name} contract missing path`);
  } else if (isCompiled && contract.compiledPath == null) {
    throw new Error(`${name} contract missing compiled path`);
  }

  return contract;
};

const getCompiledContractByName = (
  chainId: number,
  name: string
): ContractData => {
  const contracts = getContractsRepository().getContractsData(chainId, {
    name
  });

  if (contracts.length != 1) {
    throw new Error(`Found ${contracts.length} ${name} contracts`);
  }

  return contracts[0];
};
