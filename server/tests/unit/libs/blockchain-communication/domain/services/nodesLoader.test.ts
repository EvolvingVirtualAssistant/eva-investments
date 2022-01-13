import {
  BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
  BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY
} from '../../../../../../src/node-providers/constants/blockchainCommunicationConstants';
import { loadNodes } from '../../../../../../src/libs/blockchain-communication/domain/services/nodesLoader';
import { NodesConfigFileAdapter } from '../../../../../../src/node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodesMemoryAdapter } from '../../../../../../src/node-providers/driven/data-sources/nodesMemoryAdapter';
import {
  assertEquals,
  assertThrows,
  test
} from '../../../../../wrap/testWrapper';
import { NodeError } from 'blockchain-communication/errors/nodeError';

const resourcesDirPath = '/tests/resources/libs/blockchain-communication';

const nodesConfigRepository = NodesConfigFileAdapter.getInstance();
const nodesRepository = NodesMemoryAdapter.getInstance();

const originalNodesOptionsEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY];

const originalNodesAuthEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY];

function clearContext() {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    originalNodesOptionsEnvKey;
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    originalNodesAuthEnvKey;

  nodesRepository.deleteAll();
}

test('Should not load nodes if node options and nodes auth are empty', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/emptyNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/emptyNodesAuth.json';

  assertEquals(nodesRepository.getNodes().length, 0);

  loadNodes(nodesConfigRepository, nodesRepository);

  assertEquals(nodesRepository.getNodes().length, 0);

  clearContext();
});

test('Should not load nodes if node options has duplicated elements', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/duplicatedNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/sampleNodesAuth.json';

  assertThrows(
    () => loadNodes(nodesConfigRepository, nodesRepository),
    NodeError,
    'Duplicated element'
  );

  clearContext();
});
