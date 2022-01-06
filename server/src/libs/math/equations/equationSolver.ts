import {
  Equation,
  Dictionary,
  Expression,
  isTerm,
  isVariable,
  isExpression,
  Term,
  Constant,
  isConstant,
  isOperator,
  isMultiplication,
  isDivision,
  isAddition,
  isSubtraction,
  Operator,
  Variable
} from './../types/math.types';
import { equationToString } from './equationParser';
import { deepCopy } from './../utils/deepCopy';

// Consider this in case of issues with roundings
//import Big from 'https://raw.githubusercontent.com/mikemcl/big.js/v6.0.0/big.mjs';
//import Big from 'https://unpkg.com/big.js@6.0.0/big.mjs';

export function solveEquations(
  equations: Equation[],
  inputValues: Equation[]
): [Equation[], Dictionary<number>] {
  let solvedVariables = getSolvedVariables(deepCopy(inputValues));
  return solveEquationsWithPreSolvedVars(equations, solvedVariables);
}

export function solveEquationsWithPreSolvedVars(
  equations: Equation[],
  solvedVariables: [Dictionary<number>, number]
): [Equation[], Dictionary<number>] {
  let lastNumSolvedVariables = 0;

  const eqs = deepCopy(equations);
  const solvedEquations: Equation[] = [];
  let tempEquations: Equation[] = [];

  do {
    lastNumSolvedVariables = solvedVariables[1];
    for (let i = 0; i < eqs.length; i++) {
      tempEquations = solveEquation(eqs[i], solvedVariables);

      if (tempEquations.length > 0) {
        solvedEquations.push(...tempEquations);
        eqs.splice(i, 1);
        i--;
      }
    }
  } while (lastNumSolvedVariables < solvedVariables[1]);

  return [solvedEquations, solvedVariables[0]];
}

// TRY A BRUTE FORCE METHOD OF SUBSTITUTION:
// - all equations with a variable on one of the sides
// - then start creating new equations be replacing variables by expressions
// - if the left side and right side contain the same variable, do not create the equation
// - else create it
// CREATE THIS AS FUNCTION TO BE CALLED AS THE FIRST STEP IN SOLVEEQUATIONS
// Stored on each equation the indexes of the equations that formed this one, this way we avoid replacing
// by equations that were already replaced in this current equation
function getAllEquationsCombinations(equations: Equation[]): Equation[] {
  return [];
}

export function getSolvedVariables(
  inputValues: Equation[]
): [Dictionary<number>, number] {
  const solvedVariables: [Dictionary<number>, number] = [{}, 0];

  inputValues.forEach((eq) => {
    if (solveEquation(eq, solvedVariables).length === 0) {
      throw new Error(
        `Input equation must be have a variable on one of the sides and a constant on the other side, which is not the case for ${equationToString(
          eq,
          false
        )}`
      );
    }
  });

  return solvedVariables;
}

function solveEquation(
  equation: Equation,
  solvedVariables: [Dictionary<number>, number]
): Equation[] {
  const solvedEquations: Equation[] = [];

  const rightSide = solveEquationInOrderToSide1(
    equation.leftExpression,
    equation.rightExpression,
    solvedVariables
  );
  const leftSide = solveEquationInOrderToSide1(
    equation.rightExpression,
    equation.leftExpression,
    solvedVariables
  );

  if (rightSide !== undefined) {
    const eq = deepCopy(equation);
    eq.rightExpression.values = [rightSide];
    solvedEquations.push(eq);
  }

  if (leftSide !== undefined) {
    const eq = deepCopy(equation);
    eq.leftExpression.values = [leftSide];
    solvedEquations.push(eq);
  }

  return solvedEquations;
}

function solveEquationInOrderToSide1(
  side1Expression: Expression,
  side2Expression: Expression,
  solvedVariables: [Dictionary<number>, number]
): Term | undefined {
  const leftVariable = getSingleVariable(side1Expression);

  if (leftVariable !== undefined) {
    // This will output an equation (ideally if it gets solved)

    const numVarsToSolve = replaceVariablesByConstants(
      side2Expression,
      solvedVariables
    );

    if (numVarsToSolve === 0) {
      // Solve it and add the result to solvedVariables
      const rightConstant = solveExpression(deepCopy(side2Expression));

      if (rightConstant !== undefined) {
        tryToAddSolvedVariable(
          solvedVariables,
          leftVariable,
          rightConstant.value
        );

        return { value: rightConstant, type: 'Term' };
      }
    }
  }

  return undefined;
}

