import { readJsonFile } from '../../../utils/files';
import { Unit, Web3, Contract } from '../../../deps';
import AccountNotFoundError from '../../../wallets/domain/services/errors/accountNotFoundError';
import ContractContentMissingError from './errors/contractContentMissingError';
import { sendSignedTransaction, signTransaction } from './transactionService';
import { getAccountByAccountAddress } from '../../../wallets/domain/services/accountsService';

export class DeployContractService {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  async deployPrecompiledContract(
    precompiledContractPath: any,
    deployerAccountAddress: string,
    host: string,
    gas: number,
    gasPrice: string,
    ethereUnit: Unit,
    contractArguments?: unknown[]
  ): Promise<string> {
    return await deployPrecompiledContract(
      this.web3,
      precompiledContractPath,
      deployerAccountAddress,
      host,
      gas,
      gasPrice,
      ethereUnit,
      contractArguments
    );
  }

  async deployContract(
    contractPath: string,
    contractName: string,
    compiledContractPath: string,
    deployerAccountAddress: string,
    host: string,
    gas: number,
    gasPrice: string,
    ethereUnit: Unit,
    contractArguments?: unknown[]
  ): Promise<string> {
    return await deployContract(
      this.web3,
      contractPath,
      contractName,
      compiledContractPath,
      deployerAccountAddress,
      host,
      gas,
      gasPrice,
      ethereUnit,
      contractArguments
    );
  }

  loadContract(
    compiledContractPath: string,
    contractPath: string,
    contractName: string,
    contractAddress: string
  ): Contract {
    return loadContract(
      this.web3,
      compiledContractPath,
      contractPath,
      contractName,
      contractAddress
    );
  }

  loadPrecompiledContract(
    compiledContractPath: string,
    contractAddress: string
  ): Contract {
    return loadPrecompiledContract(
      this.web3,
      compiledContractPath,
      contractAddress
    );
  }
}

export const deployPrecompiledContract = async (
  web3: Web3,
  precompiledContractPath: any,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit,
  contractArguments?: unknown[]
): Promise<string> => {
  const contractJson = readJsonFile(precompiledContractPath);

  return await _deployContract(
    web3,
    contractJson,
    deployerAccountAddress,
    host,
    gas,
    gasPrice,
    ethereUnit,
    contractArguments
  );
};

export const deployContract = async (
  web3: Web3,
  contractPath: string,
  contractName: string,
  compiledContractPath: string,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit,
  contractArguments?: unknown[]
): Promise<string> => {
  let contractJson = readJsonFile(compiledContractPath);
  contractJson = contractJson?.contracts[contractPath]?.[contractName];

  return await _deployContract(
    web3,
    contractJson,
    deployerAccountAddress,
    host,
    gas,
    gasPrice,
    ethereUnit,
    contractArguments
  );
};

const _deployContract = async (
  web3: Web3,
  contractJson: any,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit,
  contractArguments: unknown[] = []
): Promise<string> => {
  const deployerAccount = getAccountByAccountAddress(deployerAccountAddress);
  if (!deployerAccount) {
    throw new AccountNotFoundError(deployerAccountAddress);
  }
  const contractByteCode: string =
    contractJson?.evm?.bytecode?.object || contractJson?.bytecode;
  const abi: [] = contractJson?.abi;

  if (!contractJson || !contractByteCode || !abi) {
    throw new ContractContentMissingError(
      '',
      '',
      contractJson,
      contractByteCode,
      abi
    );
  }

  web3.setProvider(host); //"http://localhost:8545"

  const contract = new web3.eth.Contract(abi);
  const contractTxEncoded = contract
    .deploy({
      data: contractByteCode,
      arguments: contractArguments
    })
    .encodeABI();
  const createTransaction = await signTransaction(
    web3,
    deployerAccount,
    contractTxEncoded,
    gas,
    gasPrice,
    ethereUnit
  );

  // still need to handle error scenarios

  const createReceipt = await sendSignedTransaction(web3, createTransaction);

  console.log(`Contract deployed receipt: ${JSON.stringify(createReceipt)}`);

  if (!createReceipt.contractAddress) {
    throw new Error('Contract address not available');
  }

  return createReceipt.contractAddress;
};

export const loadContract = (
  web3: Web3,
  compiledContractPath: string,
  contractPath: string,
  contractName: string,
  contractAddress: string
): Contract => {
  let contractJson = readJsonFile(compiledContractPath);
  contractJson = contractJson?.contracts[contractPath]?.[contractName];
  const abi: [] = contractJson?.abi;

  return _loadContract(web3, abi, contractAddress);
};

export const loadPrecompiledContract = (
  web3: Web3,
  compiledContractPath: string,
  contractAddress: string
): Contract => {
  const contractJson = readJsonFile(compiledContractPath);
  const abi: [] = contractJson?.abi;

  return _loadContract(web3, abi, contractAddress);
};

const _loadContract = (
  web3: Web3,
  abi: [],
  contractAddress: string
): Contract => {
  return new web3.eth.Contract(abi, contractAddress);
};
