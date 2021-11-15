import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { NodesFileAdapter } from '../../../../../../src/libs/blockchain-communication/nodes/data-sources/nodesFileAdapter.ts';

const nodesFileAdapter = new NodesFileAdapter();
const BLOCKCHAIN_COMMUNICATION_NODES_KEY = 'BLOCKCHAIN_COMMUNICATION_NODES';
const currentDirPath =
  '/tests/unit/libs/blockchain-communication/nodes/data-sources';

Deno.test('Should not get nodes on invalid nodes json file path', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_KEY);
  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_KEY, '/missing.json');

  const nodes = nodesFileAdapter.getNodes();
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_KEY, originalValue || '');
});

Deno.test('Should not get nodes on invalid node format', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_KEY,
    currentDirPath + '/incorrectNodesFormat.json'
  );

  const nodes = nodesFileAdapter.getNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_KEY, originalValue || '');
});

Deno.test('Should not get nodes on invalid node type', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_KEY,
    currentDirPath + '/invalidNodeType.json'
  );

  const nodes = nodesFileAdapter.getNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_KEY, originalValue || '');
});

Deno.test('Should get nodes', () => {
  const originalValue = Deno.env.get(BLOCKCHAIN_COMMUNICATION_NODES_KEY);
  Deno.env.set(
    BLOCKCHAIN_COMMUNICATION_NODES_KEY,
    currentDirPath + '/sampleNodes.json'
  );

  const nodes = nodesFileAdapter.getNodes();
  assertEquals(nodes.length, 1);

  Deno.env.set(BLOCKCHAIN_COMMUNICATION_NODES_KEY, originalValue || '');
});
