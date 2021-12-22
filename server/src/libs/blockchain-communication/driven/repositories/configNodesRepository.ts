import { BaseNode } from '../../domain/entities/node';

export interface ConfigNodesRepository {
  getConfigNodes(): BaseNode[];
}
