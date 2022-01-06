import { join as pathJoin } from 'path';
export { pathJoin };
import { readdirSync, readFileSync } from 'fs';
export { readFileSync };

// config
import { config as dotEnvConfig } from 'dotenv';

// libs

// Preferred when ESM is actually supported by Node
export { getApiSignature } from 'api-signature';
//import apiSignature from 'api-signature';
//export const { getApiSignature } = apiSignature;
//export type { Sign } from 'api-signature';

// Preferred when ESM is actually supported by Node
export {
  web3,
  ConfigNodesRepository,
  NodesRepository,
  BaseNode,
  HttpNode,
  IpcNode,
  WsNode
} from 'blockchain-communication';
/*import blockchainCommunication from 'blockchain-communication';
export const { web3, BaseNode, HttpNode, IpcNode, WsNode } =
  blockchainCommunication;
export {
  ConfigNodesRepository,
  NodesRepository
} from 'blockchain-communication';*/

// Preferred when ESM is actually supported by Node
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
/*import cli from 'cli';
export const {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  getAllCliAdapters,
  println,
  CLI_ADAPTER_DEFAULT_TOKEN
} = cli;
export { Command } from 'cli';*/

// Preferred when ESM is actually supported by Node
export { execute } from 'swagger-client-mapper';
/*import swaggerClientMapper from 'swagger-client-mapper';
export const { execute } = swaggerClientMapper;*/

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
