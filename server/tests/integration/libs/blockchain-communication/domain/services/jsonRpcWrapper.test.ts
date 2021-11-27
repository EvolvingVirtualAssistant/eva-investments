import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY } from '../../../../../../src/libs/blockchain-communication/constants/blockchainCommunicationConstants.ts';
import { JsonRpcWrapper } from '../../../../../../src/libs/blockchain-communication/domain/services/jsonRpcWrapper.ts';
import { ConfigNodesFileAdapter } from '../../../../../../src/libs/blockchain-communication/driven/data-sources/configNodesFileAdapter.ts';
import { NodesMemoryAdapter } from '../../../../../../src/libs/blockchain-communication/driven/data-sources/nodesMemoryAdapter.ts';

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
