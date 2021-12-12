import { BaseNode } from '../../domain/entities/node.ts';

export interface ConfigNodesRepository {
  getConfigNodes(): BaseNode[];
}
