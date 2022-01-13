import { Node } from '../../domain/entities/node';

export interface NodesRepository {
  getNodes(): Node[];

  save(node: Node): void;

  saveAll(nodes: Node[]): void;

  deleteById(id: number): Node;

  deleteAll(): void;
}
