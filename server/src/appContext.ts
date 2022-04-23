import { execute, BlockchainCommunication, initCli, Unit } from './deps';
import { RootCliAdapter } from './rootCliAdapter';
import { WalletsCliAdapter } from './wallets/drivers/walletsCliAdapter';
import { NodesConfigFileAdapter } from './node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodesMemoryAdapter } from './node-providers/driven/data-sources/nodesMemoryAdapter';
import { Web3 } from 'blockchain-communication/deps';
import { ContractsCliAdapter } from './contracts/drivers/contractsCliAdapter';
import { subscribeLatestBlock } from './subscribers/domain/services/subscriptionService';
import { DeployContractService } from './contracts/domain/services/deployContractService';
import { sleep } from './utils/async';

// Furthermore as things start to grow, and I may have logging and other utilitary libs in the middle and if these
// are not completly stateless (or need to be instantiated) it may be nice to actually pass as parameter an object containing
// dependencies, instead of all dependencies each as a different argument
// may make sense to have types for these objects in each folder for that specific domain (i.e., wallets, subscribers, node-providers, ...) NOT SURE ABOUT THIS

interface AppContext {
  blockchainCommunication?: BlockchainCommunication;
  deployContractService?: DeployContractService;
}

const appContext: AppContext = {};
let appContextReady = false;

export async function initAppContext() {
  await initServices();
  appContextReady = true;
  initCliAdapters();
}

async function getAppContext(): Promise<AppContext> {
  while (!appContextReady) {
    console.log('Waiting for app context to be loaded');
    sleep(100);
  }

  return appContext;
}

// Init all cliAdapters
function initCliAdapters() {
  initCli();
  return {
    rootCliAdapter: new RootCliAdapter(),
    walletsCliAdapter: new WalletsCliAdapter(),
    contractsCliAdapter: new ContractsCliAdapter(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      appContext.deployContractService!
    )
  };
}

async function initServices(): Promise<void> {
  appContext.blockchainCommunication = await initBlockchainCommunication();
  appContext.deployContractService = new DeployContractService(
    appContext.blockchainCommunication.web3
  );
}

async function initBlockchainCommunication(): Promise<BlockchainCommunication> {
  const blockchainCommunication = new BlockchainCommunication(
    NodesConfigFileAdapter.getInstance(),
    NodesMemoryAdapter.getInstance()
  );

  await blockchainCommunication.init(true);
  return blockchainCommunication;
}

export async function getWeb3(): Promise<Web3> {
  const context = await getAppContext();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return context.blockchainCommunication!.web3;
}
