import { NodesRepository, Node } from '../../../deps';

export class NodesDBAdapter implements NodesRepository {
  private static instance: NodesDBAdapter;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): NodesDBAdapter {
    if (!NodesDBAdapter.instance) {
      NodesDBAdapter.instance = new NodesDBAdapter();
    }

    return NodesDBAdapter.instance;
  }

  getNodes(): Node[] {
    throw new Error('Method not implemented.');
  }
  save(node: Node): void {
    throw new Error('Method not implemented.');
  }
  saveAll(nodes: Node[]): void {
    throw new Error('Method not implemented.');
  }
  deleteById(id: number): Node {
    throw new Error('Method not implemented.');
  }
  deleteAll(): void {
    throw new Error('Method not implemented.');
  }
}
