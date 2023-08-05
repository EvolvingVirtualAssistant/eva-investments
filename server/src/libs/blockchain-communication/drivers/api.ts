import { setupProxy } from '../domain/services/proxy';
import { Web3, Web3BaseProvider } from '../deps';
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
import { ExternalDeps, getExternalImports } from '../externalDeps';

const AUTOMATIC_PROVIDER_ROTATION_TNTERVAL = 60000; // ms

export let externalDeps: ExternalDeps | undefined;

let _nodesConfigRepository: NodesConfigRepository;
let _nodesRepository: NodesRepository;

export const initBlockchainCommunication = async (
  nodesConfigRepository: NodesConfigRepository,
  nodesRepository: NodesRepository
): Promise<void> => {
  _nodesConfigRepository = nodesConfigRepository;
  _nodesRepository = nodesRepository;

  if (externalDeps == null) {
    externalDeps = await getExternalImports();
  }
};

const setupWeb3Proxy = async (
  web3: Web3,
  proxyCallbacksFilePath?: string
): Promise<void> => {
  const callbacksByProps = await loadCallbacks(proxyCallbacksFilePath);

  if (callbacksByProps != null) {
    web3 = setupProxy(web3, callbacksByProps);
  }
};

export class Web3Extension extends Web3 {
  private _chainId: string;
  private _currentNode: Node | undefined;

  constructor(
    chainId: string,
    automaticProviders: boolean,
    provider: Web3BaseProvider,
    proxyCallbacksFilePath?: string
  );
  constructor(
    chainId: string,
    automaticProviders: boolean,
    provider?: Web3BaseProvider,
    proxyCallbacksFilePath?: string
  );
  constructor(
    chainId: string,
    automaticProviders: boolean,
    provider?: Web3BaseProvider,
    proxyCallbacksFilePath?: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(provider!);
    this._chainId = chainId;

    if (_nodesConfigRepository == null || _nodesRepository == null) {
      throw new UninitializedError();
    }

    loadNodes(this._chainId, _nodesConfigRepository, _nodesRepository, true);

    if (proxyCallbacksFilePath != null) {
      setupWeb3Proxy(this, proxyCallbacksFilePath);
    }

    this.setProvider = new Proxy(this.setProvider, {
      // eslint-disable-next-line @typescript-eslint/ban-types
      apply: (targetObj: Function, thisArg: any, argumentsList: any[]) => {
        const res = Reflect.apply(targetObj, thisArg, argumentsList);
        this.eth
          .getChainId()
          .then((chainId) => (this._chainId = chainId.toString()));
        return res;
      }
    }) as (provider: Web3BaseProvider) => boolean;

    this.automaticProviders = automaticProviders;
  }

  get chainId(): bigint {
    return BigInt(this._chainId);
  }

  get currentNode(): Node {
    if (this._currentNode == null) {
      throw new UninitializedError();
    }
    return this._currentNode;
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

  private rotateProvider(): void {
    if (this._timeoutId != null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }

    if (this._automaticProviders) {
      if (_nodesRepository == null) {
        throw new UninitializedError();
      }

      registerProviderRotation(
        this._chainId,
        this,
        _nodesRepository,
        () => this._currentNode,
        (node: Node) => (this._currentNode = node)
      );
    }

    this.setProviderTimeout();
  }

  private setProviderTimeout(): void {
    if (this._automaticProviders) {
      if (_nodesRepository == null) {
        throw new UninitializedError();
      }

      this._currentNode = setProvider(
        this._chainId,
        this,
        _nodesRepository,
        this._currentNode
      );
    }

    this._timeoutId = setTimeout(
      () => this.setProviderTimeout(),
      AUTOMATIC_PROVIDER_ROTATION_TNTERVAL
    );
  }
}
