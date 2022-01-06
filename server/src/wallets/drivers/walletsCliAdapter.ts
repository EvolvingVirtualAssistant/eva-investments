import {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println
} from '../../deps';
import {
  CliConstants,
  WalletsCliConstants
} from '../../constants/cliConstants';

@cliAdapter({
  tokens: [WalletsCliConstants.ADAPTER_TOKEN],
  description: WalletsCliConstants.ADAPTER_DESCRIPTION
})
export class WalletsCliAdapter {
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
      WalletsCliConstants.ADAPTER_TOKEN
    );
    await println(
      (errMsg || '') +
        WalletsCliConstants.HELP_COMMAND_TEMPLATE(
          WalletsCliConstants.USAGE,
          CliConstants.LIST_TEMPLATE(
            ...entrypoints.map((entry) => [
              CliConstants.OPTION_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...entry.tokens.map((t) => [t])
                ),
                entry.description
              )
            ])
          )
        )
    );
  }
}
