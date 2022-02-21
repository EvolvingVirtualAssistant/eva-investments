import { setupProxy } from '../domain/services/proxy';
import { Web3 } from '../deps';
import { NodesConfigRepository } from '../driven/repositories/nodesConfigRepository';
import { NodesRepository } from '../driven/repositories/nodesRepository';
import { loadNodes } from '../domain/services/nodesLoader';
import { UninitializedError } from './errors/uninitializedError';
import { loadCallbacks } from '../domain/services/callbacksLoader';
import { setProvider } from '../domain/services/providerService';
import { ExternalDeps, getExternalImports } from '../externalDeps';

const AUTOMATIC_PROVIDER_ROTATION_TNTERVAL = 60000; // ms

export let externalDeps: ExternalDeps | undefined;

export class BlockchainCommunication {
  private _nodesConfigRepository: NodesConfigRepository;
  private _nodesRepository: NodesRepository;

  private _web3?: Web3;
  get web3(): Web3 {
    if (this._web3 === undefined) {
      throw new UninitializedError();
    }
    return this._web3;
  }

  private _intervalId?: NodeJS.Timer;
  private _automaticProviders = true;
  get automaticProviders(): boolean {
    return this._automaticProviders;
  }
  set automaticProviders(value: boolean) {
    this._automaticProviders = value;

    if (this._automaticProviders) {
      this._intervalId = this.rotateProvider();
    } else if (this._intervalId != null) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
    }
  }

  constructor(
    nodesConfigRepository: NodesConfigRepository,
    nodesRepository: NodesRepository
  ) {
    this._nodesConfigRepository = nodesConfigRepository;
    this._nodesRepository = nodesRepository;

    loadNodes(this._nodesConfigRepository, this._nodesRepository);
  }

  async init(automaticProviders: boolean) {
    this.automaticProviders = automaticProviders;
    this._web3 = await this.setupWeb3Proxy();

    if (externalDeps == null) {
      externalDeps = await getExternalImports();
    }
  }

  private async setupWeb3Proxy(): Promise<Web3> {
    const res = new Web3();

    const callbacksByProps = await loadCallbacks();

    if (callbacksByProps != null) {
      return setupProxy(res, callbacksByProps);
    }

    return res;
  }

  // In the future consider aside from time based rotation also "manual" rotation,
  // by registering an instance of this class to the getProvider method,
  // so that this instance gets "notified" to change the provider
  private rotateProvider(): NodeJS.Timer {
    return setInterval(() => {
      if (this._web3 != null && this._automaticProviders) {
        setProvider(this._web3, this._nodesRepository);
      }
    }, AUTOMATIC_PROVIDER_ROTATION_TNTERVAL);
  }
}
