import { Node } from '../../domain/entities/node';

export interface NodesRepository {
  getNodes(chainId: string): Node[];

  save(chainId: string, node: Node): void;

  saveAll(chainId: string, nodes: Node[]): void;

  deleteById(chainId: string, id: number): Node;

  deleteAll(chainId: string): void;
}
