// test with invalid account address expect AccountNotFoundError
// deploy contract successfully

import { DeployContractService } from '../../../../../src/contracts/domain/services/deployContractService';
import AccountNotFoundError from '../../../../../src/contracts/domain/services/errors/accountNotFoundError';
import { test, assertThrowsAsync } from '../../../../wrap/testWrapper';

const currentDirPath = '/tests/resources/libs/blockchain-communication';

test('Should throw AccountNotFoundError deploying contract when providing an invalid account address', async () => {
  const deployContractService = new DeployContractService();

  await assertThrowsAsync(
    () => {
      deployContractService.deploy(
        'd:/Projetos/eva/eva-investments/server/tests/resources/contracts/domain/services/Counter.sol',
        'Counter',
        'mocks/Counter-solc-output.json',
        'invalidAccountAddress',
        'http://localhost:8545',
        750000,
        '1.2444',
        'gwei'
      );
    },
    AccountNotFoundError,
    'invalidAccountAddress'
  );
});
