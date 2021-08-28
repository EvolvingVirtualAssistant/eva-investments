import { cliAdapter, cliEntrypoint, println, getAllCliEntrypointsByCliAdapter, getAllCliAdapters } from "./libs/cli/mod.ts";
import { WalletsCliAdapter } from "./wallets/drivers/walletsCliAdapter.ts";

export const RootCliConstants = {
    START_CLI_COMMAND: "start",
    STOP_CLI_COMMAND: "exit",
    STOP_APP_COMMAND: "exit",
    LINE_PREFIX: "> ",
    LIST_TEMPLATE: arrayTaggedTemplate`${0}\n`,
    HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nCommands:\n${2}\n\nRun 'COMMAND --help' for more information on a command.\n`,
    OPTION_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    COMMAND_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    LIST_INLINE_TEMPLATE: arrayTaggedTemplate`${0}, `,
    ROOT_USAGE: "[OPTIONS] [COMMAND]",
    ROOT_OPTION_HELP_TOKEN_1: "-h",
    ROOT_OPTION_HELP_TOKEN_2: "--help",
    ROOT_OPTION_HELP_DESCRIPTION: "Prints help information",
    NO_TOKENS_SPECIFIED: taggedTemplate`No tokens were specified for method ${0} of class ${1}`,
    CLI_ADAPTER_PATH_AND_CLASS: taggedTemplate`${0}.${1}`,
    REGEX_COLON_DIGITS: ":(([0-9])+)",
    CLI_ADAPTER_DEFAULT_TOKEN: ""
} as const;

@cliAdapter()
export class RootCliAdapter {
    private walletsCliAdapter: WalletsCliAdapter;

    
    // Talvez ou deixar aqui dentro porque so e usado aqui
    // ou colocar dentro de constants
    // talvez ter cada um destas options e commands como uma anotação que le o metodo a que esta associada e preenche as propriedades
    /*private const helpOption: Option = { 
        tokens: ["-h", "--help"],
        description: "Prints help information",
        nextNTokens: "all",
        func: this.getHelpMessage,
    }*/

    constructor() {
        this.walletsCliAdapter = new WalletsCliAdapter();
    }

    @cliEntrypoint({
        tokens: [RootCliConstants.ROOT_OPTION_HELP_TOKEN_1, RootCliConstants.ROOT_OPTION_HELP_TOKEN_2],
        description: RootCliConstants.ROOT_OPTION_HELP_DESCRIPTION
    })
    getHelpMessage(): void {
        const entrypoints = getAllCliEntrypointsByCliAdapter();
        const adapters = getAllCliAdapters();
        println(RootCliConstants.HELP_COMMAND_TEMPLATE(RootCliConstants.ROOT_USAGE, 
            RootCliConstants.LIST_TEMPLATE(
                ...entrypoints.map(entry => [RootCliConstants.OPTION_TEMPLATE(RootCliConstants.LIST_INLINE_TEMPLATE(...entry.tokens.map(t => [t])), entry.description)])
            ),
            RootCliConstants.LIST_TEMPLATE(
                ...adapters.map(adapter => [RootCliConstants.OPTION_TEMPLATE(RootCliConstants.LIST_INLINE_TEMPLATE(...adapter.tokens.map(t => [t])), adapter.description)])
            )
        ));
    }

    interpretCommand(tokens: string[]): void {
        //println(this.getHelpMessage());

        for (let i = 0; i < tokens.length; i++) {
            //this.options
        }
    }

}

// deno-lint-ignore no-explicit-any
function taggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
    // deno-lint-ignore no-explicit-any
    return function(...values: any[]) {
        return strings.map((elem, i) => `${elem}${values[i] || ""}`).join("");
    };
}

// deno-lint-ignore no-explicit-any
function arrayTaggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
    // deno-lint-ignore no-explicit-any
    return function(...values: any[][]) {
        const splitElem = strings[strings.length - 1];
        return values.map(elem => strings.filter((_, i) => i !== strings.length - 1).map((segment, i) => `${segment}${elem[i] || ""}`).join("")).join(splitElem);
    };
}