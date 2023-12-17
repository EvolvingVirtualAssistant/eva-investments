import {
  BN,
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println,
  EtherUnits
} from '../../deps';
import {
  CliConstants,
  ContractsCliConstants
} from '../../constants/cliConstants';
import { deployContract } from '../domain/services/deployContractService';
import { getAsyncWeb3Extension } from '../../appContext';
import {
  addParticipant,
  getParticipants,
  removeParticipant,
  transferOwnership
} from '../domain/services/accessControlService';

@cliAdapter({
  tokens: [ContractsCliConstants.ADAPTER_TOKEN],
  description: ContractsCliConstants.ADAPTER_DESCRIPTION
})
export class ContractsCliAdapter {
  @cliEntrypoint(
    {
      tokens: [
        CliConstants.OPTION_HELP_TOKEN_1,
        CliConstants.OPTION_HELP_TOKEN_2
      ],
      description: CliConstants.OPTION_HELP_DESCRIPTION
    },
    true
  )
  async getHelpMessage(errMsg?: string): Promise<void> {
    const entrypoints = getAllCliEntrypointsByCliAdapter(
      ContractsCliConstants.ADAPTER_TOKEN
    );
    await println(
      (errMsg || '') +
        ContractsCliConstants.HELP_COMMAND_TEMPLATE(
          ContractsCliConstants.USAGE,
          CliConstants.LIST_TEMPLATE(
            ...entrypoints.map((entry: any) => [
              CliConstants.OPTION_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...entry.tokens.map((t: any) => [t])
                ),
                entry.description
              )
            ])
          )
        )
    );
  }

  @cliEntrypoint({
    tokens: [ContractsCliConstants.CONTRACTS_DEPLOY_TOKEN],
    description: ContractsCliConstants.CONTRACTS_DEPLOY_DESCRIPTION
  })
  async deployContract(
    chainId: string,
    contractPath: string,
    contractName: string,
    compiledContractPath: string,
    deployerAccountAddress: string,
    host: string,
    gas: string,
    ethereUnit: EtherUnits,
    gasPrice: string | undefined,
    maxPriorityFeePerGas: string | undefined,
    maxFeePerGas: string | undefined,
    contractArgsJson: string
  ): Promise<void> {
    try {
      const contractArgs = contractArgsJson
        ? Object.values(JSON.parse(contractArgsJson))
        : undefined;
      const web3 = await getAsyncWeb3Extension(chainId);
      const deployedContractAddress = await deployContract(
        await getAsyncWeb3Extension(chainId),
        contractPath,
        contractName,
        compiledContractPath,
        deployerAccountAddress,
        host,
        BigInt(gas),
        ethereUnit,
        gasPrice,
        maxPriorityFeePerGas ? BigInt(maxPriorityFeePerGas) : undefined,
        maxFeePerGas ? BigInt(maxFeePerGas) : undefined,
        contractArgs
      );
      await println(`Deployed contract address: ${deployedContractAddress}`);
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ContractsCliConstants.CONTRACTS_PARTICIPANTS_LIST_TOKEN],
    description: ContractsCliConstants.CONTRACTS_PARTICIPANTS_LIST_DESCRIPTION
  })
  async listParticipants(
    chainId: string,
    contractAddress: string,
    ownerAddress: string
  ) {
    try {
      const participantsList = (
        await getParticipants(chainId, contractAddress, ownerAddress)
      )
        .map((address) => `- ${address}`)
        .join('\n');
      await println(
        `Participants of contract ${contractAddress} :\n${participantsList}`
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ContractsCliConstants.CONTRACTS_PARTICIPANTS_ADD_TOKEN],
    description: ContractsCliConstants.CONTRACTS_PARTICIPANTS_ADD_DESCRIPTION
  })
  async addParticipant(
    chainId: string,
    contractAddress: string,
    participantAddress: string,
    ownerAddress: string,
    maxPriorityFeePerGas: string | undefined
  ) {
    try {
      await addParticipant(
        chainId,
        contractAddress,
        participantAddress,
        ownerAddress,
        maxPriorityFeePerGas
      );
      await println(
        `Participant ${participantAddress} was added to contract ${contractAddress}`
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ContractsCliConstants.CONTRACTS_PARTICIPANTS_REMOVE_TOKEN],
    description: ContractsCliConstants.CONTRACTS_PARTICIPANTS_REMOVE_DESCRIPTION
  })
  async removeParticipant(
    chainId: string,
    contractAddress: string,
    participantAddress: string,
    ownerAddress: string,
    maxPriorityFeePerGas?: string
  ) {
    try {
      await removeParticipant(
        chainId,
        contractAddress,
        participantAddress,
        ownerAddress,
        maxPriorityFeePerGas
      );
      await println(
        `Participant ${participantAddress} was removed from contract ${contractAddress}`
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [
      ContractsCliConstants.CONTRACTS_PARTICIPANTS_TRANSFER_OWNERSHIP_TOKEN
    ],
    description:
      ContractsCliConstants.CONTRACTS_PARTICIPANTS_TRANSFER_OWNERSHIP_DESCRIPTION
  })
  async transferOwnership(
    chainId: string,
    contractAddress: string,
    ownerAddress: string,
    newOwnerAddress: string,
    maxPriorityFeePerGas?: string
  ) {
    try {
      await transferOwnership(
        chainId,
        contractAddress,
        ownerAddress,
        newOwnerAddress,
        maxPriorityFeePerGas
      );
      await println(
        `Ownership of contract ${contractAddress} was transfered to ${newOwnerAddress}`
      );
    } catch (e) {
      println(`${e}`);
    }
  }
}
