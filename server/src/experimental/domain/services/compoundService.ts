import { ExperimentalCliConstants } from '../../../constants/cliConstants.ts';
import { println } from '../../../libs/cli/mod.ts';
import {
  equationToString,
  parseEquation,
} from '../../../libs/math/equations/equationParser.ts';
import {
  solveEquations,
  getConstantBySolvingExpression,
} from '../../../libs/math/equations/equationSolver.ts';
import {
  getAugmentedMatrices,
  solveLinearMatrices,
  solveMatricesUnresolved,
} from '../../../libs/math/matrices/matricesSolver.ts';
import { Dictionary, Equation } from '../../../libs/math/types/math.types.ts';
import { deepCopy } from '../../../libs/math/utils/deepCopy.ts';
import { ExperimentalError } from '../../errors/exerimentalError.ts';
import { CompoundEquations } from '../types/compound.type.ts';

export class CompoundService {
  // -------------------------- COMPOUND LONG CONSTS --------------------------

  static readonly COMPOUND_LONG_EQUATIONS: CompoundEquations = {
    equations: [
      [
        'buyP*buyQ=IQ2',
        'buyP*buyQ-IQ2=0',
        'IQ2*buyPInv=buyQ',
        'IQ2*buyPInv-buyQ=0',
        'IQ2*buyQInv=buyP',
        'IQ2*buyQInv-buyP=0',
      ],
      [
        'sellQ*sellP*sellF=IQ2',
        'sellQ*sellP*sellF-IQ2=0',
        '(1/sellF)*sellPInv*IQ2=sellQ',
        '(1/sellF)*sellPInv*IQ2-sellQ=0',
        'sellPInv*IQ2=sellF*sellQ',
        'sellPInv*IQ2-(sellF*sellQ)=0',
        '(1/sellF)*sellQInv*IQ2=sellP',
        '(1/sellF)*sellQInv*IQ2-sellP=0',
        'sellQInv*IQ2=sellF*sellP',
        'sellQInv*IQ2-(sellF*sellP)=0',
      ],
      [
        'buyF*buyQ=P1+sellQ',
        'buyF*buyQ-P1=sellQ',
        'buyF*buyQ-sellQ=P1',
        'buyF*buyQ-P1-sellQ=0',
        'P1=(buyF*buyQ)-sellQ',
        'P1+sellQ=buyF*buyQ',
        'sellQ=(buyF*buyQ)-P1',
        'buyQInv=buyF/(P1+sellQ)',
        'buyQInv-(buyF/(P1+sellQ))=0',
        'sellQInv=1/((buyF*buyQ)-P1)',
        'sellQInv-(1/((buyF*buyQ)-P1))=0',
      ],
    ],
    postMatrixSolvedEquations: [
      'buyPInv=1/buyP',
      'sellPInv=1/sellP',
      'buyQInv=1/buyQ',
      'sellQInv=1/sellQ',
      'buyP=1/buyPInv',
      'sellP=1/sellPInv',
      'buyQ=1/buyQInv',
      'sellQ=1/sellQInv',
    ],
  };

  static readonly COMPOUND_LONG_EQUATIONS_DERIVATIONS: Equation[] =
    CompoundService.COMPOUND_LONG_EQUATIONS.equations.flatMap((equations) =>
      equations.map((eq) => parseEquation(eq))
    );

  static readonly COMPOUND_LONG_POST_MATRIX_SOLVED_EQUATIONS =
    CompoundService.COMPOUND_LONG_EQUATIONS.postMatrixSolvedEquations.map(
      (eq) => parseEquation(eq)
    );

  static readonly SIMPLE_COMPOUND_LONG_AUGMENTED_MATRICES =
    getAugmentedMatrices(
      CompoundService.COMPOUND_LONG_EQUATIONS.equations.map((eq) =>
        eq.map((variation) => parseEquation(variation))
      ),
      [
        'buyP',
        'sellP',
        'buyQ',
        'sellQ',
        'IQ2',
        'P1',
        'buyPInv',
        'sellPInv',
        'buyQInv',
        'sellQInv',
      ]
    );

  // -------------------------- COMPOUND LONG CONSTS --------------------------

  // -------------------------- COMPOUND SHORT CONSTS --------------------------

