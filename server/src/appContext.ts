import {
  initBlockchainCommunication,
  initCli,
  Web3Extension,
  Socket,
  provider,
  getNonceTracker,
  logInfo
} from './deps';
import { RootCliAdapter } from './rootCliAdapter';
import { WalletsCliAdapter } from './wallets/drivers/walletsCliAdapter';
import { NodesConfigFileAdapter } from './node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodesMemoryAdapter } from './node-providers/driven/data-sources/nodesMemoryAdapter';
import { ContractsCliAdapter } from './contracts/drivers/contractsCliAdapter';
import { sleep } from './utils/async';
import { AccountsRepository } from './wallets/driven/repositories/accountsRepository';
import { AccountsConfigFileAdapter } from './wallets/driven/data-sources/accountsConfigFileAdapter';
import { ContractsConfigFileAdapter } from './contracts/driven/data-sources/contractsConfigFileAdapter';
import { ContractsRepository } from './contracts/driven/repositories/contractsRepository';
import { Dictionary } from './types/types';
import { ExternalDeps, getExternalImports } from './externalDeps';
import { ArbitrageCliAdapter } from './arbitrage/drivers/arbitrageCliAdapter';

// Furthermore as things start to grow, and I may have logging and other utilitary libs in the middle and if these
// are not completly stateless (or need to be instantiated) it may be nice to actually pass as parameter an object containing
// dependencies, instead of all dependencies each as a different argument
// may make sense to have types for these objects in each folder for that specific domain (i.e., wallets, subscribers, node-providers, ...) NOT SURE ABOUT THIS

type AppContext = {
  adapters: any[];
  web3Extensions: Dictionary<Web3Extension>;
  externalDeps?: ExternalDeps;
};

const appContext: AppContext = {
  adapters: [],
  web3Extensions: {}
};
let appContextReady = false;

export async function initAppContext() {
  await initServices();

  if (appContext.externalDeps == null) {
    appContext.externalDeps = await getExternalImports();
  }

  appContextReady = true;
  initCliAdapters();
}

async function getAsyncAppContext(): Promise<AppContext> {
  while (!appContextReady) {
    logInfo('Waiting for app context to be loaded');
    await sleep(10000);
  }

  return appContext;
}

function getAppContext(): AppContext {
  if (!appContextReady) {
    throw new Error('AppContext is not initialized.');
  }

  return appContext;
}

// Init all cliAdapters
function initCliAdapters() {
  initCli();
  return {
    rootCliAdapter: new RootCliAdapter(),
    walletsCliAdapter: new WalletsCliAdapter(),
    contractsCliAdapter: new ContractsCliAdapter(),
    arbitrageCliAdapter: new ArbitrageCliAdapter()
  };
}

async function initServices(): Promise<void> {
  await initBlockchainCommunication(
    NodesConfigFileAdapter.getInstance(),
    NodesMemoryAdapter.getInstance()
  );
}

async function initMutexesForAccounts(web3: Web3Extension): Promise<void> {
  const nonceTracker = getNonceTracker();
  const chainId = web3.chainId;
  const promises = getAccountsRepository()
    .getAccounts(chainId)
    .map((account) => account.address)
    .map((address) => {
      return nonceTracker.initAddress(web3, chainId, address);
    });

  await Promise.all(promises);
}

export function getAccountsRepository(): AccountsRepository {
  return AccountsConfigFileAdapter.getInstance();
}

export function getContractsRepository(): ContractsRepository {
  return ContractsConfigFileAdapter.getInstance();
}

// This will return a singleton if it was already created for this chainId
// so, if you pass params for a case where the singleton already exists,
// the params are ignored and you get the singleton as is (not ideal, but should suffice for now)
export async function getAsyncWeb3Extension(
  chainId: number,
  automaticProviders = true,
  provider?: provider,
  socket?: Socket,
  proxyCallbacksFilePath?: string
): Promise<Web3Extension> {
  const { web3Extensions } = await getAsyncAppContext();

  let web3Extension = web3Extensions[chainId];
  if (web3Extension == null) {
    web3Extension = new Web3Extension(
      chainId,
      automaticProviders,
      provider,
      socket,
      proxyCallbacksFilePath
    );

    await initMutexesForAccounts(web3Extension);

    web3Extensions[chainId] = web3Extension;
  }

  return web3Extension;
}

export function getWeb3Extension(chainId: number): Web3Extension {
  const { web3Extensions } = getAppContext();

  const web3Extension = web3Extensions[chainId];
  if (web3Extension == null) {
    throw new Error(
      `Web3 extension for chain id ${chainId} has not been initialized yet`
    );
  }

  return web3Extension;
}

export function getExternalDeps(): ExternalDeps {
  const context = getAppContext();

  return context.externalDeps!;
}
