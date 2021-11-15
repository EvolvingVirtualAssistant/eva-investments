// URL | API_KEY | DATE | ACCESSES (Number of writes, reads, ...) | SPEED (overall time, time per specific call)

import { BaseNode } from '../../domain/entities/node.ts';

export interface NodesRepository {
  getNodes(): BaseNode[];
}
