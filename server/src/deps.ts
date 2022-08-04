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
  BlockchainCommunication,
  BlockHeader,
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
  NonceTracker
} from 'blockchain-communication';

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

export { execute } from 'swagger-client-mapper';

// path config
const currentWorkingDir = __dirname + '/../'; //process.cwd();
console.log('currentWorkingDir', currentWorkingDir);
export const ROOT_PATH = findRootFolder(currentWorkingDir);
console.log('ROOT_PATH', ROOT_PATH);

console.log('Loading env file...');
export const envConfig = dotEnvConfig({
  path: pathJoin(ROOT_PATH, '/resources/env/.env')
});
console.log(envConfig);

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
