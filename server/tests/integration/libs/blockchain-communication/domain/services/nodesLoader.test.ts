import {
  BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY,
  BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY
} from '../../../../../../src/node-providers/constants/blockchainCommunicationConstants';
import { loadNodes } from '../../../../../../src/libs/blockchain-communication/domain/services/nodesLoader';
import { NodesConfigFileAdapter } from '../../../../../../src/node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodesMemoryAdapter } from '../../../../../../src/node-providers/driven/data-sources/nodesMemoryAdapter';
import { assertEquals, fail, test } from '../../../../../wrap/testWrapper';
import { NodeOptions } from '../../../../../../src/libs/blockchain-communication/domain/entities/nodeOptions';
import { Node } from '../../../../../../src/libs/blockchain-communication/domain/entities/node';
import { unlinkSync, writeFileSync } from 'fs';
import { sleep } from '../../../../../../src/utils/async';
import { NodeAuth } from '../../../../../../src/libs/blockchain-communication/domain/entities/nodeAuth';
import { pathJoin, ROOT_PATH } from '../../../../../../src/deps';
import { readJsonFile } from '../../../../../../src/utils/files';
import { NodesConfigRepository } from 'blockchain-communication/driven/repositories/nodesConfigRepository';
import { NodesRepository } from 'blockchain-communication/driven/repositories/nodesRepository';

const resourcesDirPath = '/tests/resources/libs/blockchain-communication';
const tempFileName = 'tempSampleNodesOptions.json';
const TIMEOUT = 60000;

const nodesConfigRepository = NodesConfigFileAdapter.getInstance();
const nodesRepository = NodesMemoryAdapter.getInstance();

const originalNodesOptionsEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY];

const originalNodesAuthEnvKey =
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY];

function loadContext(fileName: string) {
  modifyNodeOptionsFile(JSON.stringify(getOriginalNodeOptions()), fileName);
}

function clearContext() {
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY] =
    originalNodesOptionsEnvKey;
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    originalNodesAuthEnvKey;

  nodesConfigRepository.disableCallOnChange();

  const path = pathJoin(ROOT_PATH, `${resourcesDirPath}/${tempFileName}`);
  unlinkSync(path);
}

function testFirstLoadNodes(
  nodesConfigRepository: NodesConfigRepository,
  nodesRepository: NodesRepository
): void {
  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = (
    nodesConfigRepository as NodesConfigFileAdapter
  ).getNodesAuth();

  assertEquals((nodesRepository as NodesMemoryAdapter).getNodes().length, 0);
  assertEquals(nodesOptions.length, 3);
  assertEquals(nodesAuth.length, 2);
  assertEquals(nodesAuth[0].url, nodesAuth[1].url);

  loadNodes(
    nodesConfigRepository as NodesConfigFileAdapter,
    nodesRepository as NodesMemoryAdapter,
    true
  );
  const nodes = (nodesRepository as NodesMemoryAdapter).getNodes();

  assertEquals(nodes.length, 3);
}

function getOriginalNodeOptions(): NodeOptions[] {
  const path = pathJoin(
    ROOT_PATH,
    resourcesDirPath + '/sampleNodesOptions.json'
  );
  return readJsonFile(path);
}

function modifyNodeOptionsFile(nodesOptions: string, fileName: string): void {
  const path = pathJoin(ROOT_PATH, `${resourcesDirPath}/${fileName}`);
  writeFileSync(path, nodesOptions);
}

async function waitToBeTrue(callback: () => boolean) {
  // Wait for load nodes
  const currTime = Date.now();
  while (!callback()) {
    await sleep(100);
    if (Date.now() - currTime > TIMEOUT) {
      fail('Failed in waitToBeTrue');
    }
  }
}

test('Should keep loading nodes', async () => {
  loadContext(tempFileName);
  process.env[
    BLOCKCHAIN_COMMUNICATION_NODES_OPTIONS_ENV_KEY
  ] = `${resourcesDirPath}/${tempFileName}`;
  process.env[BLOCKCHAIN_COMMUNICATION_NODES_AUTH_ENV_KEY] =
    resourcesDirPath + '/sampleNodesAuth.json';

  testFirstLoadNodes(nodesConfigRepository, nodesRepository);

  const nodesOptions = nodesConfigRepository.getNodesOptions();

  // should ignore errors on callback loadNodes failure
  assertEquals(nodesConfigRepository.getNodesOptions().length, 3);

  modifyNodeOptionsFile(
    JSON.stringify('This is not even an array'),
    tempFileName
  );

  await waitToBeTrue(
    () => nodesConfigRepository.getNodesOptions().length === 0
  );

  assertEquals(nodesRepository.getNodes().length, 3);

  // should load nodes
  nodesOptions.push({ ...nodesOptions[2], host: 'ws://localhost:8546' });

  modifyNodeOptionsFile(JSON.stringify(nodesOptions), tempFileName);

  await waitToBeTrue(
    () => nodesConfigRepository.getNodesOptions().length === 4
  );

  await waitToBeTrue(() => nodesRepository.getNodes().length === 4);

  await clearContext();
});
