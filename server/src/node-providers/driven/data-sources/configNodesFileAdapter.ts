import { pathJoin, ROOT_PATH } from '../../../deps';
import { readJsonFile } from '../../../utils/files';
import { BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY } from '../../constants/blockchainCommunicationConstants';
import {
  ConfigNodesRepository,
  BaseNode,
  HttpNode,
  IpcNode,
  WsNode
} from '../../../deps';

export class ConfigNodesFileAdapter implements ConfigNodesRepository {
  private static instance: ConfigNodesFileAdapter;

  static getInstance(): ConfigNodesFileAdapter {
    if (!ConfigNodesFileAdapter.instance) {
      ConfigNodesFileAdapter.instance = new ConfigNodesFileAdapter();
    }

    return ConfigNodesFileAdapter.instance;
  }

  // TODO Figure out a way of avoding an io operation everytime we need to get nodes info
  private getConfigNodesJson(): BaseNode[] {
    const nodesFilePath: string = pathJoin(
      ROOT_PATH,
      process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] || ''
    );

    const nodes: BaseNode[] = readJsonFile(nodesFilePath);

    return nodes.map((node) => {
      const baseNode = BaseNode.buildBaseNode(node);
      if (baseNode.type === 'HTTP') {
        return HttpNode.buildHttpNode(node);
      } else if (baseNode.type === 'WS') {
        return WsNode.buildWsNode(node);
      } else if (baseNode.type === 'IPC') {
        return IpcNode.buildIpcNode(node);
      }

      throw Error(
        `The deserialized JSON contains the following invalid node: ${node}`
      );
    });
  }

  getConfigNodes(): BaseNode[] {
    try {
      return this.getConfigNodesJson();
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodes: ' + e);
    }

    return [];
  }
}
