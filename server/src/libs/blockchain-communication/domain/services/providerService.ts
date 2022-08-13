import {
  Web3,
  provider,
  HttpProvider,
  IpcProvider,
  WebsocketProvider
} from '../../deps';
import { NodesRepository } from '../../driven/repositories/nodesRepository';
import { externalDeps } from '../../drivers/api';
import { ProviderType } from '../../types/blockchainCommunication.types';
import { NodeOptions } from '../entities/nodeOptions';
import { equalNodes, Node } from '../entities/node';
import { NodeError } from './errors/nodeError';
import { ProviderError } from './errors/providerError';
import { jsonStringify } from '../../utils/jsonStringify';

export function unregisterProviderRotation(): void {
  externalDeps?.unregisterProviderRotation?.();
}

export function registerProviderRotation(
  chainId: number,
  web3: Web3,
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
    console.log(
      `New provider was set (by callback): ${
        typeof provider === 'string' ? provider : jsonStringify(provider)
      }`
    );
  }

  externalDeps?.registerProviderRotation?.(setProviderCallback);
}

export function setProvider(
  chainId: number,
  web3: Web3,
  nodesRepository: NodesRepository,
  currNode?: Node
): Node | undefined {
  const newNode = getWeb3ProviderNode(chainId, nodesRepository);

  if (equalNodes(currNode, newNode)) {
    return currNode;
  }

  const provider = nodeToProvider(newNode);

  web3?.setProvider(provider);
  console.log(
    `New provider was set: ${
      typeof provider === 'string' ? provider : jsonStringify(provider)
    }`
  );

  return newNode;
}

function getWeb3ProviderNode(
  chainId: number,
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

function nodeToProvider(node: Node): provider {
  const nodeOptions = node.options[0];

  // Initialize provider
  switch (nodeOptions.type) {
    case ProviderType.HTTP:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new HttpProvider(nodeOptions.host, { ...nodeOptions });
    case ProviderType.WS:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new WebsocketProvider(nodeOptions.host, { ...nodeOptions });
    case ProviderType.IPC:
      return buildIpcProvider(nodeOptions);
  }

  throw new ProviderError(
    'Error transforming node to provider, as the selected node options do not contain a valid type'
  );
}

function fallbackGetProviderNode(
  chainId: number,
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

// To support in the future (for now we can just have an idea of how it can look)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function buildIpcProvider(nodeOptions: NodeOptions): IpcProvider {
  throw new Error('IPC Providers are not yet supported');
  // import { Server, ServerOpts, Socket } from 'net';
  /*const server = new Server(
    { ...nodeOptions } as ServerOpts,
    (socket: Socket) => {
      if (nodeOptions.keepAlive != null) {
        socket.setKeepAlive(nodeOptions.keepAlive);
      }

      if (nodeOptions.timeout != null) {
        socket.setTimeout(nodeOptions.timeout);
      }

      // Do something here
    }
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new IpcProvider(nodeOptions.host, server);*/
}
