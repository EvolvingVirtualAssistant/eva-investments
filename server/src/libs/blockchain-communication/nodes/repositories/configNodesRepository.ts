import { BaseNode } from '../entities/node.ts';

export interface ConfigNodesRepository {
  getConfigNodes(): BaseNode[];
}
