import { test, assertEquals } from '../../../../wrap/testWrapper';
import { NodesMemoryAdapter } from '../../../../../src/node-providers/driven/data-sources/nodesMemoryAdapter';
import { Node } from '../../../../../src/libs/blockchain-communication/mod';

const nodesMemoryAdapter = NodesMemoryAdapter.getInstance();

const mockNodes: Node[] = [
  {
    id: 1,
    url: 'localhost',
    options: []
  }
];

test('Should get nodes', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  const nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

test('Should save node', () => {
  nodesMemoryAdapter.deleteAll();

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.save(mockNodes[0]);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

test('Should save all nodes', () => {
  nodesMemoryAdapter.deleteAll();

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.saveAll(mockNodes);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

test('Should delete nodes by id', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  const node = nodesMemoryAdapter.deleteById(mockNodes[0].id);
  assertEquals(node.id, mockNodes[0].id);
  assertEquals(node.url, mockNodes[0].url);
  assertEquals(node.options, mockNodes[0].options);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.deleteAll();
});

test('Should delete all nodes', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);
});
