import { readJsonFile } from '../../../utils/files';
import { getContractsRepository } from '../../../appContext';
import { ContractData } from '../entities/contract';
import { Dictionary } from '../../../mod';

const callbacksOnChange: Dictionary<() => void> = {};
const getCallbacksOnChangeKey = (chainId: string, address: string) =>
  chainId + address;

export const getContractByName = (
  chainId: string,
  name: string,
  isCompiled = true
): ContractData => {
  const contract = getCompiledContractByName(chainId, name);
  validateContractPaths(contract, isCompiled);

  return contract;
};

export const getContractByAddress = (
  chainId: string,
  address: string,
  callOnChange?: () => void,
  isCompiled = true
): ContractData => {
  const contract = getCompiledContractByAddress(chainId, address, callOnChange);
  validateContractPaths(contract, isCompiled);

  return contract;
};

const validateContractPaths = (
  contract: ContractData,
  isCompiled: boolean
): void => {
  if (!isCompiled && contract.path == null) {
    throw new Error(`${contract.name} contract missing path`);
  } else if (isCompiled && contract.compiledPath == null) {
    throw new Error(`${contract.name} contract missing compiled path`);
  }
};

const getCompiledContractByName = (
  chainId: string,
  name: string
): ContractData => {
  const contracts = getContractsRepository().getContractsData(chainId, {
    name
  });

  if (contracts.length != 1) {
    throw new Error(
      `Found ${contracts.length} ${name} contracts in chain ${chainId}`
    );
  }

  return contracts[0];
};

const getCompiledContractByAddress = (
  chainId: string,
  address: string,
  callOnChange?: () => void
): ContractData => {
  const contracts = getContractsRepository().getContractsData(chainId, {
    address
  });

  if (callOnChange != null) {
    registerCallbackOnChange(chainId, address, callOnChange);
  }

  if (contracts.length != 1) {
    throw new Error(
      `Found ${contracts.length} contracts for address ${address} in chain ${chainId}`
    );
  }

  return contracts[0];
};

const registerCallbackOnChange = (
  chainId: string,
  address: string,
  callOnChange: () => void
) => {
  initializeCallbacksOnChange();

  const key = getCallbacksOnChangeKey(chainId, address);
  callbacksOnChange[key] = callOnChange;
};

const initializeCallbacksOnChange = () => {
  if (Object.keys(callbacksOnChange).length !== 0) {
    return;
  }

  const callback = (): void => {
    Object.values(callbacksOnChange).forEach((call) => call());
  };

  getContractsRepository().callOnChange(callback);
};

export const getContractABI = (contract: ContractData): any[] => {
  const contractJson = readJsonFile(contract.compiledPath);
  return contractJson?.abi;
};