export function solveExpression(expression: Expression): Constant | undefined {
  // Priority:
  // - Parentheses == Expressions
  // - Exponent -> Not currently supported
  // - Multiplication and Division == Operators * and / (Priority between both, left to right)
  // - Addition and Subtraction == Operators * and / (Priority between both, left to right)

  try {
    solveByOperators(expression, isMultiplication, isDivision);
    solveByOperators(expression, isAddition, isSubtraction);
  } catch (_err) {
    // log this perhaps
    return undefined;
  }

  return expression.values.length === 1 &&
    isTerm(expression.values[0]) &&
    isConstant((expression.values[0] as Term).value)
    ? ((expression.values[0] as Term).value as Constant)
    : undefined;
}

function solveByOperators(
  expression: Expression,
  ...operatorPredicates: ((op: any) => boolean)[]
): void {
  let operatorsIndexes: number[] = [];
  do {
    operatorsIndexes = expression.values
      .map((elem, index) => [elem, index])
      .filter(
        (elem) =>
          isOperator(elem[0]) &&
          operatorPredicates.some((predicate) => predicate(elem[0]))
      )
      .map((elem) => elem[1] as number)
      .sort();

    // expression begining with an operator (can only be a minus the operator)
    if (operatorsIndexes.length === 1 && operatorsIndexes[0] === 0) {
      const index = operatorsIndexes[0];
      const rightConstant = getConstant(expression.values[index + 1]);

      if (rightConstant === undefined) {
        throw new Error('Error calculating expression with preceding operator');
      }

      expression.values[index] = calculate(
        {
          value: isSubtraction(expression.values[index] as Operator) ? -1 : 1,
          type: 'Constant'
        },
        rightConstant,
        { value: '*' }
      );

      expression.values.splice(index + 1, 1);
      operatorsIndexes.splice(0, 1);
    }

    for (let i = 0; i < operatorsIndexes.length; i++) {
      // every past operation transformed 3 positions in expression.values to 1
      // e.g., 1 * 2 -> 2 _ _
      const index = operatorsIndexes[i] - i * 2;

      const leftConstant = getConstant(expression.values[index - 1]);
      const rightConstant = getConstant(expression.values[index + 1]);

      if (leftConstant === undefined || rightConstant === undefined) {
        throw new Error(
          `Error calculating ${leftConstant?.value} ${
            (expression.values[index] as Operator).value
          } ${
            rightConstant?.value
          } , as all elements in the expression should be constants`
        );
      }

      expression.values[index - 1] = calculate(
        leftConstant,
        rightConstant,
        expression.values[index] as Operator
      );

      expression.values.splice(index, 2);
    }
  } while (operatorsIndexes.length > 0);
}

function calculate(
  leftConstant: Constant,
  rightConstant: Constant,
  operator: Operator
): Term {
  if (isDivision(operator)) {
    return {
      value: {
        value: leftConstant.value / rightConstant.value,
        type: 'Constant'
      },
      type: 'Term'
    };
  } else if (isMultiplication(operator)) {
    return {
      value: {
        value: leftConstant.value * rightConstant.value,
        type: 'Constant'
      },
      type: 'Term'
    };
  } else if (isAddition(operator)) {
    return {
      value: {
        value: leftConstant.value + rightConstant.value,
        type: 'Constant'
      },
      type: 'Term'
    };
  }

  return {
    value: {
      value: leftConstant.value - rightConstant.value,
      type: 'Constant'
    },
    type: 'Term'
  };
}

function getConstant(elem: Expression | Term | Operator): Constant | undefined {
  if (isExpression(elem)) {
    return solveExpression(elem as Expression);
  } else if (isTerm(elem) && isConstant((elem as Term).value)) {
    return (elem as Term).value as Constant;
  } else {
    return undefined;
  }
}

function tryToAddSolvedVariable(
  solvedVariables: [Dictionary<number>, number],
  variable: string,
  value: number
): void {
  if (solvedVariables[0][variable] == null) {
    solvedVariables[0][variable] = value;
    solvedVariables[1]++;
  } else if (
    solvedVariables[0][variable] != null &&
    !similarValue(solvedVariables[0][variable], value)
  ) {
    throw new Error(
      `Variable ${variable} has more than one possible value: ${solvedVariables[0][variable]} ; ${value}`
    );
  }
}

// TODO Improve rounding mechanism
function similarValue(val1: number, val2: number): boolean {
  return Math.abs(val1 - val2) < 1;
}

function getSingleVariable(expr: Expression): string | undefined {
  if (
    expr.values.length === 1 &&
    isTerm(expr.values[0]) &&
    isVariable(expr.values[0].value)
  ) {
    return expr.values[0].value.value;
  }

  return undefined;
}

