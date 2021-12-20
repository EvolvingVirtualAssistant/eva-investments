// test with invalid account address expect AccountNotFoundError
// deploy contract successfully

import { DeployContractService } from '../../../../../src/contracts/domain/services/DeployContractService';
import { test, assertThrowsAsync } from '../../../../wrap/testWrapper';

test('Should throw AccountNotFoundError deploying contract when providing an invalid account address', async () => {
  const deployContractService = new DeployContractService();

  await assertThrowsAsync(() => {
    deployContractService.deploy(
      '',
      '',
      'mocks/Counter-solc-output.json',
      '',
      'http://localhost:8545',
      750000,
      '1.2444',
      'gwei'
    );
  });
});
