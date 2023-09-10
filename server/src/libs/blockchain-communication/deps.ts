import { join as pathJoin } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { SocketConstructorOpts } from 'net';
import { Web3 } from 'web3';
import {
  TransactionReceipt,
  Web3BaseProvider,
  BlockHeaderOutput,
  ContractAbi,
  ContractEvents,
  ContractConstructorArgs,
  HexString
} from 'web3-types';
import {
  SignTransactionResult,
  TypedTransaction,
  FeeMarketEIP1559Transaction
} from 'web3-eth-accounts';
import { IpcProvider } from 'web3-providers-ipc';
import HttpProvider from 'web3-providers-http';
import WebsocketProvider from 'web3-providers-ws';
import { EtherUnits } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { Web3Subscription, Web3EventMap } from 'web3-core';
import { logError, logDebug, logWarn } from 'logger';

type ResolvedReturnType<T> = T extends Promise<infer R> ? R : never;
type GetBlockOutput = ResolvedReturnType<
  ReturnType<typeof Web3.prototype.eth.getBlock>
>;

type GetTransactionOutput = ResolvedReturnType<
  ReturnType<typeof Web3.prototype.eth.getTransaction>
>;

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
const currentWorkingDir = __dirname + '/../../../../'; //process.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);

export {
  BlockHeaderOutput,
  GetBlockOutput,
  GetTransactionOutput,
  TypedTransaction,
  FeeMarketEIP1559Transaction,
  ContractAbi,
  ContractEvents,
  ContractConstructorArgs,
  HexString,
  Web3EventMap,
  pathJoin,
  readFileSync,
  SocketConstructorOpts,
  Web3,
  Web3BaseProvider,
  HttpProvider,
  IpcProvider,
  WebsocketProvider,
  EtherUnits,
  TransactionReceipt,
  SignTransactionResult,
  Web3Subscription,
  Contract,
  logError,
  logDebug,
  logWarn
};
