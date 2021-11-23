import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY } from '../../../../../../src/libs/blockchain-communication/constants/blockchainCommunicationConstants.ts';
import { ConfigNodesFileAdapter } from '../../../../../../src/libs/blockchain-communication/nodes/data-sources/configNodesFileAdapter.ts';

const nodesFileAdapter = ConfigNodesFileAdapter.getInstance();
const currentDirPath = '/tests/resources/libs/blockchain-communication';

Deno.test('Should not get nodes on invalid nodes json file path', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY,
    currentDirPath + '/missing.json'
  );

  const nodes = nodesFileAdapter.getConfigNodes();
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY, originalValue || '');
});

Deno.test('Should not get nodes on invalid node format', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY,
    currentDirPath + '/incorrectNodesFormat.json'
  );

  const nodes = nodesFileAdapter.getConfigNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY, originalValue || '');
});

Deno.test('Should not get nodes on invalid node type', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY,
    currentDirPath + '/invalidNodeType.json'
  );

  const nodes = nodesFileAdapter.getConfigNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY, originalValue || '');
});

Deno.test('Should get nodes', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY,
    currentDirPath + '/sampleNodes.json'
  );

  const nodes = nodesFileAdapter.getConfigNodes();
  assertEquals(nodes.length, 1);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY, originalValue || '');
});
