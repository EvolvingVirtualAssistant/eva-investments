import { join as pathJoin } from 'path';
import { readdirSync, readFileSync } from 'fs';
import Web3 from 'web3';
import { provider, TransactionReceipt } from 'web3-core';
import HttpProvider from 'web3-providers-http';
import WebsocketProvider from 'web3-providers-ws';
import IpcProvider from 'web3-providers-ipc';
import { Unit } from 'web3-utils';

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

// path config
const currentWorkingDir = process.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);

export {
  pathJoin,
  readFileSync,
  Web3,
  provider,
  HttpProvider,
  IpcProvider,
  WebsocketProvider,
  Unit,
  TransactionReceipt
};
