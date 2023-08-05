import { NodeAuth } from '../../domain/entities/nodeAuth';
import { NodeOptions } from '../../domain/entities/nodeOptions';

export interface NodesConfigRepository {
  getNodesOptions(chainId: string): NodeOptions[];
  getNodesAuth(chainId: string): NodeAuth[];

  callOnChange(callback: () => void): void;
  disableCallOnChange(): void;
}
