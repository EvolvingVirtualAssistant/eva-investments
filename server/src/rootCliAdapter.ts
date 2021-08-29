import { cliAdapter, cliEntrypoint, getAllCliEntrypointsByCliAdapter, getAllCliAdapters, println } from "./libs/cli/mod.ts";
import { CliConstants, RootCliConstants } from "./constants/cliConstants.ts";

@cliAdapter()
export class RootCliAdapter {
    constructor() {}

    @cliEntrypoint({
        tokens: [CliConstants.OPTION_HELP_TOKEN_1, CliConstants.OPTION_HELP_TOKEN_2],
        description: CliConstants.OPTION_HELP_DESCRIPTION
    }, true)
    async getHelpMessage(errMsg?: string): Promise<void> {
        const entrypoints = getAllCliEntrypointsByCliAdapter();
        const adapters = getAllCliAdapters();
        await println((errMsg || "") + RootCliConstants.HELP_COMMAND_TEMPLATE(RootCliConstants.USAGE, 
            CliConstants.LIST_TEMPLATE(
                ...entrypoints.map(entry => [CliConstants.OPTION_TEMPLATE(CliConstants.LIST_INLINE_TEMPLATE(...entry.tokens.map(t => [t])), entry.description)])
            ),
            CliConstants.LIST_TEMPLATE(
                ...adapters.map(adapter => [CliConstants.COMMAND_TEMPLATE(CliConstants.LIST_INLINE_TEMPLATE(...adapter.tokens.map(t => [t])), adapter.description)])
            )
        ));
    }
}
