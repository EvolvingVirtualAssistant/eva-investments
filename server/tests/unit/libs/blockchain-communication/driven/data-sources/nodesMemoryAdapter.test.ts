import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { NodesMemoryAdapter } from '../../../../../../src/libs/blockchain-communication/driven/data-sources/nodesMemoryAdapter.ts';
import { BaseNode } from '../../../../../../src/libs/blockchain-communication/domain/entities/node.ts';

const nodesMemoryAdapter = NodesMemoryAdapter.getInstance();

const mockNodes: BaseNode[] = [
  {
    id: 1,
    type: 'HTTP',
    host: 'localhost',
  },
];

Deno.test('Should get nodes', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  const nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

Deno.test('Should save node', () => {
  nodesMemoryAdapter.deleteAll();

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.save(mockNodes[0]);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

Deno.test('Should save all nodes', () => {
  nodesMemoryAdapter.deleteAll();

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.saveAll(mockNodes);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();
});

Deno.test('Should delete nodes by id', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  const node = nodesMemoryAdapter.deleteById(mockNodes[0].id);
  assertEquals(node.id, mockNodes[0].id);
  assertEquals(node.host, mockNodes[0].host);
  assertEquals(node.type, mockNodes[0].type);

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);

  nodesMemoryAdapter.deleteAll();
});

Deno.test('Should delete all nodes', () => {
  nodesMemoryAdapter.deleteAll();
  nodesMemoryAdapter.saveAll(mockNodes);

  let nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 1);

  nodesMemoryAdapter.deleteAll();

  nodes = nodesMemoryAdapter.getNodes();
  assertEquals(nodes.length, 0);
});
