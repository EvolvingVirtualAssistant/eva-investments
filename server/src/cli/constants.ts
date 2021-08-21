export const CliConstants = {
    START_CLI_COMMAND: "start",
    STOP_CLI_COMMAND: "exit",
    STOP_APP_COMMAND: "exit",
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