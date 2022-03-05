import { pathJoin, ROOT_PATH } from '../../../deps';
import { readJsonFile, readTextFile } from '../../../utils/files';
import {
  BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
  BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY
} from '../../constants/blockchainCommunicationConstants';
import {
  NodesConfigRepository,
  NodeAuth,
  NodeOptions,
  buildHttpNodeOptions,
  buildIpcNodeOptions,
  buildWsNodeOptions
} from '../../../deps';
import { isType } from '../../../../src/utils/typeGuards';
import { BuildNodeAuthPathError } from '../../../../src/node-providers/errors/buildNodeAuthPathError';
import { watchFile } from '../../../utils/filesystemWatcher';

export class NodesConfigFileAdapter implements NodesConfigRepository {
  private static instance: NodesConfigFileAdapter;

  static getInstance(): NodesConfigFileAdapter {
    if (!NodesConfigFileAdapter.instance) {
      NodesConfigFileAdapter.instance = new NodesConfigFileAdapter();
    }

    return NodesConfigFileAdapter.instance;
  }

  getNodesOptions(): NodeOptions[] {
    try {
      return this.getNodesOptionsJson();
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodesOptions: ' + e);
    }

    return [];
  }

  getNodesAuth(): NodeAuth[] {
    try {
      return this.getNodesAuthJson();
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodesAuth: ' + e);
    }

    return [];
  }

  callOnChange(callback: () => void): void {
    let filepath = process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY];
    if (filepath) {
      watchFile(pathJoin(ROOT_PATH, filepath), callback);
    }

    filepath = process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY];
    if (filepath) {
      watchFile(pathJoin(ROOT_PATH, filepath), callback);
    }
  }

  private getTextFromPath(path: string): string {
    const textPath: string = pathJoin(ROOT_PATH, path?.trim() || '');

    return readTextFile(textPath);
  }

  private getJsonFromEnvKey(key: string): any {
    const jsonPath: string = pathJoin(ROOT_PATH, process.env[key] || '');

    return readJsonFile(jsonPath);
  }

  private getNodesOptionsJson(): NodeOptions[] {
    const nodesOptions: NodeOptions[] = this.getJsonFromEnvKey(
      BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY
    );

    return nodesOptions.map((opt) => {
      if (opt?.type === 'HTTP') {
        return buildHttpNodeOptions(opt);
      } else if (opt?.type === 'WS') {
        return buildWsNodeOptions(opt);
      } else if (opt?.type === 'IPC') {
        return buildIpcNodeOptions(opt);
      }

      throw Error(
        `The deserialized JSON contains the following invalid node options: ${opt}`
      );
    });
  }

  private getNodesAuthJson(): NodeAuth[] {
    const nodesAuthPaths: NodeAuthPath[] = this.getJsonFromEnvKey(
      BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY
    );

    return nodesAuthPaths.map((obj) => {
      const nodeAuthPath = buildNodeAuthPath(obj);

      return {
        url: nodeAuthPath.url,
        apiKey: this.getTextFromPath(nodeAuthPath.apiKeyPath)
      } as NodeAuth;
    });
  }
}

// -------------------------- Node Auth Path --------------------------

type NodeAuthPath = {
  url: string;
  apiKeyPath: string;
};

function buildNodeAuthPath(obj: any): NodeAuthPath {
  if (!isNodeAuthPath(obj)) {
    throw new BuildNodeAuthPathError(obj);
  }

  return { ...(obj as NodeAuthPath) };
}

function isNodeAuthPath(obj: any): boolean {
  return isType(obj, ['url', 'apiKeyPath'], []);
}
