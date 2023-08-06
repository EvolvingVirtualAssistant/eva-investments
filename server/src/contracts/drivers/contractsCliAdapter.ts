import {
  BN,
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println,
  Unit
} from '../../deps';
import {
  CliConstants,
  ContractsCliConstants
} from '../../constants/cliConstants';
import { deployContract } from '../domain/services/deployContractService';
import { getAsyncWeb3Extension } from '../../appContext';

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
    chainId: number,
    contractPath: string,
    contractName: string,
    compiledContractPath: string,
    deployerAccountAddress: string,
    host: string,
    gas: number,
    ethereUnit: Unit,
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
        gas,
        ethereUnit as Unit,
        gasPrice,
        maxPriorityFeePerGas
          ? web3.utils.toBN(maxPriorityFeePerGas)
          : undefined,
        maxFeePerGas ? web3.utils.toBN(maxFeePerGas) : undefined,
        contractArgs
      );
      await println(`Deployed contract address: ${deployedContractAddress}`);
    } catch (e) {
      println(`${e}`);
    }
  }
}