  static readonly COMPOUND_SHORT_EQUATIONS: CompoundEquations = {
    equations: [
      [
        'sellF*sellQ=(buyQ*buyP)/sellP',
        'sellF*sellQ-((buyQ/sellP)*buyP)=0',
        'sellF*sellQ-((buyP/sellP)*buyQ)=0',
        'sellF*sellQ-(buyP*buyQ*sellPInv)=0',
        'sellF*sellP=(buyQ*buyP)/sellQ',
        'sellF*sellP-((buyQ/sellQ)*buyP)=0',
        'sellF*sellP-((buyP/sellQ)*buyQ)=0',
        'sellF*sellP-(buyP*buyQ*sellQInv)=0',
        'buyQ=(sellF*sellQ*sellP)/buyP',
        'buyQ-(((sellF*sellQ)/buyP)*sellP)=0',
        'buyQ-(((sellF*sellP)/buyP)*sellQ)=0',
        'buyQ-(sellF*sellP*sellQ*buyPInv)=0',
        'buyP=(sellF*sellQ*sellP)/buyQ',
        'buyP-(((sellF*sellQ)/buyQ)*sellP)=0',
        'buyP-(((sellF*sellP)/buyQ)*sellQ)=0',
        'buyP-(sellF*sellP*sellQ*buyQInv)=0',
      ],
      [
        'F*sellQ=(FQ1*buyP)/sellP',
        'F*sellQ-((FQ1/sellP)*buyP)=0',
        'F*sellQ-((buyP/sellP)*FQ1)=0',
        'F*sellQ-(buyP*FQ1*sellPInv)=0',
        'F*sellP=(FQ1*buyP)/sellQ',
        'F*sellP-((FQ1/sellQ)*buyP)=0',
        'F*sellP-((buyP/sellQ)*FQ1)=0',
        'F*sellP-(buyP*FQ1*sellQInv)=0',
        'FQ1=(F*sellQ*sellP)/buyP',
        'FQ1-(((F*sellQ)/buyP)*sellP)=0',
        'FQ1-(((F*sellP)/buyP)*sellQ)=0',
        'FQ1-(F*sellP*sellQ*buyPInv)=0',
        'buyP=(F*sellQ*sellP)/FQ1',
        'buyP-(((F*sellQ)/FQ1)*sellP)=0',
        'buyP-(((F*sellP)/FQ1)*sellQ)=0',
        'buyP-(F*sellP*sellQ*FQ1Inv)=0',
      ],
      [
        'buyF*buyQ=P1+sellQ',
        'buyF*buyQ-P1=sellQ',
        'buyF*buyQ-sellQ=P1',
        'buyF*buyQ-P1-sellQ=0',
        'P1=(buyF*buyQ)-sellQ',
        'P1+sellQ=buyF*buyQ',
        'sellQ=(buyF*buyQ)-P1',
        'buyQInv=buyF/(P1+sellQ)',
        'buyQInv-(buyF/(P1+sellQ))=0',
        'sellQInv=1/((buyF*buyQ)-P1)',
        'sellQInv-(1/((buyF*buyQ)-P1))=0',
      ],
    ],
    postMatrixSolvedEquations: [
      'buyPInv=1/buyP',
      'sellPInv=1/sellP',
      'buyQInv=1/buyQ',
      'sellQInv=1/sellQ',
      'buyP=1/buyPInv',
      'sellP=1/sellPInv',
      'buyQ=1/buyQInv',
      'sellQ=1/sellQInv',
      'FQ1=1/FQ1Inv',
      'FQ1Inv=1/FQ1',
    ],
  };

  static readonly COMPOUND_SHORT_EQUATIONS_DERIVATIONS: Equation[] =
    CompoundService.COMPOUND_SHORT_EQUATIONS.equations.flatMap((equations) =>
      equations.map((eq) => parseEquation(eq))
    );

  static readonly COMPOUND_SHORT_POST_MATRIX_SOLVED_EQUATIONS =
    CompoundService.COMPOUND_SHORT_EQUATIONS.postMatrixSolvedEquations.map(
      (eq) => parseEquation(eq)
    );

  static readonly SIMPLE_COMPOUND_SHORT_AUGMENTED_MATRICES =
    getAugmentedMatrices(
      CompoundService.COMPOUND_SHORT_EQUATIONS.equations.map((eq) =>
        eq.map((variation) => parseEquation(variation))
      ),
      [
        'buyP',
        'sellP',
        'buyQ',
        'sellQ',
        'P1',
        'FQ1',
        'buyPInv',
        'sellPInv',
        'buyQInv',
        'sellQInv',
        'FQ1Inv',
      ]
    );

  // -------------------------- COMPOUND SHORT CONSTS --------------------------

  constructor() {}

  /**
   * The following four initial equations essentially describe a
   * simple compound with a long position strategy:
   * 1. IQ2 = buyP * buyQ
   * 2. buyQ * buyF = IQ1
   * 3. IQ1 - P1 = sellQ
   * 4. sellQ * sellP * sellF = IQ2
   * The initial equations are then simplified (in order to get rid of intermediate variables,
   * which have no purpose and will never be provided by the user) and result in three equations,
   * which will be used as part of a system of equations in order to find the values
   * for the different variables:
   * 1. buyP * buyQ = IQ2
   * 2. sellQ * sellP * sellF = IQ2
   * 3. (buyQ * buyF) - P1 = sellQ
   * As you have noticed, some of the original equations are not linear, which means
   * that in order to use the gauss elimination method to solve the system (represented by matrices),
   * it's necessary that said system of equations is linear, implying that all
   * equations must also be linear.
   * In order to turn these equations in to linear form, we opted by assuming that the
   * coefficients (which are themselved variables) need to be provided as constants
   * to this function (inputValues)
   * Also for each equation (or row in a matrix) we will be able to solve one variable,
   * so if we have three equations, we will solve three variables at once, per matrix
   * @returns
   */
  simpleCompoundLong(): Dictionary<number> | undefined {
    const inputEquations: string[] = [
      'buyP=54990',
      'sellP=55500',
      'IQ2=90',
      'buyF=0.999',
      'sellF=0.999',
    ];

    return this.singleCompoundLong(inputEquations);
  }

