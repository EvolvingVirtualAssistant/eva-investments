import {
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
import { deploy } from '../domain/services/deployContractService';

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
    contractPath: string,
    contractName: string,
    compiledContractPath: string,
    deployerAccountAddress: string,
    host: string,
    gas: number,
    gasPrice: string,
    ethereUnit: string
  ): Promise<void> {
    try {
      const deployedContractAddress = await deploy(
        contractPath,
        contractName,
        compiledContractPath,
        deployerAccountAddress,
        host,
        gas,
        gasPrice,
        ethereUnit as Unit
      );
      await println(`Deployed contract address: ${deployedContractAddress}`);
    } catch (e) {
      console.error(e);
    }
  }
}
