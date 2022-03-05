import { NodeAuth } from '../../domain/entities/nodeAuth';
import { NodeOptions } from '../../domain/entities/nodeOptions';

export interface NodesConfigRepository {
  getNodesOptions(): NodeOptions[];
  getNodesAuth(): NodeAuth[];

  callOnChange(callback: () => void): void;
}
