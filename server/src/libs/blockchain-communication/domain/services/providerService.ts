import {
  Web3BaseProvider,
  HttpProvider,
  IpcProvider,
  WebsocketProvider,
  logDebug
} from '../../deps';
import { NodesRepository } from '../../driven/repositories/nodesRepository';
import { externalDeps, Web3Extension } from '../../drivers/api';
import { ProviderType } from '../../types/blockchainCommunication.types';
import {
  IpcNodeOptions,
  WsNodeOptions,
  HttpNodeOptions
} from '../entities/nodeOptions';
import { equalNodes, Node } from '../entities/node';
import { NodeError } from './errors/nodeError';
import { ProviderError } from './errors/providerError';
import { jsonStringify } from '../../utils/jsonStringify';

export function unregisterProviderRotation(): void {
  externalDeps?.unregisterProviderRotation?.();
}

export function registerProviderRotation(
  chainId: string,
  web3: Web3Extension,
  nodesRepository: NodesRepository,
  getCurrentNode: () => Node | undefined,
  setCurrentNode: (node: Node) => void
): void {
  function setProviderCallback(targetNode: Node): void {
    const currNode = getCurrentNode();
    let newNode = null;

    try {
      newNode = targetNode || fallbackGetProviderNode(chainId, nodesRepository);
    } catch (e) {
      throw new ProviderError(`Error getting provider: ${e}`);
    }

    if (equalNodes(currNode, newNode)) {
      return;
    }

    const provider = nodeToProvider(newNode);

    web3?.setProvider(provider);
    setCurrentNode(newNode);
    logDebug(
      `New provider was set (by callback): ${
        typeof provider === 'string' ? provider : jsonStringify(provider)
      }`
    );
  }

  externalDeps?.registerProviderRotation?.(setProviderCallback);
}

export function setProvider(
  chainId: string,
  web3: Web3Extension,
  nodesRepository: NodesRepository,
  currNode?: Node
): Node | undefined {
  const newNode = getWeb3ProviderNode(chainId, nodesRepository);

  if (equalNodes(currNode, newNode)) {
    return currNode;
  }

  const provider = nodeToProvider(newNode);

  web3?.setProvider(provider);
  logDebug(
    `New provider was set: ${
      typeof provider === 'string' ? provider : jsonStringify(provider)
    }`
  );

  return newNode;
}

function getWeb3ProviderNode(
  chainId: string,
  nodesRepository: NodesRepository
): Node {
  try {
    return (
      externalDeps?.getProviderNode?.(nodesRepository) ||
      fallbackGetProviderNode(chainId, nodesRepository)
    );
  } catch (e) {
    throw new ProviderError(`Error getting provider: ${e}`);
  }
}

export function nodeToProvider(node: Node): Web3BaseProvider {
  const nodeOptions = node.options[0];

  // Initialize provider
  switch (nodeOptions.type) {
    case ProviderType.HTTP:
      return new HttpProvider(nodeOptions.host, {
        ...(nodeOptions as HttpNodeOptions)
      });
    case ProviderType.WS:
      return new WebsocketProvider(
        nodeOptions.host,
        { ...nodeOptions },
        (nodeOptions as WsNodeOptions).reconnectOptions
      );
    case ProviderType.IPC:
      return new IpcProvider(
        nodeOptions.host,
        { ...(nodeOptions as IpcNodeOptions) },
        (nodeOptions as IpcNodeOptions).reconnectOptions
      );
  }

  throw new ProviderError(
    'Error transforming node to provider, as the selected node options do not contain a valid type'
  );
}

function fallbackGetProviderNode(
  chainId: string,
  nodesRepository: NodesRepository
): Node {
  const nodes = nodesRepository?.getNodes(chainId);

  if (nodes.length === 0) {
    throw new NodeError('No nodes available');
  }

  if (nodes[0].options.length === 0) {
    throw new NodeError(
      `No options available for node with url - ${nodes[0].url} and id - ${nodes[0].id}`
    );
  }

  return nodes[0];
}
