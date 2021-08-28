export const CliConstants = {
    START_CLI_COMMAND: "start",
    STOP_CLI_COMMAND: "exit",
    STOP_APP_COMMAND: "exit",
    LINE_PREFIX: "> ",
    LIST_TEMPLATE: arrayTaggedTemplate`${0}\n`,
    HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\nCommands:\n${2}\nRun 'COMMAND --help' for more information on a command.\n`,
    OPTION_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    COMMAND_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
    ROOT_USAGE: "[OPTIONS] [COMMAND]",
    ROOT_OPTION_HELP: "-h, --help",
    ROOT_OPTION_HELP_DESCRIPTION: "Prints help information",
    NO_TOKENS_SPECIFIED: taggedTemplate`No tokens were specified for method ${0} of class ${1}`,
    CLI_ADAPTER_PATH_AND_CLASS: taggedTemplate`${0}.${1}`,
    REGEX_COLON_DIGITS: ":(([0-9])+)",
    CLI_ADAPTER_DEFAULT_TOKEN: ""
} as const;

export const ParserConstants = {
    TOKEN_DELIMITERS: [
        {
            START_DELIMITER: "\"",
            END_DELIMITER: "\""
        },
        {
            START_DELIMITER: "'",
            END_DELIMITER: "'"
        }
    ],
    UNMATCHING_NUM_DELIMITERS_ERROR: taggedTemplate`Number of starting delimiters: ${0} does not match the number of ending delimiters: ${1}`
} as const;

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