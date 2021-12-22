// This will use jsonRpcWrapper to call methods
// api is the only one being exposed to the outside
// This will receive what is necessary through the constructor or even builder pattern
// and pass it to the jsonRpcWrapper

import { externalDeps } from '../externalDeps';
import { setupProxy } from '../domain/services/proxy';
import { Web3 } from '../deps';
import { sleep } from '../../../utils/async';

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
    currentDirPath + '/sampleNodes.json'
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
const web3 = new Web3(); //setupProxy(new Web3(), callbacks, '.');

export { web3 };
