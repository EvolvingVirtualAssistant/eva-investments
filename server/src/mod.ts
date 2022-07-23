export {
  deployContract,
  deployPrecompiledContract,
  loadContract,
  loadPrecompiledContract
} from './contracts/domain/services/deployContractService';
export type { Account } from './wallets/domain/entities/accounts';
export { getAccountByAccountAddress } from './wallets/domain/services/accountsService';
export {
  signTransaction,
  sendSignedTransaction
} from './contracts/domain/services/transactionService';
export { getContractByName } from './contracts/domain/services/contractService';
export { subscribeLatestBlock } from './subscribers/domain/services/subscriptionService';
export { erc20TokenApprove } from './wallets/domain/services/tokensService';
export {
  Web3,
  Unit as EthereUnit,
  TransactionReceipt,
  ContractSendMethod,
  Contract,
  SignedTransaction,
  BN
} from './deps';
export {
  readJsonFile,
  readTextFile,
  writeJsonFile,
  writeTextFile,
  getObjFromJson
} from './utils/files';
export { watchFile } from './utils/filesystemWatcher';
export { isType } from './utils/typeGuards';
export { Dictionary } from './types/types';
export { getWeb3 } from './appContext';
