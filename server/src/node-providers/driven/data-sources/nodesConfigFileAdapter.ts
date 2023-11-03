import { FSWatcher, logWarn, pathJoin, ROOT_PATH } from '../../../deps';
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
import { isType } from '../../../utils/typeGuards';
import { BuildNodeAuthPathError } from '../../../node-providers/errors/buildNodeAuthPathError';
import { unwatchFile, watchFile } from '../../../utils/filesystemWatcher';
import { Dictionary } from '../../../types/types';

type NodesOptionsByChainId = {
  chainId: string;
  nodesOptions: NodeOptions[];
};

type NodesAuthsByChainId = {
  chainId: string;
  nodesAuths: NodeAuth[];
};

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

  getNodesOptions(chainId: string): NodeOptions[] {
    try {
      const nodesOptionsByChainId = getObjFromJson(
        BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
        ROOT_PATH,
        buildNodesOptions,
        nodesOptionsValidation
      );

      return (
        nodesOptionsByChainId.find(
          (nodesOptionsByChainId) => nodesOptionsByChainId.chainId === chainId
        )?.nodesOptions || []
      );
    } catch (e) {
      logWarn('Error in NodesFileAdapter - getNodesOptions: ' + e);
    }

    return [];
  }

  getNodesAuth(chainId: string): NodeAuth[] {
    try {
      const nodesAuthsByChainId = getObjFromJson(
        BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
        ROOT_PATH,
        buildNodesAuths,
        nodesAuthsValidation
      );

      return (
        nodesAuthsByChainId.find(
          (nodesAuthsByChainId) => nodesAuthsByChainId.chainId === chainId
        )?.nodesAuths || []
      );
    } catch (e) {
      logWarn('Error in NodesFileAdapter - getNodesAuth: ' + e);
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

const nodesOptionsValidation = (nodesOptions: unknown): void => {
  if (!Array.isArray(nodesOptions)) {
    throw new Error(
      'Unable to retrieve a collection of nodes options from json file'
    );
  }
};

const buildNodesOptions = (
  nodesOptionsByChainId: NodesOptionsByChainId[]
): NodesOptionsByChainId[] => {
  return nodesOptionsByChainId.map(buildNodesOptionsByChainId);
};

const buildNodesOptionsByChainId = (obj: unknown): NodesOptionsByChainId => {
  if (!isNodesOptionsByChainId(obj)) {
    throw new Error(
      `There was an error building nodes options by chainId from ${obj}`
    );
  }

  return {
    ...(obj as NodesOptionsByChainId),
    nodesOptions: (obj as NodesOptionsByChainId).nodesOptions.map(
      buildNodeOptions
    )
  };
};

const buildNodeOptions = (nodesOptions: NodeOptions): NodeOptions => {
  if (nodesOptions?.type === 'HTTP') {
    return buildHttpNodeOptions(nodesOptions);
  } else if (nodesOptions?.type === 'WS') {
    return buildWsNodeOptions(nodesOptions);
  } else if (nodesOptions?.type === 'IPC') {
    return buildIpcNodeOptions(nodesOptions);
  }

  throw new Error(
    `The deserialized JSON contains the following invalid node options: ${nodesOptions}`
  );
};

const isNodesOptionsByChainId = (obj: any): boolean => {
  return (
    isType(obj, ['chainId', 'nodesOptions'], []) &&
    (obj as NodesOptionsByChainId).chainId != null &&
    !isNaN(Number((obj as NodesOptionsByChainId).chainId)) &&
    (obj as NodesOptionsByChainId).nodesOptions != null &&
    Array.isArray((obj as NodesOptionsByChainId).nodesOptions)
  );
};

const nodesAuthsValidation = (nodesAuths: unknown): void => {
  if (!Array.isArray(nodesAuths)) {
    throw new Error(
      'Unable to retrieve a collection of nodes auth from json file'
    );
  }
};

const buildNodesAuths = (
  nodesAuthsByChainId: NodesAuthsByChainId[]
): NodesAuthsByChainId[] => {
  return nodesAuthsByChainId.map(buildNodesAuthsByChainId);
};

const buildNodesAuthsByChainId = (obj: unknown): NodesAuthsByChainId => {
  if (!isNodesAuthsByChainId(obj)) {
    throw new Error(
      `There was an error building nodes options by chainId from ${obj}`
    );
  }

  return {
    ...(obj as NodesAuthsByChainId),
    nodesAuths: (obj as NodesAuthsByChainId).nodesAuths.map(buildNodesAuth)
  };
};

const buildNodesAuth = (nodesAuthPaths: unknown): NodeAuth => {
  const nodeAuthPath = buildNodeAuthPath(nodesAuthPaths);

  return {
    url: nodeAuthPath.url,
    apiKey: getTextFromPath(nodeAuthPath.apiKeyPath)
  } as NodeAuth;
};

const isNodesAuthsByChainId = (obj: any): boolean => {
  return (
    isType(obj, ['chainId', 'nodesAuths'], []) &&
    (obj as NodesAuthsByChainId).chainId != null &&
    !isNaN(Number((obj as NodesAuthsByChainId).chainId)) &&
    (obj as NodesAuthsByChainId).nodesAuths != null &&
    Array.isArray((obj as NodesAuthsByChainId).nodesAuths)
  );
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
