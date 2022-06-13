import { setupProxy } from '../domain/services/proxy';
import { Web3 } from '../deps';
import { NodesConfigRepository } from '../driven/repositories/nodesConfigRepository';
import { NodesRepository } from '../driven/repositories/nodesRepository';
import { Node } from '../domain/entities/node';
import { loadNodes } from '../domain/services/nodesLoader';
import { UninitializedError } from './errors/uninitializedError';
import { loadCallbacks } from '../domain/services/callbacksLoader';
import {
  registerProviderRotation,
  unregisterProviderRotation,
  setProvider
} from '../domain/services/providerService';
import type { NonceTracker } from '../domain/services/nonceTracker';
import getNonceTracker from '../domain/services/nonceTracker';
import { ExternalDeps, getExternalImports } from '../externalDeps';

const AUTOMATIC_PROVIDER_ROTATION_TNTERVAL = 60000; // ms

export let externalDeps: ExternalDeps | undefined;

export class BlockchainCommunication {
  private _nodesConfigRepository: NodesConfigRepository;
  private _nodesRepository: NodesRepository;

  private _currentNode: Node | undefined;

  private _web3?: Web3;
  get web3(): Web3 {
    if (this._web3 === undefined) {
      throw new UninitializedError();
    }
    return this._web3;
  }

  private _timeoutId?: NodeJS.Timer;
  private _automaticProviders = true;
  get automaticProviders(): boolean {
    return this._automaticProviders;
  }
  set automaticProviders(value: boolean) {
    this._automaticProviders = value;

    if (this._automaticProviders) {
      this.rotateProvider();
    } else {
      if (this._timeoutId != null) {
        clearTimeout(this._timeoutId);
        this._timeoutId = undefined;
      }

      unregisterProviderRotation();
    }
  }

  private _nonceTracker?: NonceTracker;
  get nonceTracker(): NonceTracker {
    if (this._nonceTracker === undefined) {
      throw new UninitializedError();
    }
    return this._nonceTracker;
  }

  constructor(
    nodesConfigRepository: NodesConfigRepository,
    nodesRepository: NodesRepository
  ) {
    this._nodesConfigRepository = nodesConfigRepository;
    this._nodesRepository = nodesRepository;

    loadNodes(this._nodesConfigRepository, this._nodesRepository, true);
  }

  async init(automaticProviders: boolean) {
    this._web3 = await this.setupWeb3Proxy();

    if (externalDeps == null) {
      externalDeps = await getExternalImports();
    }

    this.automaticProviders = automaticProviders;
    this._nonceTracker = getNonceTracker();
  }

  private async setupWeb3Proxy(): Promise<Web3> {
    const res = new Web3();

    const callbacksByProps = await loadCallbacks();

    if (callbacksByProps != null) {
      return setupProxy(res, callbacksByProps);
    }

    return res;
  }

  private rotateProvider(): void {
    if (this._timeoutId != null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }

    if (this._web3 != null && this._automaticProviders) {
      registerProviderRotation(
        this._web3,
        this._nodesRepository,
        () => this._currentNode,
        (node: Node) => (this._currentNode = node)
      );
    }

    this.setProviderTimeout();
  }

  private setProviderTimeout(): void {
    if (this._web3 != null && this._automaticProviders) {
      this._currentNode = setProvider(
        this._web3,
        this._nodesRepository,
        this._currentNode
      );
    }

    this._timeoutId = setTimeout(
      () => this.setProviderTimeout(),
      AUTOMATIC_PROVIDER_ROTATION_TNTERVAL
    );
  }
}
