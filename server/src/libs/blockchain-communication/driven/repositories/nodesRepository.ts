// URL | API_KEY | DATE | ACCESSES (Number of writes, reads, ...) | SPEED (overall time, time per specific call)

import { BaseNode } from '../../domain/entities/node';

export interface NodesRepository {
  getNodes(): BaseNode[];

  save(node: BaseNode): void;

  saveAll(nodes: BaseNode[]): void;

  deleteById(id: number): BaseNode;

  deleteAll(): void;
}
