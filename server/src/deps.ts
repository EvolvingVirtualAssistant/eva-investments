import { join as pathJoin } from 'path';
export { pathJoin };
import {
  FSWatcher,
  readdirSync,
  readFileSync,
  unlinkSync,
  watch,
  WatchEventType,
  writeFileSync
} from 'fs';
export {
  FSWatcher,
  readFileSync,
  unlinkSync,
  watch,
  WatchEventType,
  writeFileSync
};

// config
import { config as dotEnvConfig } from 'dotenv';

// libs

export { getApiSignature } from 'api-signature';
import BN from 'bn.js';
export { BN };

import { Web3 } from 'blockchain-communication';
export { Web3 }; // without this, Web3 was undefined in certain tests
export {
  initBlockchainCommunication,
  Web3Extension,
  BlockHeader,
  BlockTransactionString,
  TransactionConfig,
  Node,
  NodesConfigRepository,
  NodesRepository,
  NodeAuth,
  NodeOptions,
  HttpNodeOptions,
  IpcNodeOptions,
  WsNodeOptions,
  Subscription,
  buildHttpNodeOptions,
  buildIpcNodeOptions,
  buildWsNodeOptions,
  Unit,
  TransactionReceipt,
  ContractSendMethod,
  SignedTransaction,
  Contract,
  NonceTracker,
  getNonceTracker,
  Socket,
  provider,
  nodeToProvider,
  attemptImport
} from 'blockchain-communication';
export { Transaction } from 'web3-core';
export { EventData } from 'web3-eth-contract';

export {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  getAllCliAdapters,
  println,
  initCli,
  terminateCli,
  CLI_ADAPTER_DEFAULT_TOKEN,
  Command
} from 'cli';

export { WorkerPool, WorkerTask } from 'worker-pool';

import { logDebug } from 'logger';
export {
  wrapWithLogger,
  logInfo,
  logDebug,
  logWarn,
  logError,
  LoggerOptions,
  LoggerOutputType
} from 'logger';

export { execute } from 'swagger-client-mapper';

// path config
const currentWorkingDir = __dirname + '/../'; //process.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);

logDebug('Loading env file...');
export const envConfig = dotEnvConfig({
  path: pathJoin(ROOT_PATH, '/resources/env/.env')
});
logDebug(envConfig);

function findRootFolder(path: string): string {
  let foldersMatched = 0;
  for (const dirEntry of readdirSync(path)) {
    if (foldersMatched === 2) {
      //root folder found
      return path;
    }

    if (dirEntry === 'src' || dirEntry === 'tests') {
      foldersMatched++;
    } else if (
      dirEntry === 'libs' ||
      dirEntry === 'unit' ||
      dirEntry === 'integration'
    ) {
      return findRootFolder(path.substr(0, path.lastIndexOf('/')));
    } else if (dirEntry === 'server' || dirEntry === 'app') {
      return findRootFolder(pathJoin(path, dirEntry));
    }
  }

  if (foldersMatched === 2) {
    //root folder found
    return path;
  }

  throw new Error('Could not find root folder');
}
