import { Dictionary } from '../../../types/types';
import { NodesRepository, Node } from '../../../deps';

export class NodesMemoryAdapter implements NodesRepository {
  private static instance: NodesMemoryAdapter;

  private nodesByChainId: Dictionary<Dictionary<Node>>;

  private constructor() {
    this.nodesByChainId = {};
  }

  static getInstance(): NodesMemoryAdapter {
    if (!NodesMemoryAdapter.instance) {
      NodesMemoryAdapter.instance = new NodesMemoryAdapter();
    }

    return NodesMemoryAdapter.instance;
  }

  getNodes(chainId: string): Node[] {
    const res = [];
    const nodes = this.nodesByChainId[chainId] || {};
    for (const key in nodes) {
      res.push(nodes[key]);
    }

    return res;
  }

  save(chainId: string, node: Node): void {
    let nodes = this.nodesByChainId[chainId];

    if (nodes == null) {
      nodes = {};
      this.nodesByChainId[chainId] = nodes;
    }

    nodes[node.id] = node;
  }

  saveAll(chainId: string, nodes: Node[]): void {
    nodes.forEach((node) => this.save(chainId, node));
  }

  deleteById(chainId: string, id: number): Node {
    const nodes = this.nodesByChainId[chainId];

    if (nodes == null) {
      throw new Error(
        `Unable to find chainId ${chainId} while deleting node with id ${id}`
      );
    }

    const res = nodes[id];

    if (res == null) {
      throw new Error(
        `Unable to find node with id ${id} in chainId ${chainId} while deleting node`
      );
    }

    delete nodes[id];
    return res;
  }

  deleteAll(chainId: string): void {
    this.nodesByChainId[chainId] = {};
  }
}
