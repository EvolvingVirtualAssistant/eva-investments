function taggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
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

export const WalletsCliConstants = {
  USAGE: 'wallets [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'wallets --help' for more information on the wallets command.\n`,
  ADAPTER_TOKEN: 'wallets',
  ADAPTER_DESCRIPTION: 'Wallets related operations'
} as const;

export const ExperimentalCliConstants = {
  USAGE: 'experimental [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'experimental --help' for more information on the experimental command.\n`,
  ADAPTER_TOKEN: 'experimental',
  ADAPTER_DESCRIPTION:
    'Experimental operations (due to be removed/changed at any point)',
  COMPOUND_SHORT_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of ${0}: ${2}(${3}) ${1}\nSell quantity of ${0}: ${4}(${5}) ${0}\nBuy price of ${0}: ${6}(${7}) ${1}\nBuy quantity of ${0}: ${8}(${9}) ${0}\nFinal quantity of ${0}: ${10}(${11}) ${0}\nProfit in ${0}: ${12}(${13}) ${0}\nProfit in percentage of ${0}: ${14}%(${15}%) ${0}`,
  COMPOUND_SHORT_INVERSE_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of ${0}: ${2}(${3}) ${1}\nSell quantity of ${0}: ${4}(${5}) ${0}\nBuy price of ${0}: ${6}(${7}) ${1}\nBuy quantity of ${0}: ${8}(${9}) ${0}\nInitial quantity of ${1}: ${10}(${11}) ${1}\nProfit in ${1}: ${12}(${13}) ${1}\nProfit in percentage of ${1}: ${14}%(${15}%) ${1}`,
  COMPOUND_LONG_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of ${0}: ${2}(${3}) ${1}\nSell quantity of ${0}: ${4}(${5}) ${0}\nBuy price of ${0}: ${6}(${7}) ${1}\nBuy quantity of ${0}: ${8}(${9}) ${0}\nInitial quantity of ${1}: ${10}(${11}) ${1}\nProfit in ${0}: ${12}(${13}) ${0}\nProfit in percentage ${0}: ${14}%(${15}%) ${0}`,
  COMPOUND_LONG_INVERSE_INFO_MSG_TEMPLATE: taggedTemplate`Sell price of ${0}: ${2}(${3}) ${1}\nSell quantity of ${0}: ${4}(${5}) ${0}\nBuy price of ${0}: ${6}(${7}) ${1}\nBuy quantity of ${0}: ${8}(${9}) ${0}\nFinal quantity of ${1}: ${10}(${11}) ${1}\nProfit in ${1}: ${12}(${13}) ${1}\nProfit in percentage ${1}: ${14}%(${15}%) ${1}`,
  COMPOUND_WITH_INVERSE: taggedTemplate`${2}\n\n For compounding ${1}, the values are the following (in case you have the inverse pair available, ${1}/${0}):\n\n${3}\n\n For compounding token ${1}, the values are the following:\n\n${4}`,
  SELL_QUANTITY: 'SELL_QUANTITY',
  BUY_QUANTITY: 'BUY_QUANTITY',
  SELL_PRICE: 'SELL_PRICE',
  BUY_PRICE: 'BUY_PRICE',
  QUANTITY_TOKEN_2: 'QUANTITY_TOKEN_2',
  COMPOUND_LONG_PROFIT_GREATER_THAN_BOUGHT_QUANTITY: taggedTemplate`Profit cannot be greater than the amount of token 1 bought (considering buying fees). profit (${0}) > buy_quantity (${1}) * buy_fee_reduction (${2})`
} as const;
