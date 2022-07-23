import { FSWatcher, pathJoin, ROOT_PATH } from '../../../deps';
import { getObjFromJson, readTextFile } from '../../../utils/files';
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
import { unwatchFile, watchFile } from '../../../utils/filesystemWatcher';
import { Dictionary } from '../../../types/types';

export class NodesConfigFileAdapter implements NodesConfigRepository {
  private static instance: NodesConfigFileAdapter;

  private watchedFiles: Dictionary<FSWatcher[]>;

  private constructor() {
    this.watchedFiles = {};
  }

  static getInstance(): NodesConfigFileAdapter {
    if (!NodesConfigFileAdapter.instance) {
      NodesConfigFileAdapter.instance = new NodesConfigFileAdapter();
    }

    return NodesConfigFileAdapter.instance;
  }

  getNodesOptions(): NodeOptions[] {
    try {
      return getObjFromJson(
        BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
        ROOT_PATH,
        buildNodesOptions
      );
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodesOptions: ' + e);
    }

    return [];
  }

  getNodesAuth(): NodeAuth[] {
    try {
      return getObjFromJson(
        BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
        ROOT_PATH,
        buildNodesAuth
      );
    } catch (e) {
      console.log('Error in NodesFileAdapter - getNodesAuth: ' + e);
    }

    return [];
  }

  callOnChange(callback: () => void): void {
    this.disableCallOnChange();

    this.watchFileChanges(
      callback,
      process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY]
    );

    this.watchFileChanges(
      callback,
      process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY]
    );
  }

  disableCallOnChange(): void {
    for (const [file, watchers] of Object.entries(this.watchedFiles)) {
      unwatchFile(file, watchers);
    }

    this.watchedFiles = {};
  }

  private watchFileChanges(callback: () => void, filepath?: string): void {
    if (filepath) {
      const path = pathJoin(ROOT_PATH, filepath);
      const watchers = this.watchedFiles[path] || [];
      const watcher = watchFile(path, callback);
      watchers.push(watcher);
      this.watchedFiles[path] = watchers;
    }
  }
}

const buildNodesOptions = (nodesOptions: NodeOptions[]): NodeOptions[] => {
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
};

const buildNodesAuth = (nodesAuthPaths: unknown[]): NodeAuth[] => {
  return nodesAuthPaths.map((obj) => {
    const nodeAuthPath = buildNodeAuthPath(obj);

    return {
      url: nodeAuthPath.url,
      apiKey: getTextFromPath(nodeAuthPath.apiKeyPath)
    } as NodeAuth;
  });
};

const getTextFromPath = (path: string): string => {
  const textPath: string = pathJoin(ROOT_PATH, path?.trim() || '');

  return readTextFile(textPath);
};

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
