// This will initialize the web3 or ethers instance
// This will initialize the provider and signer
// This will maintain singletons for web3/ethers and maybe for providers and signers

import { Web3 } from '../deps.ts';
import { Provider } from './provider.ts';
import { Signer } from './signer.ts';

import { ConfigNodesRepository } from '../nodes/repositories/configNodesRepository.ts';
import { NodesRepository } from '../nodes/repositories/nodesRepository.ts';
import { ConfigNodesFileAdapter } from '../nodes/data-sources/configNodesFileAdapter.ts';
import { NodesMemoryAdapter } from '../nodes/data-sources/nodesMemoryAdapter.ts';

export class JsonRpcWrapper {
  private static instance: JsonRpcWrapper;

  // Initialize nodes config data source
  private configNodesRepository: ConfigNodesRepository;
  // Nodes data source
  private nodesRepository: NodesRepository;

  // Blockchain client libs
  private web3: typeof Web3;

  // Provider and Signer
  private provider: Provider;
  private signer: Signer;

  private constructor(
    configNodesRepository: ConfigNodesRepository,
    nodesRepository: NodesRepository
  ) {
    this.configNodesRepository = configNodesRepository;
    this.nodesRepository = nodesRepository;
    this.loadConfigNodes();

    this.web3 = new Web3();
    this.provider = Provider.getInstance();
    this.provider.setBlockchainClientLib(this.web3);
    this.signer = Signer.getInstance();
    this.signer.setBlockchainClientLib(this.web3);
  }

  static getInstance(): JsonRpcWrapper {
    if (!JsonRpcWrapper.instance) {
      JsonRpcWrapper.instance = new JsonRpcWrapper(
        ConfigNodesFileAdapter.getInstance(),
        NodesMemoryAdapter.getInstance()
      );
    }

    return JsonRpcWrapper.instance;
  }

  private loadConfigNodes() {
    const nodes = this.configNodesRepository.getConfigNodes();

    // load config nodes in database
    this.nodesRepository.saveAll(nodes);
  }
}
