import {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  getAllCliAdapters,
  println,
  CLI_ADAPTER_DEFAULT_TOKEN,
  Command
} from './deps';
import { CliConstants, RootCliConstants } from './constants/cliConstants';

@cliAdapter()
export class RootCliAdapter {
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
    const entrypoints = getAllCliEntrypointsByCliAdapter();
    const adapters = getAllCliAdapters().filter(
      (adapter: Command) => !adapter.tokens.includes(CLI_ADAPTER_DEFAULT_TOKEN)
    );
    await println(
      (errMsg || '') +
        RootCliConstants.HELP_COMMAND_TEMPLATE(
          RootCliConstants.USAGE,
          CliConstants.LIST_TEMPLATE(
            ...entrypoints.map((entry: Command) => [
              CliConstants.OPTION_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...entry.tokens.map((t: string) => [t])
                ),
                entry.description
              )
            ])
          ),
          CliConstants.LIST_TEMPLATE(
            ...adapters.map((adapter: Command) => [
              CliConstants.COMMAND_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...adapter.tokens.map((t: string) => [t])
                ),
                adapter.description
              )
            ])
          )
        )
    );
  }
}
