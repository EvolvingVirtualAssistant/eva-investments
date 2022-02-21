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
import { NodeError } from './errors/nodeError';
import { ProviderError } from './errors/providerError';

export function setProvider(
  web3: Web3,
  nodesRepository: NodesRepository
): void {
  const provider = getWeb3Provider(nodesRepository);

  if (equalProvider(web3?.currentProvider, provider)) {
    return;
  }

  web3?.setProvider(provider);
  console.log(
    `New provider was set: ${
      typeof provider === 'string' ? provider : JSON.stringify(provider)
    }`
  );
}

function getWeb3Provider(nodesRepository: NodesRepository): provider {
  try {
    return (
      externalDeps?.getProvider?.(nodesRepository) ||
      fallbackGetProvider(nodesRepository)
    );
  } catch (e) {
    throw new ProviderError(`Error getting provider: ${e}`);
  }
}

function fallbackGetProvider(nodesRepository: NodesRepository): provider {
  const nodes = nodesRepository?.getNodes();

  if (nodes.length === 0) {
    throw new NodeError('No nodes available');
  }

  if (nodes[0].options.length === 0) {
    throw new NodeError(
      `No options available for node with url - ${nodes[0].url} and id - ${nodes[0].id}`
    );
  }

  const nodeOptions = nodes[0].options[0];

  // Initialize provider
  switch (nodeOptions.type) {
    case ProviderType.HTTP:
      return new HttpProvider(nodeOptions.host, { ...nodeOptions });
    case ProviderType.WS:
      return new WebsocketProvider(nodeOptions.host, { ...nodeOptions });
    case ProviderType.IPC:
      return buildIpcProvider(nodeOptions);
  }

  throw new ProviderError(
    'Error in fallback get provider, as the selected node options does not contain a valid type'
  );
}

function equalProvider(
  currentProvider: provider,
  newProvider: provider
): boolean {
  // Need to find a way to actually understand whether 2 providers are the same
  // Perhaps it can only be done through the node itself and not the provider
  // Nonetheless we still need to get a good way of identifying a node, which we don't have at the moment

  return false;
}

// To support in the future (for now we can just have an idea of how it can look)
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
  return new IpcProvider(nodeOptions.host, server);*/
}
