import { EventData } from '../../../deps';
import { getWeb3Extension } from '../../../appContext';
import { getContractByName } from './contractService';
import { loadPrecompiledContract } from './deployContractService';

export const getContractEvents = (
  chainId: number,
  eventName: string,
  contractName: string,
  fromBlock: number
): Promise<EventData[]> => {
  const contractData = getContractByName(chainId, contractName);
  const web3 = getWeb3Extension(chainId);
  const contract = loadPrecompiledContract(
    web3,
    contractData.compiledPath,
    contractData.address
  );

  return contract.getPastEvents(eventName, {
    fromBlock: fromBlock,
    toBlock: 'latest'
  });
};
