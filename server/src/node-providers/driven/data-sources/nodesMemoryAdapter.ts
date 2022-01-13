import { Dictionary } from '../../../types/types';
import { NodesRepository, Node } from '../../../deps';

export class NodesMemoryAdapter implements NodesRepository {
  private static instance: NodesMemoryAdapter;

  private nodes: Dictionary<Node>;

  private constructor() {
    this.nodes = {};
  }

  static getInstance(): NodesMemoryAdapter {
    if (!NodesMemoryAdapter.instance) {
      NodesMemoryAdapter.instance = new NodesMemoryAdapter();
    }

    return NodesMemoryAdapter.instance;
  }

  getNodes(): Node[] {
    const res = [];
    for (const key in this.nodes) {
      res.push(this.nodes[key]);
    }

    return res;
  }

  save(node: Node): void {
    this.nodes[node.id] = node;
  }

  saveAll(nodes: Node[]): void {
    nodes.forEach((node) => this.save(node));
  }

  deleteById(id: number): Node {
    const res = this.nodes[id];
    delete this.nodes[id];
    return res;
  }

  deleteAll(): void {
    this.nodes = {};
  }
}
