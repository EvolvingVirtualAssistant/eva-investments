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
  test,
  testParameterized
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

testParameterized(
  [
    [
      'node options has duplicated elements',
      '/duplicatedNodesOptions.json',
      '/sampleNodesAuth.json',
      'Duplicated element'
    ],
    [
      'node auth has duplicated elements',
      '/sampleNodesOptions.json',
      '/duplicatedNodesAuth.json',
      'Duplicated element'
    ],
    [
      'node auth has hosts missing in node options',
      '/sampleNodesOptions.json',
      '/nodesAuthOptionsWithDiffHosts.json',
      'found in node auth collection but not in node options collection'
    ]
  ],
  'Should throw error if %s',
  (_condition, nodeOptionsFile, nodeAuthFile, errMsg) => {
    process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
      resourcesDirPath + nodeOptionsFile;
    process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
      resourcesDirPath + nodeAuthFile;

    assertThrows(
      () => loadNodes(nodesConfigRepository, nodesRepository),
      NodeError,
      errMsg
    );

    clearContext();
  }
);

test('Should group options with the same host, under the same node', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/sampleNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/oneUrlNodesAuth.json';

  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = nodesConfigRepository.getNodesAuth();

  assertEquals(nodesRepository.getNodes().length, 0);
  assertEquals(nodesOptions.length, 3);
  assertEquals(nodesAuth.length, 1);

  loadNodes(nodesConfigRepository, nodesRepository);
  const nodes = nodesRepository.getNodes();

  assertEquals(nodes.length, 2);
  assertEquals(nodes.flatMap((node) => node.options).length, 3);

  clearContext();
});

test('Should have as many nodes as different api keys for the same url', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/oneOptionNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/sampleNodesAuth.json';

  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = nodesConfigRepository.getNodesAuth();

  assertEquals(nodesRepository.getNodes().length, 0);
  assertEquals(nodesOptions.length, 1);
  assertEquals(nodesAuth.length, 2);
  assertEquals(nodesAuth[0].url, nodesAuth[1].url);

  loadNodes(nodesConfigRepository, nodesRepository);
  const nodes = nodesRepository.getNodes();

  assertEquals(nodes.length, 2);
  assertEquals(
    nodes.every((node) => node.url === nodesAuth[0].url),
    true
  );
  assertEquals(nodes[0].url === nodes[1].url, true);
  assertEquals(nodes[0].apiKey !== nodes[1].apiKey, true);

  clearContext();
});

test('Should have nodes without api keys if no api key is specified for that url', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/sampleNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/sampleNodesAuth.json';

  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = nodesConfigRepository.getNodesAuth();

  assertEquals(nodesRepository.getNodes().length, 0);
  assertEquals(nodesOptions.length, 3);
  assertEquals(nodesAuth.length, 2);
  assertEquals(nodesAuth[0].url, nodesAuth[1].url);

  loadNodes(nodesConfigRepository, nodesRepository);
  const nodes = nodesRepository.getNodes();

  assertEquals(nodes.length, 3);

  if (nodes[0].url === nodes[1].url) {
    assertEquals(
      nodes[0].apiKey != null &&
        nodes[1].apiKey != null &&
        nodes[0].apiKey !== nodes[1].apiKey,
      true
    );
    assertEquals(nodes[2].apiKey == null, true);
  } else if (nodes[0].url === nodes[2].url) {
    assertEquals(
      nodes[0].apiKey != null &&
        nodes[2].apiKey != null &&
        nodes[0].apiKey !== nodes[2].apiKey,
      true
    );
    assertEquals(nodes[1].apiKey == null, true);
  } else {
    assertEquals(true, false, "There should've been two equal urls");
  }

  clearContext();
});

test('Should load nodes', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/sampleNodesOptions.json';
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/sampleNodesAuth.json';

  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = nodesConfigRepository.getNodesAuth();

  assertEquals(nodesRepository.getNodes().length, 0);
  assertEquals(nodesOptions.length, 3);
  assertEquals(nodesAuth.length, 2);
  assertEquals(nodesAuth[0].url, nodesAuth[1].url);

  loadNodes(nodesConfigRepository, nodesRepository);
  const nodes = nodesRepository.getNodes();

  assertEquals(nodes.length, 3);

  clearContext();
});
