import { DeployContractService } from '../../../../../src/contracts/domain/services/deployContractService';
import AccountNotFoundError from '../../../../../src/contracts/domain/services/errors/accountNotFoundError';
import { pathJoin, ROOT_PATH, Web3 } from '../../../../../src/deps';
import { test, assertThrowsAsync } from '../../../../wrap/testWrapper';
import { ACCOUNTS_KEY } from '../../../../../src/contracts/constants/contractsConstants';
import { readJsonFile } from '../../../../../src/utils/files';
import ContractContentMissingError from '../../../../../src/contracts/domain/services/errors/contractContentMissingError';
import NoAccountsProvidedError from '../../../../../src/contracts/domain/services/errors/noAccountsProvidedError';

const currentTestResourcesDirPath = pathJoin(
  ROOT_PATH,
  '/tests/resources/contracts/domain/services/'
);
const counterCompiledContractPath = pathJoin(
  currentTestResourcesDirPath,
  'Counter-solc-output.json'
);
const accountsPath: string = pathJoin(
  ROOT_PATH,
  process.env[ACCOUNTS_KEY] || ''
);
const contractPath =
  'd:/Projetos/eva/eva-investments/server/tests/resources/contracts/domain/services/Counter.sol';
const contractName = 'Counter';
const host = 'http://localhost:8545';
const gas = 750000;
const gasPrice = '1.2444';
const ethereUnit = 'gwei';

const web3 = new Web3(host);
const deployContractService = new DeployContractService(web3);

test('Should throw NoAccountsProvidedError deploying contract when no resource file with accounts exist', async () => {
  const subPath = 'invalidKey';
  const envAccountKeyValue = process.env[ACCOUNTS_KEY];
  process.env[ACCOUNTS_KEY] = subPath;
  await assertThrowsAsync(
    async () => {
      await deployContractService.deploy(
        contractPath,
        contractName,
        counterCompiledContractPath,
        'accountAddress',
        host,
        gas,
        gasPrice,
        ethereUnit
      );
    },
    NoAccountsProvidedError,
    `${subPath}`
  );
  process.env[ACCOUNTS_KEY] = envAccountKeyValue;
});

test('Should throw AccountNotFoundError deploying contract when providing an invalid account address', async () => {
  await assertThrowsAsync(
    async () => {
      await deployContractService.deploy(
        contractPath,
        contractName,
        counterCompiledContractPath,
        'invalidAccountAddress',
        host,
        gas,
        gasPrice,
        ethereUnit
      );
    },
    AccountNotFoundError,
    'invalidAccountAddress'
  );
});

test('Should throw ContractContentMissingError deploying contract when providing the wrong contract name', async () => {
  const accounts = readJsonFile(accountsPath);
  const accountAddress = Object.keys(accounts)[0];
  const contractName = 'wrongContractName';
  await assertThrowsAsync(
    async () => {
      await deployContractService.deploy(
        contractPath,
        contractName,
        counterCompiledContractPath,
        accountAddress,
        host,
        gas,
        gasPrice,
        ethereUnit
      );
    },
    ContractContentMissingError,
    `Could not load contract ${contractName}`
  );
});

test('Should throw ContractContentMissingError deploying contract when providing the wrong contract path', async () => {
  const accounts = readJsonFile(accountsPath);
  const accountAddress = Object.keys(accounts)[0];
  const contractPath = 'wrongContractPath';
  await assertThrowsAsync(
    async () => {
      await deployContractService.deploy(
        contractPath,
        contractName,
        counterCompiledContractPath,
        accountAddress,
        host,
        gas,
        gasPrice,
        ethereUnit
      );
    },
    ContractContentMissingError,
    `${contractPath}`
  );
});
