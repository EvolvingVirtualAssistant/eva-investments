import { pathJoin, ROOT_PATH } from '../../../../deps.ts';
import { readJsonFile } from '../../../../utils/files.ts';
import {
  BaseNode,
  HttpNode,
  IpcNode,
  WsNode,
} from '../../domain/entities/node.ts';
import { NodesRepository } from '../repositories/nodesRepository.ts';

export class NodesFileAdapter implements NodesRepository {
  private NODES_PATH = 'BLOCKCHAIN_COMMUNICATION_NODES';

  constructor() {}

  // TODO Figure out a way of avoding an io operation everytime we need to get nodes info
  private getNodesJson(): BaseNode[] {
    const nodesFilePath: string = pathJoin(
      ROOT_PATH,
      Deno.env.get(this.NODES_PATH) || ''
    );

    const nodes: BaseNode[] = readJsonFile(nodesFilePath);

    return nodes.map((node) => {
      const baseNode = BaseNode.buildBaseNode(node);
      if (baseNode.getType() === 'HTTP') {
        return HttpNode.buildHttpNode(node);
      } else if (baseNode.getType() === 'WS') {
        return WsNode.buildWsNode(node);
      } else if (baseNode.getType() === 'IPC') {
        return IpcNode.buildIpcNode(node);
      }

      throw Error(
        `The deserialized JSON contains the following invalid node: ${node}`
      );
    });
  }

  getNodes(): BaseNode[] {
    try {
      return this.getNodesJson();
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodes: ' + e);
    }

    return [];
  }
}
