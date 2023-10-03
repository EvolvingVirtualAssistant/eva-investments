import { readJsonFile } from '../../../utils/files';
import {
  EtherUnits,
  Web3,
  Contract,
  logDebug,
  BN,
  ContractAbi,
  ContractConstructorArgs
} from '../../../deps';
import AccountNotFoundError from '../../../wallets/domain/services/errors/accountNotFoundError';
import ContractContentMissingError from './errors/contractContentMissingError';
import { sendTransaction } from './transactionService';
import { getAccountByAccountAddress } from '../../../wallets/domain/services/accountsService';

export const deployPrecompiledContract = async (
  web3: Web3,
  precompiledContractPath: any,
  deployerAccountAddress: string,
  host: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: bigint | undefined,
  maxFeePerGas: bigint | undefined,
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
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: bigint | undefined,
  maxFeePerGas: bigint | undefined,
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

const _deployContract = async <Abi extends ContractAbi>(
  web3: Web3,
  contractJson: any,
  deployerAccountAddress: string,
  host: string,
  gas: bigint,
  ethereUnit: EtherUnits,
  gasPrice: string | undefined,
  maxPriorityFeePerGas: bigint | undefined,
  maxFeePerGas: bigint | undefined,
  contractArguments?: unknown[]
): Promise<string> => {
  web3.setProvider(host); //"http://localhost:8545"

  const chainId = (await web3.eth.getChainId()).toString();
  const deployerAccount = getAccountByAccountAddress(
    chainId,
    deployerAccountAddress
  );
  if (!deployerAccount) {
    throw new AccountNotFoundError(chainId, deployerAccountAddress);
  }
  const contractByteCode: string =
    contractJson?.evm?.bytecode?.object || contractJson?.bytecode;
  const abi: Abi = contractJson?.abi;

  if (!contractJson || !contractByteCode || !abi) {
    throw new ContractContentMissingError(
      '',
      '',
      contractJson,
      contractByteCode,
      abi
    );
  }

  // TODO: check _loadContract comment
  const contract = new web3.eth.Contract(abi);
  const contractTxEncoded = contract
    .deploy({
      data: contractByteCode,
      arguments:
        contractArguments != null
          ? (contractArguments as ContractConstructorArgs<Abi>)
          : undefined
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

export const loadContract = <Abi extends ContractAbi>(
  web3: Web3,
  compiledContractPath: string,
  contractPath: string,
  contractName: string,
  contractAddress: string
): Contract<Abi> => {
  let contractJson = readJsonFile(compiledContractPath);
  contractJson = contractJson?.contracts[contractPath]?.[contractName];
  const abi: Abi = contractJson?.abi;

  return _loadContract(web3, abi, contractAddress);
};

export const loadPrecompiledContract = <Abi extends ContractAbi>(
  web3: Web3,
  compiledContractPath: string,
  contractAddress: string
): Contract<Abi> => {
  const contractJson = readJsonFile(compiledContractPath);
  const abi: Abi = contractJson?.abi;

  return _loadContract(web3, abi, contractAddress);
};

const _loadContract = <Abi extends ContractAbi>(
  web3: Web3,
  abi: Abi,
  contractAddress: string
): Contract<Abi> => {
  // TODO: Update web3js version to a version where contract initialization is no longer adding a listener on the requestmanager for the provider events
  // warning: MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit
  // web3_subscription_manager.js -> listenToProviderEvents -> this.requestManager.provider.on
  // this was fixed on version 2 (https://github.com/web3/web3.js/issues/1648) but potentially when migrating to version 4, they ignored everything in version 2 and 3
  return new web3.eth.Contract<Abi>(abi, contractAddress);
};