  private singleCompoundLong(
    inputEquations: string[]
  ): Dictionary<number> | undefined {
    const linearMatrices = solveMatricesUnresolved(
      CompoundService.SIMPLE_COMPOUND_LONG_AUGMENTED_MATRICES,
      inputEquations.map((eq) => parseEquation(eq))
    );

    let solutions = solveLinearMatrices(
      linearMatrices,
      inputEquations.map((eq) => parseEquation(eq)),
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'IQ2', 'P1'],
      CompoundService.COMPOUND_LONG_POST_MATRIX_SOLVED_EQUATIONS
    );

    if (solutions.length === 0) {
      return undefined;
    }

    if (solutions[0]['P1'] != null && solutions[0]['sellQ'] != null) {
      solutions[0]['P1_PERC'] =
        (solutions[0]['P1'] * 100) / solutions[0]['sellQ'];
    }

    solutions = this.getValidSolutions(
      solutions,
      CompoundService.COMPOUND_LONG_EQUATIONS_DERIVATIONS
    );
    // In the future check whether all solutions are equal (they must be)

    return solutions[0];
  }

  /**
   * The following six initial equations essentially describe a
   * simple compound with a short position strategy:
   * 1. sellQ * sellP * sellF = IQ2
   * 2. buyQ * buyP = IQ2
   * 3. IQ2 * buyF = FQ2 (final quantity token 2)
   * 4. FQ2 / buyP = FQ1 (final quantity token 1)
   * 5. buyQ * buyF = FQ1
   * 6. FQ1 - sellQ = P1
   * The initial equations are then simplified (in order to get rid of intermediate variables,
   * which have no purpose and will never be provided by the user) and result in three equations,
   * which will be used as part of a system of equations in order to find the values
   * for the different variables:
   * 1. sellQ * sellP * sellF = buyQ * buyP
   * 2. FQ1 = (sellP * sellQ * F) / buyP
   * 3. (buyQ * buyF) - P1 = sellQ
   * As you have noticed, some of the original equations are not linear, which means
   * that in order to use the gauss elimination method to solve the system (represented by matrices),
   * it's necessary that said system of equations is linear, implying that all
   * equations must also be linear.
   * In order to turn these equations in to linear form, we opted by assuming that the
   * coefficients (which are themselved variables) need to be provided as constants
   * to this function (inputValues)
   * Also for each equation (or row in a matrix) we will be able to solve one variable,
   * so if we have three equations, we will solve three variables at once, per matrix
   * @returns
   */
  simpleCompoundShort(): Dictionary<number> | undefined {
    const inputEquations: string[] = [
      'buyP=55228',
      'sellP=55500',
      'sellQ=0.002',
      'buyF=0.999',
      'sellF=0.999',
      'F=0.998001',
    ];

    return this.singleCompoundShort(inputEquations);
  }

  private singleCompoundShort(
    inputEquations: string[]
  ): Dictionary<number> | undefined {
    const linearMatrices = solveMatricesUnresolved(
      CompoundService.SIMPLE_COMPOUND_SHORT_AUGMENTED_MATRICES,
      inputEquations.map((eq) => parseEquation(eq))
    );

    let solutions = solveLinearMatrices(
      linearMatrices,
      inputEquations.map((eq) => parseEquation(eq)),
      ['buyP', 'sellP', 'buyQ', 'sellQ', 'FQ1', 'P1'],
      CompoundService.COMPOUND_SHORT_POST_MATRIX_SOLVED_EQUATIONS
    );

    if (solutions.length === 0) {
      return undefined;
    }

    if (solutions[0]['P1'] != null && solutions[0]['sellQ'] != null) {
      solutions[0]['P1_PERC'] =
        (solutions[0]['P1'] * 100) / solutions[0]['sellQ'];
    }

    solutions = this.getValidSolutions(
      solutions,
      CompoundService.COMPOUND_SHORT_EQUATIONS_DERIVATIONS
    );
    // In the future check whether all solutions are equal (they must be)

    return solutions[0];
  }

  /**
   * Compound long strategy for token 1, with info for short strategy on token 2
   * @returns
   */
  simpleCompoundLongWithInverse():
    | [Dictionary<number>, Dictionary<number>, Dictionary<number>]
    | undefined {
    const buyF = 0.999;
    const sellF = 0.999;
    const inputEquations: string[] = [
      'buyP=1.8116',
      'sellP=1.824',
      'buyQ=0.9312756679179',
      `buyF=${buyF}`,
      `sellF=${sellF}`,
    ];

    const longSolution = this.singleCompoundLong(inputEquations);

    if (longSolution === undefined) {
      return undefined;
    }

    const shortSolution: Dictionary<number> = {};
    shortSolution['buyP'] = 1 / longSolution['sellP'];
    shortSolution['sellP'] = 1 / longSolution['buyP'];
    shortSolution['sellQ'] = longSolution['IQ2'];

    // Short equation 1. sellQ * sellP * sellF = buyQ * buyP <=> buyQ = (sellQ * sellP * sellF)/buyP
    shortSolution['buyQ'] =
      (shortSolution['sellQ'] * shortSolution['sellP'] * sellF) /
      shortSolution['buyP'];

    // Short equation 2. FQ1 = (sellP * sellQ * F) / buyP
    shortSolution['FQ1'] =
      (shortSolution['sellP'] * shortSolution['sellQ'] * buyF * sellF) /
      shortSolution['buyP'];

    // Short equation 3. (buyQ * buyF) - P1 = sellQ <=> P1 = (buyQ * buyF) - sellQ
    shortSolution['P1'] = shortSolution['buyQ'] * buyF - shortSolution['sellQ'];

    shortSolution['P1_PERC'] =
      (shortSolution['P1'] * 100) / shortSolution['sellQ'];

    // These equations will be very similar to the long equations, the difference is that
    // Instead of looking for profit in terms of token 1, we look for it in terms of token 2
    const longSolutionInverse: Dictionary<number> = {};
    longSolutionInverse['buyP'] = longSolution['buyP'];
    longSolutionInverse['buyQ'] =
      longSolution['IQ2'] / longSolutionInverse['buyP'];
    longSolutionInverse['sellP'] = longSolution['sellP'];
    longSolutionInverse['sellQ'] = longSolutionInverse['buyQ'] * buyF;
    longSolutionInverse['FQ2'] =
      longSolutionInverse['sellQ'] * longSolutionInverse['sellP'] * sellF;
    longSolutionInverse['P2'] =
      longSolutionInverse['FQ2'] - longSolution['IQ2'];

    longSolutionInverse['P2_PERC'] =
      (longSolutionInverse['P2'] * 100) / longSolutionInverse['FQ2'];

    return [longSolution, shortSolution, longSolutionInverse];
  }

  /**
   * Compound short strategy for token 1, with info for long strategy on token 2
   * @returns
   */
  simpleCompoundShortWithInverse():
    | [Dictionary<number>, Dictionary<number>, Dictionary<number>]
    | undefined {
    const buyF = 0.999;
    const sellF = 0.999;
    const F = buyF * sellF;
    const inputEquations: string[] = [
      'P1=0.1',
      'sellP=0.00002842',
      'sellQ=400',
      `buyF=${buyF}`,
      `sellF=${sellF}`,
      `F=${F}`,
    ];

    const shortSolution = this.singleCompoundShort(inputEquations);

    if (shortSolution === undefined) {
      return undefined;
    }

    const longSolution: Dictionary<number> = {};
    longSolution['buyP'] = 1 / shortSolution['sellP'];
    longSolution['sellP'] = 1 / shortSolution['buyP'];
    longSolution['buyQ'] = shortSolution['sellQ'] * shortSolution['sellP'];

    // Long equation 1. buyP * buyQ = IQ2
    longSolution['IQ2'] = longSolution['buyP'] * longSolution['buyQ'];

    // Long equation 2. sellQ * sellP * sellF = IQ2 <=> sellQ = IQ2/(sellP * sellF)
    longSolution['sellQ'] =
      longSolution['IQ2'] / (longSolution['sellP'] * sellF);

    // Long equation 3. (buyQ * buyF) - P1 = sellQ <=> P1 = (buyQ * buyF) - sellQ
    longSolution['P1'] = longSolution['buyQ'] * buyF - longSolution['sellQ'];

    longSolution['P1_PERC'] =
      (longSolution['P1'] * 100) / longSolution['sellQ'];

    // These equations will be very similar to the long equations, the difference is that
    // Instead of looking for profit in terms of token 1, we look for it in terms of token 2
    const shortSolutionInverse: Dictionary<number> = {};
    shortSolutionInverse['buyP'] = shortSolution['buyP'];
    shortSolutionInverse['buyQ'] = shortSolution['sellQ'] / buyF;
    shortSolutionInverse['sellP'] = shortSolution['sellP'];
    shortSolutionInverse['sellQ'] = shortSolution['sellQ'];
    shortSolutionInverse['IQ2'] =
      shortSolutionInverse['sellQ'] * shortSolutionInverse['sellP'] * sellF;
    shortSolutionInverse['P2'] =
      shortSolutionInverse['IQ2'] -
      shortSolutionInverse['buyP'] * shortSolutionInverse['buyQ'] * buyF;

    shortSolutionInverse['P2_PERC'] =
      (shortSolutionInverse['P2'] * 100) / shortSolutionInverse['IQ2'];

    return [shortSolution, longSolution, shortSolutionInverse];
  }

  private getValidSolutions(
    solutions: Dictionary<number>[],
    equations: Equation[]
  ): Dictionary<number>[] {
    // Solve every equation on the initial equations, with the solutions
    // and exclude the solutions that do not respect the equations
    // TODO consider only using the base equations that generated all other equations
    return solutions.filter((sol) => {
      let count = 0;
      for (const _key in sol) {
        count++;
      }

      return equations.every((eq) => {
        const leftConstant = getConstantBySolvingExpression(eq.leftExpression, [
          sol,
          count,
        ]);

        if (leftConstant == null) {
          return false;
        }

        const rightConstant = getConstantBySolvingExpression(
          eq.rightExpression,
          [sol, count]
        );

        if (rightConstant == null) {
          return false;
        }

        // Check if the values are roughly similar (TO DO work on the rounding)
        return Math.abs(leftConstant.value - rightConstant.value) < 1;
      });
    });
  }

  /** -------------------------- DEPRECATED --------------------------
   * - EQUATION SOLVING THROUGH REPLACEMENT
   * - HARD CODED EQUATIONS SOLVING
   * ~-------------------------- DEPRECATED --------------------------
   */

  /*@cliEntrypoint({
    tokens: ['compound_long'],
    description: 'Solves hard coded equations for now',
  })*/
  compoundLong(): void {
    const equationsToSolve: string[] = [
      'buyP=IQ2/buyQ',
      'sellP=IQ2/(sellQ*sellF)',
      'buyQ=IQ2/buyP',
      'buyQ=(sellQ+P1)/buyF',
      'buyQ=FQ1/buyF',
      'sellQ=(buyQ*buyF)-P1',
      'sellQ=IQ2/(sellP*sellF)',
      'sellQ=FQ1-P1',
      'IQ2=buyP*buyQ',
      'IQ2=sellP*sellQ*sellF',
      'FQ1=buyQ*buyF',
      'FQ1=sellQ+P1',
      'P1=(buyQ*buyF)-sellQ',
      'P1=FQ1-sellQ',
    ];

    const inputEquations: string[] = [
      'buyQ=6.27',
      'P1=0.2',
      'IQ2=90',
      'buyF=0.999',
      'sellF=0.999',
    ];

    const equations = equationsToSolve.map((eq) => parseEquation(eq));
    const inputValues = inputEquations.map((eq) => parseEquation(eq));
    const [solvedEquations, solvedVariables] = solveEquations(
      equations,
      inputValues
    );

    const profit_perc_in_token_1 =
      solvedVariables['P1'] != null && solvedVariables['sellQ'] != null
        ? (solvedVariables['P1'] * 100) / solvedVariables['sellQ']
        : undefined;

    println(
      ExperimentalCliConstants.COMPOUND_LONG_INFO_MSG_TEMPLATE(
        solvedVariables['sellP'],
        solvedVariables['sellP'], //rounded_sell_token_1_price_in_token_2,
        solvedVariables['sellQ'],
        solvedVariables['sellQ'], //rounded_sell_quantity_token_1,
        solvedVariables['buyP'],
        solvedVariables['buyP'], //rounded_buy_token_1_price_in_token_2,
        solvedVariables['buyQ'],
        solvedVariables['buyQ'], //rounded_buy_quantity_token_1,
        solvedVariables['IQ2'],
        solvedVariables['IQ2'], //rounded_initial_quantity_token_2
        solvedVariables['P1'],
        solvedVariables['P1'],
        profit_perc_in_token_1,
        profit_perc_in_token_1
      )
    );
  }

  /*@cliEntrypoint({
    tokens: ['compound_short'],
    description: 'Solves hard coded equations for now',
  })*/
  compoundShort(): void {
    const equationsToSolve: string[] = [
      'buyP=(sellP*sellQ*sellF)/buyQ',
      'buyP=(sellP*sellQ*sellF)/(P1+sellQ)',
      'buyP=(sellP*sellQ*sellF)/FQ1',
      'sellP=(buyP*buyQ)/(sellQ*sellF)',
      'sellP=(P1+sellQ)/(sellQ*F)',
      'sellP=FQ1/(sellQ*F)',
      'buyQ=(sellP*sellQ*sellF)/buyP',
      'buyQ=(P1+sellQ)/buyF',
      'buyQ=FQ1/buyF',
      'sellQ=(buyP*buyQ)/(sellP*sellF)',
      'sellQ=(buyQ*buyF)-P1',
      'sellQ=FQ1-P1',
      'FQ1=P1+sellQ',
      'FQ1=buyQ*buyF',
      'FQ1=(sellP*sellQ*F)/buyP',
      'FQ2=IQ2*buyF',
      'FQ2=FQ1*buyP',
      'IQ2=sellP*sellQ*sellF',
      'IQ2=buyP*buyQ',
      'IQ2=FQ2/buyF',
      'F=buyF*sellF',
      'FQ1=(sellP*sellQ*F)/buyP',
      'P1=(buyQ*buyF)-sellQ',
      'P1=((sellP*sellQ*F)/buyP)-sellQ',
      'P1=FQ1-sellQ',
    ];

    const inputEquations: string[] = [
      'buyP=158.5',
      'sellP=163.2',
      'P1=1.2',
      'buyF=0.999',
      'sellF=0.999',
      'F=0.998001',
    ];

    const equations = equationsToSolve.map((eq) => parseEquation(eq));
    const inputValues = inputEquations.map((eq) => parseEquation(eq));
    const [solvedEquations, solvedVariables] = solveEquations(
      equations,
      inputValues
    );

    const profit_perc_in_token_1 =
      solvedVariables['P1'] != null && solvedVariables['sellQ'] != null
        ? (solvedVariables['P1'] * 100) / solvedVariables['sellQ']
        : undefined;

    println(
      ExperimentalCliConstants.COMPOUND_SHORT_INFO_MSG_TEMPLATE(
        solvedVariables['sellP'],
        solvedVariables['sellP'], //rounded_sell_token_1_price_in_token_2,
        solvedVariables['sellQ'],
        solvedVariables['sellQ'], //rounded_sell_quantity_token_1,
        solvedVariables['buyP'],
        solvedVariables['buyP'], //rounded_buy_token_1_price_in_token_2,
        solvedVariables['buyQ'],
        solvedVariables['buyQ'], //rounded_buy_quantity_token_1,
        solvedVariables['FQ1'],
        solvedVariables['FQ1'], //rounded_initial_quantity_token_2
        solvedVariables['P1'],
        solvedVariables['P1'],
        profit_perc_in_token_1,
        profit_perc_in_token_1
      )
    );
  }

  private roundDown(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }

  private roundUp(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
  }

  /*@cliEntrypoint({
    tokens: ['compound_short_by_profit'],
    description:
      'compound_short_by_profit (sell high to buy low) args - value_1 value_2 value_1_label value_2_label profit_in_token_1 sell_fee_perc buy_fee_perc quantity_decimals price_decimals',
  })*/
  compoundShortByProfit(
    value_1: number,
    value_2: number,
    value_1_label: string,
    value_2_label: string,
    profit_in_token_1: number,
    sell_fee_perc: number,
    buy_fee_perc: number,
    quantity_decimals: number,
    price_decimals: number
  ): void {
    const sell_fee_reduction = 1 - (sell_fee_perc * 1) / 100;
    const buy_fee_reduction = 1 - (buy_fee_perc * 1) / 100;
    const fee_reduction = sell_fee_reduction * buy_fee_reduction;

    const [
      buy_token_1_price_in_token_2,
      sell_token_1_price_in_token_2,
      buy_quantity_token_1,
      sell_quantity_token_1,
    ] = this.shortGetQuantitiesAndPrices(
      value_1,
      value_2,
      value_1_label,
      value_2_label,
      profit_in_token_1,
      price_decimals,
      quantity_decimals,
      buy_fee_reduction,
      sell_fee_reduction,
      fee_reduction
    );

    const final_quantity_token_1 =
      (sell_quantity_token_1 * sell_token_1_price_in_token_2 * fee_reduction) /
      buy_token_1_price_in_token_2;
    // Final quantity based on the rounded buy quantity
    const rounded_final_quantity_token_1 =
      buy_quantity_token_1 * buy_fee_reduction;

    const rounded_profit_in_token_1 =
      rounded_final_quantity_token_1 - sell_quantity_token_1;
    const profit_perc_in_token_1 = this.roundDown(
      (profit_in_token_1 * 100) / sell_quantity_token_1,
      2
    );
    const rounded_profit_perc_in_token_1 = this.roundDown(
      (rounded_profit_in_token_1 * 100) / sell_quantity_token_1,
      2
    );

    println(
      ExperimentalCliConstants.COMPOUND_SHORT_INFO_MSG_TEMPLATE(
        sell_token_1_price_in_token_2,
        sell_token_1_price_in_token_2, //rounded_sell_token_1_price_in_token_2,
        sell_quantity_token_1,
        sell_quantity_token_1, //rounded_sell_quantity_token_1,
        buy_token_1_price_in_token_2,
        buy_token_1_price_in_token_2, //rounded_buy_token_1_price_in_token_2,
        buy_quantity_token_1,
        buy_quantity_token_1, //rounded_buy_quantity_token_1,
        final_quantity_token_1,
        rounded_final_quantity_token_1,
        profit_in_token_1,
        rounded_profit_in_token_1,
        profit_perc_in_token_1,
        rounded_profit_perc_in_token_1
      )
    );
  }

  private shortGetQuantitiesAndPrices(
    value1: number,
    value2: number,
    value1Label: string,
    value2Label: string,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    sellFeeReduction: number,
    feeReduction: number
  ): [number, number, number, number] {
    var sellPrice = 0;
    var buyPrice = 0;
    var sellQuantity = 0;
    var buyQuantity = 0;

    switch (value1Label) {
      case ExperimentalCliConstants.BUY_PRICE:
        buyPrice = value1;
        break;
      case ExperimentalCliConstants.SELL_PRICE:
        sellPrice = value1;
        break;
      case ExperimentalCliConstants.BUY_QUANTITY:
        buyQuantity = value1;
        break;
      case ExperimentalCliConstants.SELL_QUANTITY:
        sellQuantity = value1;
        break;
      default:
        throw new ExperimentalError(
          `Value 1 label ${value1Label}, not supported. Did you meant: ${ExperimentalCliConstants.BUY_PRICE}, ${ExperimentalCliConstants.SELL_PRICE}, ${ExperimentalCliConstants.BUY_QUANTITY} or ${ExperimentalCliConstants.SELL_QUANTITY}?`
        );
    }

    switch (value2Label) {
      case ExperimentalCliConstants.BUY_PRICE:
        buyPrice = value2;
        break;
      case ExperimentalCliConstants.SELL_PRICE:
        sellPrice = value2;
        break;
      case ExperimentalCliConstants.BUY_QUANTITY:
        buyQuantity = value2;
        break;
      case ExperimentalCliConstants.SELL_QUANTITY:
        sellQuantity = value2;
        break;
      default:
        throw new ExperimentalError(
          `Value 2 label ${value2Label}, not supported. Did you meant: ${ExperimentalCliConstants.BUY_PRICE}, ${ExperimentalCliConstants.SELL_PRICE}, ${ExperimentalCliConstants.BUY_QUANTITY} or ${ExperimentalCliConstants.SELL_QUANTITY}?`
        );
    }

    if (
      (value1Label === ExperimentalCliConstants.BUY_PRICE &&
        value2Label === ExperimentalCliConstants.SELL_PRICE) ||
      (value2Label === ExperimentalCliConstants.BUY_PRICE &&
        value1Label === ExperimentalCliConstants.SELL_PRICE)
    ) {
      [buyQuantity, sellQuantity] = this.shortGetQuantitiesByPrices(
        buyPrice,
        sellPrice,
        profit,
        priceDecimals,
        quantityDecimals,
        buyFeeReduction,
        feeReduction
      );
    } else if (
      (value1Label === ExperimentalCliConstants.BUY_PRICE &&
        value2Label === ExperimentalCliConstants.BUY_QUANTITY) ||
      (value2Label === ExperimentalCliConstants.BUY_PRICE &&
        value1Label === ExperimentalCliConstants.BUY_QUANTITY)
    ) {
      [sellPrice, sellQuantity] =
        this.shortGetSellPriceSellQuantityByBuyPriceBuyQuantity(
          buyPrice,
          buyQuantity,
          profit,
          priceDecimals,
          quantityDecimals,
          buyFeeReduction,
          sellFeeReduction
        );
    } else if (
      (value1Label === ExperimentalCliConstants.BUY_PRICE &&
        value2Label === ExperimentalCliConstants.SELL_QUANTITY) ||
      (value2Label === ExperimentalCliConstants.BUY_PRICE &&
        value1Label === ExperimentalCliConstants.SELL_QUANTITY)
    ) {
      [sellPrice, buyQuantity] =
        this.shortGetSellPriceBuyQuantityByBuyPriceSellQuantity(
          buyPrice,
          sellQuantity,
          profit,
          priceDecimals,
          quantityDecimals,
          buyFeeReduction,
          sellFeeReduction
        );
    } else if (
      (value1Label === ExperimentalCliConstants.SELL_PRICE &&
        value2Label === ExperimentalCliConstants.BUY_QUANTITY) ||
      (value2Label === ExperimentalCliConstants.SELL_PRICE &&
        value1Label === ExperimentalCliConstants.BUY_QUANTITY)
    ) {
      [buyPrice, sellQuantity] =
        this.shortGetBuyPriceSellQuantityBySellPriceBuyQuantity(
          sellPrice,
          buyQuantity,
          profit,
          priceDecimals,
          quantityDecimals,
          buyFeeReduction,
          sellFeeReduction
        );
    } else if (
      (value1Label === ExperimentalCliConstants.SELL_PRICE &&
        value2Label === ExperimentalCliConstants.SELL_QUANTITY) ||
      (value2Label === ExperimentalCliConstants.SELL_PRICE &&
        value1Label === ExperimentalCliConstants.SELL_QUANTITY)
    ) {
      [buyPrice, buyQuantity] =
        this.shortGetBuyPriceBuyQuantityBySellPriceSellQuantity(
          sellPrice,
          sellQuantity,
          profit,
          priceDecimals,
          quantityDecimals,
          buyFeeReduction,
          sellFeeReduction
        );
    } else {
      throw new ExperimentalError(
        `${value1Label} and ${value2Label} combination is not supported.`
      );
    }

    return [buyPrice, sellPrice, buyQuantity, sellQuantity];
  }

  /**
   * All variables in theses expressions are relative to token1 even profit is in token1, never in token2
   * From expression 1 and 2, resolved to:
   * sellQuantity = (profit * buyPrice) / ((sellPrice * feeReduction) - buyPrice)
   * buyQuantity = (profit + sellQuantity) / buyFeeReduction
   *
   * @param buyPrice
   * @param sellPrice
   * @param profit
   * @param priceDecimals
   * @param quantityDecimals
   * @param buyFeeReduction
   * @param feeReduction
   * @returns
   */
  private shortGetQuantitiesByPrices(
    buyPrice: number,
    sellPrice: number,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    feeReduction: number
  ): [number, number] {
    const roundedSellPrice = this.roundUp(sellPrice, priceDecimals);
    const roundedBuyPrice = this.roundUp(buyPrice, priceDecimals);

    const sellQuantity =
      (profit * roundedBuyPrice) /
      (roundedSellPrice * feeReduction - roundedBuyPrice);

    // Since I'm shorting is best that to sell a little bit more
    // to have more profits
    const roundedSellQuantity = this.roundUp(sellQuantity, quantityDecimals);

    const buyQuantity = (profit + roundedSellQuantity) / buyFeeReduction;

    // Since I'm shorting is best that I round down how much I'm buying
    // Rounding up can cause me to buy more than I should, thus reducing the profit margin
    // even if that means a little bit more will be left in form of token2
    const roundedBuyQuantity = this.roundDown(buyQuantity, quantityDecimals);

    return [roundedBuyQuantity, roundedSellQuantity];
  }

  /**
   * All variables in theses expressions are relative to token1 even profit is in token1, never in token2
   * From expression 1 and 2, resolved to:
   * sellPrice = (buyQuantity * buyPrice) / (sellQuantity * sellFeeReduction);
   * sellQuantity = (buyQuantity * buyFeeReduction) - profit;
   *
   * @param buyPrice
   * @param buyQuantity
   * @param profit
   * @param priceDecimals
   * @param quantityDecimals
   * @param buyFeeReduction
   * @param sellFeeReduction
   * @returns
   */
  private shortGetSellPriceSellQuantityByBuyPriceBuyQuantity(
    buyPrice: number,
    buyQuantity: number,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    sellFeeReduction: number
  ): [number, number] {
    const roundedBuyPrice = this.roundUp(buyPrice, priceDecimals);
    const roundedBuyQuantity = this.roundUp(buyQuantity, quantityDecimals);

    const sellQuantity = roundedBuyQuantity * buyFeeReduction - profit;

    const roundedSellQuantity = this.roundUp(sellQuantity, quantityDecimals);

    const sellPrice =
      (roundedBuyQuantity * roundedBuyPrice) /
      (roundedSellQuantity * sellFeeReduction);

    const roundedSellPrice = this.roundUp(sellPrice, priceDecimals);

    return [roundedSellPrice, roundedSellQuantity];
  }

  /**
   * All variables in theses expressions are relative to token1 even profit is in token1, never in token2
   * From expression 1 and 2, resolved to:
   * sellPrice = (buyQuantity * buyPrice) / (sellQuantity * sellFeeReduction);
   * buyQuantity = (profit + sellQuantity) / buyFeeReduction;
   *
   * @param buyPrice
   * @param sellQuantity
   * @param profit
   * @param priceDecimals
   * @param quantityDecimals
   * @param buyFeeReduction
   * @param sellFeeReduction
   * @returns
   */
  private shortGetSellPriceBuyQuantityByBuyPriceSellQuantity(
    buyPrice: number,
    sellQuantity: number,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    sellFeeReduction: number
  ): [number, number] {
    const roundedBuyPrice = this.roundUp(buyPrice, priceDecimals);
    const roundedSellQuantity = this.roundUp(sellQuantity, quantityDecimals);

    const buyQuantity = (profit + roundedSellQuantity) / buyFeeReduction;

    const roundedBuyQuantity = this.roundUp(buyQuantity, quantityDecimals);

    const sellPrice =
      (roundedBuyQuantity * roundedBuyPrice) /
      (roundedSellQuantity * sellFeeReduction);

    const roundedSellPrice = this.roundUp(sellPrice, priceDecimals);

    return [roundedSellPrice, roundedBuyQuantity];
  }

  /**
   * All variables in theses expressions are relative to token1 even profit is in token1, never in token2
   * From expression 1 and 2, resolved to:
   * buyPrice = (sellQuantity * sellPrice * sellFeeReduction) / buyQuantity;
   * sellQuantity = (buyQuantity * buyFeeReduction) - profit;
   *
   * @param sellPrice
   * @param buyQuantity
   * @param profit
   * @param priceDecimals
   * @param quantityDecimals
   * @param buyFeeReduction
   * @param sellFeeReduction
   * @returns
   */
  private shortGetBuyPriceSellQuantityBySellPriceBuyQuantity(
    sellPrice: number,
    buyQuantity: number,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    sellFeeReduction: number
  ): [number, number] {
    const roundedSellPrice = this.roundUp(sellPrice, priceDecimals);
    const roundedBuyQuantity = this.roundUp(buyQuantity, quantityDecimals);

    const sellQuantity = roundedBuyQuantity * buyFeeReduction - profit;

    const roundedSellQuantity = this.roundUp(sellQuantity, quantityDecimals);

    const buyPrice =
      (roundedSellQuantity * roundedSellPrice * sellFeeReduction) /
      roundedBuyQuantity;

    const roundedBuyPrice = this.roundUp(buyPrice, priceDecimals);

    return [roundedBuyPrice, roundedSellQuantity];
  }

  /**
   * All variables in theses expressions are relative to token1 even profit is in token1, never in token2
   * From expression 1 and 2, resolved to:
   * buyPrice = (sellQuantity * sellPrice * sellFeeReduction) / buyQuantity;
   * buyQuantity = (profit + sellQuantity) / buyFeeReduction;
   *
   * @param sellPrice
   * @param sellQuantity
   * @param profit
   * @param priceDecimals
   * @param quantityDecimals
   * @param buyFeeReduction
   * @param sellFeeReduction
   * @returns
   */
  private shortGetBuyPriceBuyQuantityBySellPriceSellQuantity(
    sellPrice: number,
    sellQuantity: number,
    profit: number,
    priceDecimals: number,
    quantityDecimals: number,
    buyFeeReduction: number,
    sellFeeReduction: number
  ): [number, number] {
    const roundedSellPrice = this.roundUp(sellPrice, priceDecimals);
    const roundedSellQuantity = this.roundUp(sellQuantity, quantityDecimals);

    const buyQuantity = (profit + roundedSellQuantity) / buyFeeReduction;

    const roundedBuyQuantity = this.roundUp(buyQuantity, quantityDecimals);

    const buyPrice =
      (roundedSellQuantity * roundedSellPrice * sellFeeReduction) /
      roundedBuyQuantity;

    const roundedBuyPrice = this.roundUp(buyPrice, priceDecimals);

    return [roundedBuyPrice, roundedBuyQuantity];
  }
}
