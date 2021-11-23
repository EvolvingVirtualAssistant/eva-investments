import { Dictionary } from '../../types/blockchainCommunication.types.ts';
import { BaseNode } from '../entities/node.ts';
import { NodesRepository } from '../repositories/nodesRepository.ts';

export class NodesMemoryAdapter implements NodesRepository {
  private static instance: NodesMemoryAdapter;

  private nodes: Dictionary<BaseNode>;

  private constructor() {
    this.nodes = {};
  }

  static getInstance(): NodesMemoryAdapter {
    if (!NodesMemoryAdapter.instance) {
      NodesMemoryAdapter.instance = new NodesMemoryAdapter();
    }

    return NodesMemoryAdapter.instance;
  }

  getNodes(): BaseNode[] {
    const res = [];
    for (const key in this.nodes) {
      res.push(this.nodes[key]);
    }

    return res;
  }

  save(node: BaseNode): void {
    this.nodes[node.id] = node;
  }

  saveAll(nodes: BaseNode[]): void {
    nodes.forEach((node) => this.save(node));
  }

  deleteById(id: number): BaseNode {
    const res = this.nodes[id];
    delete this.nodes[id];
    return res;
  }

  deleteAll(): void {
    this.nodes = {};
  }
}
