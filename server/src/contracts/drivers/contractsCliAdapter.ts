import {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println
} from '../../libs/cli/mod';
import {
  CliConstants,
  ContractsCliConstants
} from '../../constants/cliConstants';
import { DeployContractService } from '../domain/services/deployContractService';
import { Unit } from '../../deps';

@cliAdapter({
  tokens: [ContractsCliConstants.ADAPTER_TOKEN],
  description: ContractsCliConstants.ADAPTER_DESCRIPTION
})
export class ContractsCliAdapter {
  private readonly deployContractService: DeployContractService;

  constructor(deployContractService: DeployContractService) {
    this.deployContractService = deployContractService;
  }

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

  @cliEntrypoint(
    {
      tokens: [ContractsCliConstants.CONTRACTS_DEPLOY_TOKEN],
      description: ContractsCliConstants.CONTRACTS_DEPLOY_DESCRIPTION
    },
    true
  )
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
    //const deployedContractAddress = await this.deployContractService.deploy(
    //  compiledContractPath,
    //  deployerAccountAddress,
    //  host,
    //  gas,
    //  gasPrice,
    //  ethereUnit as EthereUnit,
    //);
    const deployedContractAddress = await this.deployContractService.deploy(
      contractPath, //"D:/Projetos/eva/eva-investments-private/contracts/evaSwap.sol",
      contractName, //"EvaSwap",
      compiledContractPath, //"D:/Projetos/eva/eva-investments-private/bin/contracts/evaSwap-solc-output.json",
      deployerAccountAddress, //"0xc4F39aC7664043A89a9815F0487A5D02b0338B6b",
      host, //"http://localhost:8545",
      gas, //750000,
      gasPrice, //"1.2444",
      ethereUnit as Unit //"gwei" as EthereUnit,
    );
    await println(`Deployed contract address: ${deployedContractAddress}`);
  }
}
