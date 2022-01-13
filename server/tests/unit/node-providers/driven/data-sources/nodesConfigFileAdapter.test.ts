import {
  test,
  assertEquals,
  testParameterized
} from '../../../../wrap/testWrapper';
import {
  BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
  BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY
} from '../../../../../src/node-providers/constants/blockchainCommunicationConstants';
import { NodesConfigFileAdapter } from '../../../../../src/node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodeAuth, NodeOptions } from '../../../../../src/deps';

const nodesConfigFileAdapter = NodesConfigFileAdapter.getInstance();
const resourcesDirPath = '/tests/resources/node-providers';

const originalNodesOptionsEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY];

const originalNodesAuthEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY];

testParameterized(
  [
    [
      'options',
      BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
      () => nodesConfigFileAdapter.getNodesOptions(),
      originalNodesOptionsEnvKey
    ],
    [
      'auth',
      BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
      () => nodesConfigFileAdapter.getNodesAuth(),
      originalNodesAuthEnvKey
    ]
  ],
  'Should not get nodes "%s" on invalid nodes "%s" file path',
  (
    name: string,
    envKey: string,
    getMethod: () => (NodeOptions | NodeAuth)[],
    originalEnvKeyValue: string
  ) => {
    process.env[envKey] = resourcesDirPath + '/missing.json';

    const nodes: (NodeOptions | NodeAuth)[] = getMethod();
    assertEquals(nodes.length, 0);

    process.env[envKey] = originalEnvKeyValue || '';
  }
);

testParameterized(
  [
    [
      'options',
      BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
      '/incorrectNodesOptionsFormat.json',
      () => nodesConfigFileAdapter.getNodesOptions(),
      originalNodesOptionsEnvKey
    ],
    [
      'auth',
      BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
      '/incorrectNodesAuthPathFormat.json',
      () => nodesConfigFileAdapter.getNodesAuth(),
      originalNodesAuthEnvKey
    ]
  ],
  'Should not get nodes "%s" on invalid node "%s" format',
  (
    name: string,
    envKey: string,
    filePath: string,
    getMethod: () => (NodeOptions | NodeAuth)[],
    originalEnvKeyValue: string
  ) => {
    process.env[envKey] = resourcesDirPath + filePath;

    const nodes: (NodeOptions | NodeAuth)[] = getMethod();
    assertEquals(nodes.length, 0);

    process.env[envKey] = originalEnvKeyValue || '';
  }
);

testParameterized(
  [
    [
      'options',
      BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY,
      '/sampleNodesOptions.json',
      () => nodesConfigFileAdapter.getNodesOptions(),
      originalNodesOptionsEnvKey
    ],
    [
      'auth',
      BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
      '/sampleNodesAuth.json',
      () => nodesConfigFileAdapter.getNodesAuth(),
      originalNodesAuthEnvKey
    ]
  ],
  'Should get nodes "%s"',
  (
    name: string,
    envKey: string,
    filePath: string,
    getMethod: () => (NodeOptions | NodeAuth)[],
    originalEnvKeyValue: string
  ) => {
    process.env[envKey] = resourcesDirPath + filePath;

    const nodes: (NodeOptions | NodeAuth)[] = getMethod();
    assertEquals(nodes.length, 1);

    process.env[envKey] = originalEnvKeyValue || '';
  }
);

test('Should not get nodes options on invalid node type', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    resourcesDirPath + '/invalidNodeType.json';

  const nodes = nodesConfigFileAdapter.getNodesOptions();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    originalNodesOptionsEnvKey || '';
});

test('Should not get nodes auth on invalid nodes api key file path', () => {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/invalidNodeApiKeyPath.json';

  const nodes = nodesConfigFileAdapter.getNodesAuth();
  assertEquals(nodes.length, 0);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    originalNodesAuthEnvKey || '';
});
