export const CliConstants = {
  START_CLI_COMMAND: 'start',
  STOP_CLI_COMMAND: 'exit',
  INTERPRET_COMMAND: 'interpretCommand',
  LINE_PREFIX: '> ',
  FININSHED_PROCESSING_COMMAND: 'Finished Processing Command',
  NO_TOKENS_SPECIFIED: taggedTemplate`No tokens were specified for method ${0} of class ${1}`,
  FALLBACK_MISSING_ARG: taggedTemplate`Fallback method ${0} of class ${1}, must have at least 1 argument declared in order to handle error messages`,
  CLI_ADAPTER_PATH_AND_CLASS: taggedTemplate`${0}.${1}`,
  REGEX_COLON_DIGITS: ':(([0-9])+)',
  CLI_ADAPTER_DEFAULT_TOKEN: '',
  CLI_TOKEN_NOT_FOUND: taggedTemplate`\nCommand not found: '${0}'\n`,
  CLI_MISSING_ARGS: taggedTemplate`\nCommand: '${0}' needs ${1} argument(s), but ${2} argument(s) were specified\n`,
  CLI_COMMAND_NEEDS_OPTIONS: taggedTemplate`\nCommand: '${0}' needs options to be specified\n`,
} as const;

export const ParserConstants = {
  TOKEN_DELIMITERS: [
    {
      START_DELIMITER: '"',
      END_DELIMITER: '"',
    },
    {
      START_DELIMITER: "'",
      END_DELIMITER: "'",
    },
  ],
  UNMATCHING_NUM_DELIMITERS_ERROR: taggedTemplate`Number of starting delimiters: ${0} does not match the number of ending delimiters: ${1}`,
  START_POS_SUPERIOR_TO_INFERIOR_POS_DELIMITERS_ERROR: taggedTemplate`Position of the starting delimiter: ${0} is superior to the ending delimiter: ${1}`,
} as const;

// deno-lint-ignore no-explicit-any
function taggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
  // deno-lint-ignore no-explicit-any
  return function (...values: any[]) {
    return strings.map((elem, i) => `${elem}${values[i] || ''}`).join('');
  };
}
