import { join as pathJoin } from 'path';
export { pathJoin };
import {
  FSWatcher,
  readdirSync,
  readFileSync,
  watch,
  WatchEventType
} from 'fs';
export { FSWatcher, readFileSync, watch, WatchEventType };

// config
import { config as dotEnvConfig } from 'dotenv';

// libs

export { getApiSignature } from 'api-signature';

export {
  BlockchainCommunication,
  Node,
  NodesConfigRepository,
  NodesRepository,
  NodeAuth,
  NodeOptions,
  HttpNodeOptions,
  IpcNodeOptions,
  WsNodeOptions,
  buildHttpNodeOptions,
  buildIpcNodeOptions,
  buildWsNodeOptions
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

export { execute } from 'swagger-client-mapper';

// path config
const currentWorkingDir = process.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);
console.log('ROOT_PATH', ROOT_PATH);

console.log('Loading env file...');
const envConfig = dotEnvConfig({
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
