// This will initialize the web3 or ethers instance
// This will initialize the provider and signer
// This will maintain singletons for web3/ethers and maybe for providers and signers

import { Web3 } from '../deps.ts';
import { Provider } from './provider.ts';
import { Signer } from './signer.ts';

export class JsonRpcWrapper {
  private static instance: JsonRpcWrapper;

  // Blockchain client libs
  private web3: typeof Web3;

  // Provider and Signer
  private provider: Provider;
  private signer: Signer;

  constructor() {
    this.web3 = new Web3();
    this.provider = Provider.getInstance();
    this.provider.setBlockchainClientLib(this.web3);
    this.signer = Signer.getInstance();
    this.signer.setBlockchainClientLib(this.web3);
  }

  static getInstance() {
    if (!JsonRpcWrapper.instance) {
      JsonRpcWrapper.instance = new JsonRpcWrapper();
    }

    return JsonRpcWrapper.instance;
  }
}
