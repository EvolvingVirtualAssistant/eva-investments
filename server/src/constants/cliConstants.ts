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

export const CliConstants = {
    LIST_TEMPLATE: arrayTaggedTemplate`${0}\n`,
    OPTION_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    COMMAND_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    LIST_INLINE_TEMPLATE: arrayTaggedTemplate`${0}, `,

    OPTION_HELP_TOKEN_1: "-h",
    OPTION_HELP_TOKEN_2: "--help",
    OPTION_HELP_DESCRIPTION: "Prints help information",
} as const;

export const RootCliConstants = {
    USAGE: "[OPTIONS] [COMMAND]",
    HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nCommands:\n${2}\n\nRun 'COMMAND --help' for more information on a command.\n`,
} as const;

export const WalletsCliConstants = {
    USAGE: "wallets [COMMAND]",
    HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'wallets --help' for more information on the wallets command.\n`,
    ADAPTER_TOKEN: "wallets",
    ADAPTER_DESCRIPTION: "Wallets related operations"
} as const;