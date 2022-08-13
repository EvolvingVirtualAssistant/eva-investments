import { NodeAuth } from '../../domain/entities/nodeAuth';
import { NodeOptions } from '../../domain/entities/nodeOptions';

export interface NodesConfigRepository {
  getNodesOptions(chainId: number): NodeOptions[];
  getNodesAuth(chainId: number): NodeAuth[];

  callOnChange(callback: () => void): void;
  disableCallOnChange(): void;
}
