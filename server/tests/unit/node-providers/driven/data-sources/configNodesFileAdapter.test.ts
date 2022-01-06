import { test, assertEquals } from '../../../../wrap/testWrapper';
import { BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY } from '../../../../../src/node-providers/constants/blockchainCommunicationConstants';
import { ConfigNodesFileAdapter } from '../../../../../src/node-providers/driven/data-sources/configNodesFileAdapter';

const nodesFileAdapter = ConfigNodesFileAdapter.getInstance();
const currentDirPath = '/tests/resources/libs/blockchain-communication';

test('Should not get nodes on invalid nodes json file path', () => {
  const originalValue = process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY];
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] =
    currentDirPath + '/missing.json';

  const nodes = nodesFileAdapter.getConfigNodes();
  assertEquals(nodes.length, 0);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] = originalValue || '';
});

test('Should not get nodes on invalid node format', () => {
  const originalValue = process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY];
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] =
    currentDirPath + '/incorrectNodesFormat.json';

  const nodes = nodesFileAdapter.getConfigNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] = originalValue || '';
});

test('Should not get nodes on invalid node type', () => {
  const originalValue = process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY];
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] =
    currentDirPath + '/invalidNodeType.json';

  const nodes = nodesFileAdapter.getConfigNodes();
  console.log(nodes);
  assertEquals(nodes.length, 0);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] = originalValue || '';
});

test('Should get nodes', () => {
  const originalValue = process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY];
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] =
    currentDirPath + '/sampleNodes.json';

  const nodes = nodesFileAdapter.getConfigNodes();
  assertEquals(nodes.length, 1);

  process.env[BLOCKCHAIN_COMMUNICATION_NODES_ENV_KEY] = originalValue || '';
});
