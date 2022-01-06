import {
  CliConstants,
  ExperimentalCliConstants
} from '../../constants/cliConstants';
import {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println
} from './../../deps';
import { Dictionary } from '../../libs/math/types/math.types';
import { CompoundService } from '../domain/services/compoundService';

@cliAdapter({
  tokens: [ExperimentalCliConstants.ADAPTER_TOKEN],
  description: ExperimentalCliConstants.ADAPTER_DESCRIPTION
})
export class ExperimentalCliAdapter {
  private compoundService: CompoundService;

  constructor(compoundService: CompoundService) {
    this.compoundService = compoundService;
  }

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
      ExperimentalCliConstants.ADAPTER_TOKEN
    );
    await println(
      (errMsg || '') +
        ExperimentalCliConstants.HELP_COMMAND_TEMPLATE(
          ExperimentalCliConstants.USAGE,
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

  @cliEntrypoint({
    tokens: ['compound_long_matrix'],
    description:
      'Simple compound long position strategy. Args = token1, token2 (i.e., token 1 and 2 symbols)'
  })
  compoundLongMatrices(token1: string, token2: string): void {
    const solution: Dictionary<number> | undefined =
      this.compoundService.simpleCompoundLong();

    if (solution === undefined) {
      println(
        'No solution found for the input values. Try providing more, or different values.'
      );
      return;
    }

    println(
      ExperimentalCliConstants.COMPOUND_LONG_INFO_MSG_TEMPLATE(
        token1,
        token2,
        solution['sellP'],
        solution['sellP'], //rounded_sell_token_1_price_in_token_2,
        solution['sellQ'],
        solution['sellQ'], //rounded_sell_quantity_token_1,
        solution['buyP'],
        solution['buyP'], //rounded_buy_token_1_price_in_token_2,
        solution['buyQ'],
        solution['buyQ'], //rounded_buy_quantity_token_1,
        solution['IQ2'],
        solution['IQ2'], //rounded_initial_quantity_token_2
        solution['P1'],
        solution['P1'],
        solution['P1_PERC'],
        solution['P1_PERC']
      )
    );

    this.printForExcel(
      [solution],
      [['buyP', 'sellP', 'buyQ', 'sellQ', 'IQ2', 'P1', 'P1_PERC']]
    );
  }

  @cliEntrypoint({
    tokens: ['compound_short_matrix'],
    description:
      'Simple compound short position strategy. Args = token1, token2 (i.e., token 1 and 2 symbols)'
  })
  compoundShortMatrices(token1: string, token2: string): void {
    const solution: Dictionary<number> | undefined =
      this.compoundService.simpleCompoundShort();

    if (solution === undefined) {
      println(
        'No solution found for the input values. Try providing more, or different values.'
      );
      return;
    }

    println(
      ExperimentalCliConstants.COMPOUND_SHORT_INFO_MSG_TEMPLATE(
        token1,
        token2,
        solution['sellP'],
        solution['sellP'], //rounded_sell_token_1_price_in_token_2,
        solution['sellQ'],
        solution['sellQ'], //rounded_sell_quantity_token_1,
        solution['buyP'],
        solution['buyP'], //rounded_buy_token_1_price_in_token_2,
        solution['buyQ'],
        solution['buyQ'], //rounded_buy_quantity_token_1,
        solution['FQ1'],
        solution['FQ1'], //rounded_initial_quantity_token_2
        solution['P1'],
        solution['P1'],
        solution['P1_PERC'],
        solution['P1_PERC']
      )
    );

    this.printForExcel(
      [solution],
      [['buyP', 'sellP', 'buyQ', 'sellQ', 'FQ1', 'P1', 'P1_PERC']]
    );
  }

  @cliEntrypoint({
    tokens: ['compound_long_with_inverse_matrix'],
    description:
      'Simple compound long position strategy, with information for a short strategy on the token 2 of the pair. Args = token1, token2 (i.e., token 1 and 2 symbols)'
  })
  compoundLongWithInverseMatrices(token1: string, token2: string): void {
    const solution:
      | [Dictionary<number>, Dictionary<number>, Dictionary<number>]
      | undefined = this.compoundService.simpleCompoundLongWithInverse();

    if (solution === undefined) {
      println(
        'No solution found for the input values. Try providing more, or different values.'
      );
      return;
    }

    println(
      ExperimentalCliConstants.COMPOUND_WITH_INVERSE(
        token1,
        token2,
        ExperimentalCliConstants.COMPOUND_LONG_INFO_MSG_TEMPLATE(
          token1,
          token2,
          solution[0]['sellP'],
          solution[0]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[0]['sellQ'],
          solution[0]['sellQ'], //rounded_sell_quantity_token_1,
          solution[0]['buyP'],
          solution[0]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[0]['buyQ'],
          solution[0]['buyQ'], //rounded_buy_quantity_token_1,
          solution[0]['IQ2'],
          solution[0]['IQ2'], //rounded_initial_quantity_token_2
          solution[0]['P1'],
          solution[0]['P1'],
          solution[0]['P1_PERC'],
          solution[0]['P1_PERC']
        ),
        ExperimentalCliConstants.COMPOUND_SHORT_INFO_MSG_TEMPLATE(
          token2,
          token1,
          solution[1]['sellP'],
          solution[1]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[1]['sellQ'],
          solution[1]['sellQ'], //rounded_sell_quantity_token_1,
          solution[1]['buyP'],
          solution[1]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[1]['buyQ'],
          solution[1]['buyQ'], //rounded_buy_quantity_token_1,
          solution[1]['FQ1'],
          solution[1]['FQ1'], //rounded_initial_quantity_token_2
          solution[1]['P1'],
          solution[1]['P1'],
          solution[1]['P1_PERC'],
          solution[1]['P1_PERC']
        ),
        ExperimentalCliConstants.COMPOUND_LONG_INVERSE_INFO_MSG_TEMPLATE(
          token1,
          token2,
          solution[2]['sellP'],
          solution[2]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[2]['sellQ'],
          solution[2]['sellQ'], //rounded_sell_quantity_token_1,
          solution[2]['buyP'],
          solution[2]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[2]['buyQ'],
          solution[2]['buyQ'], //rounded_buy_quantity_token_1,
          solution[2]['FQ2'],
          solution[2]['FQ2'], //rounded_initial_quantity_token_2
          solution[2]['P2'],
          solution[2]['P2'],
          solution[2]['P2_PERC'],
          solution[2]['P2_PERC']
        )
      )
    );

    this.printForExcel(solution, [
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'IQ2', 'P1', 'P1_PERC'],
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'FQ1', 'P1', 'P1_PERC'],
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'FQ2', 'P2', 'P2_PERC']
    ]);
  }

  @cliEntrypoint({
    tokens: ['compound_short_with_inverse_matrix'],
    description:
      'Simple compound short position strategy, with information for a long strategy on the token 2 of the pair. Args = token1, token2 (i.e., token 1 and 2 symbols)'
  })
  compoundShortWithInverseMatrices(token1: string, token2: string): void {
    const solution:
      | [Dictionary<number>, Dictionary<number>, Dictionary<number>]
      | undefined = this.compoundService.simpleCompoundShortWithInverse();

    if (solution === undefined) {
      println(
        'No solution found for the input values. Try providing more, or different values.'
      );
      return;
    }

    println(
      ExperimentalCliConstants.COMPOUND_WITH_INVERSE(
        token1,
        token2,
        ExperimentalCliConstants.COMPOUND_SHORT_INFO_MSG_TEMPLATE(
          token1,
          token2,
          solution[0]['sellP'],
          solution[0]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[0]['sellQ'],
          solution[0]['sellQ'], //rounded_sell_quantity_token_1,
          solution[0]['buyP'],
          solution[0]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[0]['buyQ'],
          solution[0]['buyQ'], //rounded_buy_quantity_token_1,
          solution[0]['FQ1'],
          solution[0]['FQ1'], //rounded_initial_quantity_token_2
          solution[0]['P1'],
          solution[0]['P1'],
          solution[0]['P1_PERC'],
          solution[0]['P1_PERC']
        ),
        ExperimentalCliConstants.COMPOUND_LONG_INFO_MSG_TEMPLATE(
          token2,
          token1,
          solution[1]['sellP'],
          solution[1]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[1]['sellQ'],
          solution[1]['sellQ'], //rounded_sell_quantity_token_1,
          solution[1]['buyP'],
          solution[1]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[1]['buyQ'],
          solution[1]['buyQ'], //rounded_buy_quantity_token_1,
          solution[1]['IQ2'],
          solution[1]['IQ2'], //rounded_initial_quantity_token_2
          solution[1]['P1'],
          solution[1]['P1'],
          solution[1]['P1_PERC'],
          solution[1]['P1_PERC']
        ),
        ExperimentalCliConstants.COMPOUND_SHORT_INVERSE_INFO_MSG_TEMPLATE(
          token1,
          token2,
          solution[2]['sellP'],
          solution[2]['sellP'], //rounded_sell_token_1_price_in_token_2,
          solution[2]['sellQ'],
          solution[2]['sellQ'], //rounded_sell_quantity_token_1,
          solution[2]['buyP'],
          solution[2]['buyP'], //rounded_buy_token_1_price_in_token_2,
          solution[2]['buyQ'],
          solution[2]['buyQ'], //rounded_buy_quantity_token_1,
          solution[2]['IQ2'],
          solution[2]['IQ2'], //rounded_initial_quantity_token_2
          solution[2]['P2'],
          solution[2]['P2'],
          solution[2]['P2_PERC'],
          solution[2]['P2_PERC']
        )
      )
    );

    this.printForExcel(solution, [
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'FQ1', 'P1', 'P1_PERC'],
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'IQ2', 'P1', 'P1_PERC'],
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'IQ2', 'P2', 'P2_PERC']
    ]);
  }

  private printForExcel(
    solutions: Dictionary<number>[],
    orderedKeys: string[][]
  ) {
    let res = '\nExcel formatted:';
    for (let i = 0; i < solutions.length; i++) {
      res += '\n' + this.formatToExcel(solutions[i], orderedKeys[i]);
    }
    res += '\n';
    println(res);
  }

  private formatToExcel(values: Dictionary<number>, orderedKeys: string[]) {
    let res = '';
    let value = '';
    for (let i = 0; i < orderedKeys.length; i++) {
      if (orderedKeys[i].includes('PERC')) {
        value = (values[orderedKeys[i]] / 100 + '').replace('.', ',');
      } else {
        value = (values[orderedKeys[i]] + '').replace('.', ',');
      }

      res += value;

      if (i + 1 < orderedKeys.length) {
        res += ' ';
      }
    }
    return res;
  }
}
