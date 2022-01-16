export {
  web3,
  Unit as EthereUnit,
  TransactionReceipt,
  ContractSendMethod,
  SignedTransaction
} from './deps';
export {
  deploy as deployContract,
  deployPrecompiled as deployPrecompiledContract
} from './contracts/domain/services/deployContractService';
export { readJsonFile, readTextFile } from './utils/files';
