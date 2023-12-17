export function taggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
  return function (...values: any[]) {
    return strings.map((elem, i) => `${elem}${values[i] || ''}`).join('');
  };
}

function arrayTaggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
  return function (...values: any[][]) {
    const splitElem = strings[strings.length - 1];
    return values
      .map((elem) =>
        strings
          .filter((_, i) => i !== strings.length - 1)
          .map((segment, i) => `${segment}${elem[i] || ''}`)
          .join('')
      )
      .join(splitElem);
  };
}

export const CliConstants = {
  LIST_TEMPLATE: arrayTaggedTemplate`${0}\n`,
  OPTION_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
  COMMAND_TEMPLATE: taggedTemplate`\t${0}\t\t${1}`,
  LIST_INLINE_TEMPLATE: arrayTaggedTemplate`${0}, `,

  OPTION_HELP_TOKEN_1: '-h',
  OPTION_HELP_TOKEN_2: '--help',
  OPTION_HELP_DESCRIPTION: 'Prints help information'
} as const;

export const RootCliConstants = {
  USAGE: '[OPTIONS] [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nCommands:\n${2}\n\nRun 'COMMAND --help' for more information on a command.\n`
} as const;

export const ExperimentalCliConstants = {
  USAGE: 'experimental [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'experimental --help' for more information on the experimental command.\n`,
  ADAPTER_TOKEN: 'experimental',
  ADAPTER_DESCRIPTION:
    'Experimental operations (due to be removed/changed at any point)',
  COMPOUND_SHORT_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of token 1: ${0}(${1})\nSell quantity of token 1: ${1}(${2})\nBuy price of token 1: ${3}(${4})\nBuy quantity of token 1: ${5}(${6})\nFinal quantity of token 1: ${7}(${8})\nProfit in token 1: ${9}(${10})\nProfit in percentage of token 1: ${11}%(${12}%)`,
  COMPOUND_LONG_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of token 1: ${0}(${1})\nSell quantity of token 1: ${1}(${2})\nBuy price of token 1: ${3}(${4})\nBuy quantity of token 1: ${5}(${6})\nInitial quantity of token 2: ${7}(${8})\nProfit in token 1: ${9}(${10})\nProfit in percentage of token 1: ${11}%(${12}%)`,
  SELL_QUANTITY: 'SELL_QUANTITY',
  BUY_QUANTITY: 'BUY_QUANTITY',
  SELL_PRICE: 'SELL_PRICE',
  BUY_PRICE: 'BUY_PRICE',
  QUANTITY_TOKEN_2: 'QUANTITY_TOKEN_2',
  COMPOUND_LONG_PROFIT_GREATER_THAN_BOUGHT_QUANTITY: taggedTemplate`Profit cannot be greater than the amount of token 1 bought (considering buying fees). profit (${0}) > buy_quantity (${1}) * buy_fee_reduction (${2})`
} as const;

export const ContractsCliConstants = {
  USAGE: 'contracts [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'contracts --help' for more information on the contracts command.\n`,
  ADAPTER_TOKEN: 'contracts',
  ADAPTER_DESCRIPTION: 'Contracts related operations',
  CONTRACTS_DEPLOY_TOKEN: 'deploy',
  CONTRACTS_DEPLOY_DESCRIPTION:
    'Deploys contract given contractPath(1) contractName(2) compiledContractPath(3) deployerAccountAddress(4) host(5) gas(6) gasPrice(7) ethereUnit(8) contractArgsJson(9)',
  CONTRACTS_PARTICIPANTS_LIST_TOKEN: 'participants_list',
  CONTRACTS_PARTICIPANTS_LIST_DESCRIPTION:
    'List participants of contract given chainId(1) contractAddress(2) ownerAddress(3)',
  CONTRACTS_PARTICIPANTS_ADD_TOKEN: 'participants_add',
  CONTRACTS_PARTICIPANTS_ADD_DESCRIPTION:
    'Adds participant to contract given chainId(1) contractAddress(2) participantAddress(3) ownerAddress(4)',
  CONTRACTS_PARTICIPANTS_REMOVE_TOKEN: 'participants_remove',
  CONTRACTS_PARTICIPANTS_REMOVE_DESCRIPTION:
    'Removes participant from contract given chainId(1) contractAddress(2) participantAddress(3) ownerAddress(45)',
  CONTRACTS_PARTICIPANTS_TRANSFER_OWNERSHIP_TOKEN:
    'participants_transfer_ownership',
  CONTRACTS_PARTICIPANTS_TRANSFER_OWNERSHIP_DESCRIPTION:
    'Transfers ownership of contract to some other address given chainId(1) contractAddress(2) ownerAddress(3) newOwnerAddress(4)'
} as const;
