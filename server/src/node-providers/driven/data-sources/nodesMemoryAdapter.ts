import { Dictionary } from '../../../types/types.ts';
import {
  NodesRepository,
  BaseNode,
} from '../../../libs/blockchain-communication/mod.ts';

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
