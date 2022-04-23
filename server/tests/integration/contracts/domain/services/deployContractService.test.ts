// test with invalid account address expect AccountNotFoundError
// deploy contract successfully

import { DeployContractService } from '../../../../../src/contracts/domain/services/deployContractService';
import { pathJoin, ROOT_PATH, Web3 } from '../../../../../src/deps';
import {
  test,
  assertNotNull,
  assertToBeGreaterThan,
  assertToBeLessThanOrEqual,
  assertEquals
} from '../../../../wrap/testWrapper';
import { ACCOUNTS_KEY } from '../../../../../src/contracts/constants/contractsConstants';
import { readJsonFile } from '../../../../../src/utils/files';

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

// Sets number of Transaction Confirmation Blocks

const defaultTransactionConfirmationBlocks =
  web3.eth.transactionConfirmationBlocks;

function setTransactionConfirmationBlocks() {
  web3.eth.transactionConfirmationBlocks = 1;
}

function resetTransactionConfirmationBlocks() {
  web3.eth.transactionConfirmationBlocks = defaultTransactionConfirmationBlocks;
}

test('Should be able to call estimateGas on contract after successfully deploying contract', async () => {
  setTransactionConfirmationBlocks();
  const accounts = readJsonFile(accountsPath);
  const accountAddress = Object.keys(accounts)[0];

  const contractAddress = await deployContractService.deploy(
    contractPath,
    contractName,
    counterCompiledContractPath,
    accountAddress,
    host,
    gas,
    gasPrice,
    ethereUnit
  );

  assertNotNull(contractAddress, 'Contract address is null');

  const counterContract = loadContract(
    counterCompiledContractPath,
    contractPath,
    contractName,
    contractAddress
  );

  const gasEstimation = await counterContract.methods
    .increase(1)
    .estimateGas({ from: accountAddress });

  assertNotNull(gasEstimation, 'Gas estimate call failed');
  assertToBeGreaterThan(gasEstimation, 0);
  assertToBeLessThanOrEqual(gasEstimation, gas);

  resetTransactionConfirmationBlocks();
});

test('Should be able to interact with contract after successfully deploying contract', async () => {
  setTransactionConfirmationBlocks();
  const accounts = readJsonFile(accountsPath);
  const accountAddress = Object.keys(accounts)[0];

  const contractAddress = await deployContractService.deploy(
    contractPath,
    contractName,
    counterCompiledContractPath,
    accountAddress,
    host,
    gas,
    gasPrice,
    ethereUnit
  );

  assertNotNull(contractAddress, 'Contract address is null');

  const counterContract = loadContract(
    counterCompiledContractPath,
    contractPath,
    contractName,
    contractAddress
  );

  const ethCallOptions = {
    from: accountAddress,
    gas,
    gasPrice: web3.utils.toWei(gasPrice, ethereUnit)
  };

  let counterValue = await counterContract.methods.value().call(ethCallOptions);
  assertEquals(0, counterValue);

  const transactionReceipt = await counterContract.methods
    .increase(1)
    .send(ethCallOptions);

  assertNotNull(
    transactionReceipt,
    'TransactionReceipt from first increase is null'
  );

  counterValue = await counterContract.methods.value().call(ethCallOptions);
  assertEquals(1, counterValue);

  resetTransactionConfirmationBlocks();
});

function loadContract(
  compiledContractPath: string,
  contractPath: string,
  contractName: string,
  contractAddress: string
) {
  let contractJson = readJsonFile(compiledContractPath);
  contractJson = contractJson?.contracts[contractPath]?.[contractName];
  const abi: [] = contractJson?.abi;

  return new web3.eth.Contract(abi, contractAddress);
}
