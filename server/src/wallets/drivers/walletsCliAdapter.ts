import { CliConstants, cliAdapter, cliEntrypoint } from "../../libs/cli/mod.ts";

@cliAdapter({
    tokens: ["wallets"],
    description: "My fucking wallets"
})
export class WalletsCliAdapter {
    
    constructor() {}
    
    @cliEntrypoint({
        tokens: ["a"],
        description: CliConstants.ROOT_OPTION_HELP_DESCRIPTION
    })
    getHelpMessage(): string {
        throw new Error("Method not implemented.");
    }

    interpretCommand(tokens: string[]): void {
        throw new Error("Method not implemented.");
    }

}