import { DeployContractService } from './contracts/domain/services/deployContractService';
import { Unit, Web3 } from './deps';

export {
  Unit as EthereUnit,
  TransactionReceipt,
  ContractSendMethod,
  SignedTransaction,
  Web3
} from './deps';
export { readJsonFile, readTextFile } from './utils/files';
export { getWeb3 } from './appContext';

// Wrapped functions (i.e., some to allow to specify the web3 instance to be used, ...)

export async function deployContract(
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
): Promise<string> {
  const deployContractService = new DeployContractService(web3);

  return await deployContractService.deploy(
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

export async function deployPrecompiledContract(
  web3: Web3,
  precompiledContractPath: any,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit,
  contractArguments?: unknown[]
): Promise<string> {
  const deployContractService = new DeployContractService(web3);

  return await deployContractService.deployPrecompiled(
    precompiledContractPath,
    deployerAccountAddress,
    host,
    gas,
    gasPrice,
    ethereUnit,
    contractArguments
  );
}
