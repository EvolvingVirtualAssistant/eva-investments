import { Contract, ContractAbi, ContractEvents, EventLog } from '../../../deps';
import { getWeb3Extension } from '../../../appContext';
import { getContractByName } from './contractService';
import { loadPrecompiledContract } from './deployContractService';

export const getContractEvents = <Abi extends ContractAbi>(
  chainId: string,
  eventName: keyof ContractEvents<Abi>,
  contractName: string,
  fromBlock: bigint
): Promise<EventLog[]> => {
  const contractData = getContractByName(chainId, contractName);
  const web3 = getWeb3Extension(chainId);
  const contract: Contract<Abi> = loadPrecompiledContract(
    web3,
    contractData.compiledPath,
    contractData.address
  );

  contract.events;

  return contract.getPastEvents(eventName, {
    fromBlock: fromBlock,
    toBlock: 'latest'
  }) as Promise<EventLog[]>;
};
