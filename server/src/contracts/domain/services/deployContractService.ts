import { readJsonFile } from '../../../utils/files';
import { Unit, Web3, Contract, logDebug, BN } from '../../../deps';
import AccountNotFoundError from '../../../wallets/domain/services/errors/accountNotFoundError';
import ContractContentMissingError from './errors/contractContentMissingError';
import { sendTransaction } from './transactionService';
import { getAccountByAccountAddress } from '../../../wallets/domain/services/accountsService';

export const deployPrecompiledContract = async (
  web3: Web3,
  precompiledContractPath: any,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  ethereUnit: Unit,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: BN | undefined,
  maxFeePerGas: BN | undefined,
  contractArguments?: unknown[]
): Promise<string> => {
  const contractJson = readJsonFile(precompiledContractPath);

  return await _deployContract(
    web3,
    contractJson,
    deployerAccountAddress,
    host,
    gas,
    ethereUnit,
    gasPrice,
    maxPriorityFeePerGas,
    maxFeePerGas,
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
  ethereUnit: Unit,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: BN | undefined,
  maxFeePerGas: BN | undefined,
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
    ethereUnit,
    gasPrice,
    maxPriorityFeePerGas,
    maxFeePerGas,
    contractArguments
  );
};

const _deployContract = async (
  web3: Web3,
  contractJson: any,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  ethereUnit: Unit,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: BN | undefined,
  maxFeePerGas: BN | undefined,
  contractArguments: unknown[] = []
): Promise<string> => {
  web3.setProvider(host); //"http://localhost:8545"

  const chainId = await web3.eth.getChainId();
  const deployerAccount = getAccountByAccountAddress(
    chainId,
    deployerAccountAddress
  );
  if (!deployerAccount) {
    throw new AccountNotFoundError(chainId, deployerAccountAddress);
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

  const contract = new web3.eth.Contract(abi);
  const contractTxEncoded = contract
    .deploy({
      data: contractByteCode,
      arguments: contractArguments
    })
    .encodeABI();

  // still need to handle error scenarios
  const createReceipt = await sendTransaction(
    chainId,
    web3,
    deployerAccount,
    contractTxEncoded,
    gas,
    ethereUnit,
    gasPrice,
    maxPriorityFeePerGas,
    maxFeePerGas
  );

  logDebug(`Contract deployed receipt: ${JSON.stringify(createReceipt)}`);

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
