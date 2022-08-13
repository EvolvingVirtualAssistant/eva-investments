import { Node } from '../../domain/entities/node';

export interface NodesRepository {
  getNodes(chainId: number): Node[];

  save(chainId: number, node: Node): void;

  saveAll(chainId: number, nodes: Node[]): void;

  deleteById(chainId: number, id: number): Node;

  deleteAll(chainId: number): void;
}
