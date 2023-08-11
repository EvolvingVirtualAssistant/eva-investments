import { logWarn, Web3 } from '../../../deps';
import {
  getContractABI,
  getContractByAddress
} from '../../../contracts/domain/services/contractService';
import { DecodedInput } from '../entities/transaction';
import { Dictionary } from '../../../types/types';

type ABIElem = {
  inputs: any[];
  fnName: string;
  encodedFnSignature: string;
};

type ContractABI = {
  contractName: string;
  abi: ABIElem[];
  compiledPath: string;
};

const abiByChainAndAddress: Dictionary<ContractABI> = {};
const getABIByChainAndAddressKey = (chainId: number, address: string): string =>
  chainId + address;

// Only supports decoding function types
export const decodeInput = (
  web3: Web3,
  chainId: number,
  address: string,
  input: string
): DecodedInput => {
  const { contractName, abi, compiledPath } = getABIForChainAndAddress(
    web3,
    chainId,
    address
  );

  // 0x12345678
  const inputEncodedFnSignature = input.slice(0, 10);
  const inputEncodedArgs = input.slice(10);

  for (let i = 0; i < abi.length; i++) {
    if (abi[i].encodedFnSignature !== inputEncodedFnSignature) {
      continue;
    }

    const decodedParameters = web3.eth.abi.decodeParameters(
      abi[i].inputs,
      inputEncodedArgs
    );

    return {
      contractName: contractName,
      fnName: abi[i].fnName,
      args: cleanDecodedParameters(decodedParameters)
    };
  }

  throw new Error(
    `Error while decoding input for ${address} in chain ${chainId}. Unable to find a matching function in abi ${compiledPath}.`
  );
};

const getABIForChainAndAddress = (
  web3: Web3,
  chainId: number,
  address: string
): ContractABI => {
  const key = getABIByChainAndAddressKey(chainId, address);
  let res = abiByChainAndAddress[key];
  if (res != null) {
    return res;
  }

  res = createAbiByChainAndAddress(web3, chainId, address, () => {
    try {
      abiByChainAndAddress[key] = createAbiByChainAndAddress(
        web3,
        chainId,
        address
      );
    } catch (e) {
      logWarn(
        `Unable to update ABI for chain=${chainId} and address=${address}`,
        e
      );
    }
  });
  abiByChainAndAddress[key] = res;

  return res;
};

const createAbiByChainAndAddress = (
  web3: Web3,
  chainId: number,
  address: string,
  callbackOnChange?: () => void
): ContractABI => {
  const contract = getContractByAddress(chainId, address, callbackOnChange);

  if (contract.name == null) {
    throw new Error(
      `Error while decoding input for ${address} in chain ${chainId}. Contract name is missing.`
    );
  }

  const res = {
    contractName: contract.name,
    abi: getContractABI(contract)
      .filter((elem) => elem.type === 'function')
      .map((elem) => ({
        inputs: elem.inputs,
        fnName: elem.name,
        encodedFnSignature: web3.eth.abi.encodeFunctionSignature(elem)
      })),
    compiledPath: contract.compiledPath
  };

  return res;
};

const cleanDecodedParameters = (decodedParameters: Dictionary<any>): any[] => {
  return Object.entries(decodedParameters)
    .filter((entry) => Number.parseInt(entry[0]) >= 0)
    .sort()
    .map((entry) => entry[1]);
};