// I MAY WANT TO CONSIDER COMPUTING THE ALL THE CONSTANTS IN THIS METHOD TO END UP WITH ONE number IN THE END, WHEN POSSIBLE
// BASICALLY JUST SIMPLIFY THE FUNCTION IF POSSIBLE
// A GOOD THING OF THIS IS I'M NOT FORCED TO CMPUTE THINGS NOW, THUS NOT STARTING TO ROUND VALUES RIGHT AT THIS POINT,
// WHICH WILL INCREASE THE PRECISION OF THE RESULTS (AND EVEN IF IN THE FUTURE I MAY WANT TO NOT ROUND ANYTHING, OR JUST ROUND IN THE END)
export function replaceVariablesByConstants(
  expression: Expression,
  solvedVariables: [Dictionary<number>, number]
): number {
  let variablesToSolve = 0;
  for (let i = 0; i < expression.values.length; i++) {
    if (isExpression(expression.values[i])) {
      variablesToSolve += replaceVariablesByConstants(
        expression.values[i] as Expression,
        solvedVariables
      );
    } else if (
      isTerm(expression.values[i]) &&
      isVariable((expression.values[i] as Term).value)
    ) {
      const value: number =
        solvedVariables[0][(expression.values[i] as Term).value.value];
      if (value != null) {
        (expression.values[i] as Term).value = {
          value,
          type: 'Constant'
        } as Constant;
      } else {
        variablesToSolve++;
      }
    }
  }

  return variablesToSolve;
}

export function getVariableCoefficients(
  expression: Expression,
  variable: string
): Expression | undefined {
  var resExpr: Expression | undefined = undefined;

  for (let i = 0; i < expression.values.length; i++) {
    if (isExpression(expression.values[i])) {
      const innerCoefficients = getVariableCoefficients(
        expression.values[i] as Expression,
        variable
      );

      if (innerCoefficients != null) {
        // search left and right for mult/div
        const coefficients = getCoefficients(expression, i, innerCoefficients);

        // after finding add it to resExpr (as there can me more than one occurence of the variable)
        if (resExpr === undefined) {
          resExpr = coefficients;
        } else {
          resExpr.values.push({ value: '+' } as Operator);
          resExpr.values.push(coefficients);
        }
      }
    } else if (
      isTerm(expression.values[i]) &&
      isVariable((expression.values[i] as Term).value) &&
      ((expression.values[i] as Term).value as Variable).value === variable &&
      !(
        i > 0 &&
        isOperator(expression.values[i - 1]) &&
        isDivision(expression.values[i - 1] as Operator)
      ) // If the left operator is not a division (i.e., 1 + 2/variable, since the variable here would be in the form 1 + 2 * (1/variable or variableInv instead))
    ) {
      // search left and right for mult/div
      const coefficients = getCoefficients(expression, i);

      // after finding add it to resExpr (as there can me more than one occurence of the variable)
      if (resExpr === undefined) {
        resExpr = coefficients;
      } else {
        resExpr.values.push({ value: '+' } as Operator);
        resExpr.values.push(coefficients);
      }
    }
  }

  return resExpr;
}

function getCoefficients(
  expression: Expression,
  variableIndex: number,
  variableDefaultCoefficient: Term | Expression = {
    value: { value: 1, type: 'Constant' } as Constant,
    type: 'Term'
  } as Term
): Expression {
  // Initialize coefficients with 1 (if no coefficients are found to the right or left, or even if they are,
  // we replace the variable by 1 helping with joining the left side with the right side coefficients)
  // In case the variable was actually inside an nested expression, than it is likely that the default value
  // is itself an expression of coefficients, that will be "bubbled up"
  const coefficients: Expression = {
    values: [variableDefaultCoefficient],
    type: 'Expression'
  };

  // Search to the right
  for (let i = variableIndex + 1; i < expression.values.length; i++) {
    if (
      isOperator(expression.values[i]) &&
      (isAddition(expression.values[i] as Operator) ||
        isSubtraction(expression.values[i] as Operator))
    ) {
      // if it is a plus or minus, than the coefficient to the right has already been entirely captured
      i = expression.values.length;
    } else {
      coefficients.values.push(expression.values[i]);
    }
  }

  // Search to the left
  for (let i = variableIndex - 1; i >= 0; i--) {
    if (
      isOperator(expression.values[i]) &&
      (isAddition(expression.values[i] as Operator) ||
        isSubtraction(expression.values[i] as Operator))
    ) {
      if (isSubtraction(expression.values[i] as Operator)) {
        // if it is a minus, we still add the minus to the expression
        coefficients.values.unshift(expression.values[i]);
      }
      // if it is a plus or minus, than the coefficient to the left has already been entirely captured
      i = 0;
    } else {
      coefficients.values.unshift(expression.values[i]);
    }
  }

  return coefficients;
}

export function getConstantBySolvingExpression(
  expression: Expression,
  solvedVariables: [Dictionary<number>, number]
): Constant | undefined {
  if (replaceVariablesByConstants(expression, solvedVariables) === 0) {
    return solveExpression(deepCopy(expression));
  }
  return undefined;
}
