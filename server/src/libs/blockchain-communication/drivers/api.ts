// This will use jsonRpcWrapper to call methods
// api is the only one being exposed to the outside
// This will receive what is necessary through the constructor or even builder pattern
// and pass it to the jsonRpcWrapper

import { setupProxy } from '../domain/services/proxy';
import { Web3 } from '../deps';
import { sleep } from '../utils/async';
import { NodesConfigRepository } from '../driven/repositories/nodesConfigRepository';
import { NodesRepository } from '../driven/repositories/nodesRepository';
import { loadNodes } from '../domain/services/nodesLoader';
import { UninitializedError } from '../errors/uninitializedError';
import { loadCallbacks } from '../domain/services/callbacksLoader';

/*var options = {
      keepAlive: true,
      withCredentials: false,
      timeout: 20000, // ms
      headers: [
        {
          name: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
      agent: {
        http: http.Agent(...),
        baseUrl: '',
      },
    };*/
/*this.web3Provider = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
    this.web3Provider.eth.getAccounts().then(console.log);

    const a = 0;*/

/*
private loadConfigNodes() {
    const nodes = this.configNodesRepository.getConfigNodes();

    // load config nodes in data source
    this.nodesRepository.saveAll(nodes);
  }

// Tests
import { assertEquals } from 'https://deno.land/std/testing/asserts';
import { BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY } from '../../../../../../src/libs/blockchain-communication/constants/blockchainCommunicationConstants';
import { JsonRpcWrapper } from '../../../../../../src/libs/blockchain-communication/domain/services/jsonRpcWrapper';
import { ConfigNodesFileAdapter } from '../../../../../../src/libs/blockchain-communication/driven/data-sources/configNodesFileAdapter';
import { NodesMemoryAdapter } from '../../../../../../src/libs/blockchain-communication/driven/data-sources/nodesMemoryAdapter';

const nodesFileRepository = NodesMemoryAdapter.getInstance();
const configNodesFileRepository = ConfigNodesFileAdapter.getInstance();
const currentDirPath = '/tests/resources/libs/blockchain-communication';

function cleanRepositories() {
  nodesFileRepository.deleteAll();
}

Deno.test('Should load config nodes on json rpc wrapper initialization', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY,
    currentDirPath + '/sampleNodesOptions.json'
  );
  cleanRepositories();

  let nodes = nodesFileRepository.getNodes();
  assertEquals(nodes.length, 0);

  JsonRpcWrapper.getInstance();
  const configNodes = configNodesFileRepository.getConfigNodes();
  nodes = nodesFileRepository.getNodes();
  assertEquals(configNodes.length, 1);
  assertEquals(nodes.length, 1);
  assertEquals(nodes[0].id, configNodes[0].id);

  cleanRepositories();
  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY, originalValue || '');
});
*/

// Have a file with the mappings of callbacks for web3 methods in resources.
const callbacks: [
  string,
  ((targetObj: object, thisArg: any, argumentsList: any[]) => any)[]
][] = [
  [
    'eth.subscribe',
    [
      async (arg1: object, arg2: any, arg3: any[]) => {
        const b = 0;
        await sleep(1000);
        console.log('Async');
      },
      (arg1: object, arg2: any, arg3: any[]) => {
        const b = 0;
        console.log('Throw Error Sync');
      },
      (arg1: object, arg2: any, arg3: any[]) => {
        const b = 0;
        console.log('Sync');
      },
      (arg1: object, arg2: any, arg3: any[]) => {
        const b = 0;
        console.log('Throw Error Async');
      }
    ]
  ]
];
// const web3Provider = new Web3(
//  new Web3.providers.HttpProvider('http://localhost:8545')
//);
//web3Provider.eth.getAccounts().then(console.log);

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

  constructor(
    nodesConfigRepository: NodesConfigRepository,
    nodesRepository: NodesRepository
  ) {
    this._nodesConfigRepository = nodesConfigRepository;
    this._nodesRepository = nodesRepository;

    loadNodes(this._nodesConfigRepository, this._nodesRepository);
  }

  async init() {
    this._web3 = await this.setupWeb3Proxy();
  }

  private async setupWeb3Proxy(): Promise<Web3> {
    const res = new Web3();

    const callbacksByProps = await loadCallbacks();

    if (callbacksByProps != null) {
      return setupProxy(res, callbacksByProps);
    }

    return res;
  }
}
