import {
  equationToString,
  expressionToString,
  parseExpression,
} from '../equations/equationParser.ts';
import {
  getConstantBySolvingExpression,
  getSolvedVariables,
  getVariableCoefficients,
  replaceVariablesByConstants,
  solveEquationsWithPreSolvedVars,
  solveExpression,
} from '../equations/equationSolver.ts';
import { gauss } from '../equations/gaussianElimination.ts';
import {
  Dictionary,
  Equation,
  Expression,
  isExpression,
  isTerm,
  isVariable,
  LinearMatrix,
  LinearMatrixRow,
  LinearMatrixRowUnresolved,
  LinearMatrixUnresolved,
  Term,
} from '../types/math.types.ts';
import { deepCopy } from '../utils/deepCopy.ts';

export function combineMatrices(
  equations: LinearMatrixRow[][]
): LinearMatrix[] {
  const matrices = combos(equations, equations.length);

  return matrices;
}

export function combineMatricesUnresolved(
  equations: LinearMatrixRowUnresolved[][]
): LinearMatrixUnresolved[] {
  const matrices = combosUnresolved(equations, equations.length);

  return matrices;
}

// Based off of here https://stackoverflow.com/questions/53311809/all-possible-combinations-of-a-2d-array-in-javascript
function combos(
  equations: LinearMatrixRow[][],
  maxNumOfVars: number,
  n = 0,
  matrices: LinearMatrix[] = [],
  current: LinearMatrix = {
    rows: [],
    variables: new Set<string>(),
    constants: new Set<string>(),
  }
): LinearMatrix[] {
  if (n === equations.length) {
    matrices.push(current);
  } else {
    equations[n].forEach((variation) => {
      const variables = new Set<string>([
        ...current.variables,
        ...variation.coefficientsAndVariables.map((elem) => elem[1]),
      ]);

      const constants = new Set<string>([
        ...current.constants,
        ...(typeof variation.constant === 'string' ? [variation.constant] : []),
        ...variation.coefficientsAndVariables
          .filter((elem) => typeof elem[0] === 'string')
          .map((elem) => elem[0] as string),
      ]);

      if (variables.size <= maxNumOfVars) {
        combos(equations, maxNumOfVars, n + 1, matrices, {
          rows: alignRowsByVariables([...current.rows, variation]),
          variables,
          constants,
        } as LinearMatrix);
      }
    });
  }

  return matrices;
}

// Based off of here https://stackoverflow.com/questions/53311809/all-possible-combinations-of-a-2d-array-in-javascript
function combosUnresolved(
  equations: LinearMatrixRowUnresolved[][],
  maxNumOfVars: number,
  n = 0,
  matrices: LinearMatrixUnresolved[] = [],
  current: LinearMatrixUnresolved = {
    rows: [],
    variables: new Set<string>(),
    constants: new Set<string>(),
  }
): LinearMatrixUnresolved[] {
  if (n === equations.length) {
    matrices.push(current);
  } else {
    equations[n].forEach((variation) => {
      const variables = new Set<string>([
        ...current.variables,
        ...variation.coefficientsAndVariables.map((elem) => elem[1]),
      ]);

      const constants = new Set<string>([
        ...current.constants,
        ...getVariablesFromExpression(variation.constant),
        ...variation.coefficientsAndVariables.flatMap((elem) => [
          ...getVariablesFromExpression(elem[0]),
        ]),
      ]);

      if (variables.size <= maxNumOfVars) {
        combosUnresolved(equations, maxNumOfVars, n + 1, matrices, {
          rows: alignRowsByVariables([...current.rows, variation]),
          variables,
          constants,
        } as LinearMatrixUnresolved);
      }
    });
  }

  return matrices;
}

function alignRowsByVariables(
  rows: LinearMatrixRow[] | LinearMatrixRowUnresolved[]
): LinearMatrixRow[] | LinearMatrixRowUnresolved[] {
  rows.forEach((row) =>
    row.coefficientsAndVariables.sort((cv1, cv2) =>
      cv1[1].localeCompare(cv2[1], 'en')
    )
  );
  return rows;
}

export function solveMatricesConstants(
  matrices: LinearMatrix[],
  inputValues: Equation[]
): LinearMatrix[] {
  const solvedVariables = getSolvedVariables(inputValues);

  const solvedMatrices = matrices.filter((matrix) => {
    let unresolvedConstants = 0;
    matrix.constants.forEach((constant) => {
      const matches = constant.match(/[A-Za-z0-9]*[A-Za-z]+[A-Za-z0-9]*/g);
      if (matches == null) {
        throw new Error(
          'Something is wrong while solving a constant in the matrix'
        );
      }

      if (matches.some((elem) => solvedVariables[0][elem] == null)) {
        unresolvedConstants++;
      }
    });

    return unresolvedConstants === 0;
  });

  solvedMatrices
    .flatMap((matrix) => matrix.rows)
    .forEach((row) => {
      row.coefficientsAndVariables
        .filter((elem) => typeof elem[0] === 'string')
        .forEach((elem) => {
          elem[0] = matrixConstantToNumber(elem[0] as string, solvedVariables);
        });

      if (typeof row.constant === 'string') {
        row.constant = matrixConstantToNumber(
          row.constant as string,
          solvedVariables
        );
      }
    });

  return solvedMatrices;
}

function matrixConstantToNumber(
  constant: string,
  solvedVariables: [Dictionary<number>, number]
): number {
  const expr = parseExpression(constant);
  const varsToSolve = replaceVariablesByConstants(expr, solvedVariables);

  if (varsToSolve > 0) {
    throw new Error(
      `There was an issue replacing variables in expression ${expr}`
    );
  }

  const value = solveExpression(expr);

  if (value === undefined) {
    throw new Error(`There was an issue solving expression ${expr}`);
  }

  return value.value;
}

// Assuming every value is a number already
export function linearMatricesToNumber(matrices: LinearMatrix[]): number[][][] {
  return matrices.map((matrix) => {
    return linearMatrixToNumber(matrix);
  });
}

export function linearMatrixToNumber(matrix: LinearMatrix): number[][] {
  const numbersMatrix: number[][] = [];

  for (let i = 0; i < matrix.rows.length; i++) {
    numbersMatrix.push([
      ...matrix.rows[i].coefficientsAndVariables.map(
        (elem) => elem[0] as number
      ),
      matrix.rows[i].constant as number,
    ]);
  }

  return numbersMatrix;
}

export function matrixUnresolvedToString(
  matrix: LinearMatrixUnresolved
): string {
  return (
    variablesUnresolvedToString(matrix.rows[0]) +
    '\n' +
    matrix.rows.map((row) => rowUnresolvedToString(row)).join('\n')
  );
}

export function matrixToString(matrix: LinearMatrix): string {
  return (
    variablesToString(matrix.rows[0]) +
    '\n' +
    matrix.rows.map((row) => rowToString(row)).join('\n')
  );
}

function variablesUnresolvedToString(row: LinearMatrixRowUnresolved): string {
  return (
    '[' +
    row.coefficientsAndVariables.map((elem) => elem[1]).join(', ') +
    ' |  ]'
  );
}

function variablesToString(row: LinearMatrixRow): string {
  return (
    '[' +
    row.coefficientsAndVariables.map((elem) => elem[1]).join(', ') +
    ' |  ]'
  );
}

function rowUnresolvedToString(row: LinearMatrixRowUnresolved): string {
  return (
    '[' +
    row.coefficientsAndVariables
      .map((elem) => expressionToString(elem[0]))
      .join(', ') +
    ' | ' +
    expressionToString(row.constant) +
    ']'
  );
}

function rowToString(row: LinearMatrixRow): string {
  return (
    '[' +
    row.coefficientsAndVariables.map((elem) => elem[0]).join(', ') +
    ' | ' +
    row.constant +
    ']'
  );
}

// Loop through all possible variable combinations
// e.g., if I have vars [buyP, sellP, buyQ, sellQ, Q2, P1], get all variable combinations from one variable to having all 6 variables at the same time
// and call the function described below for each possible combination

// Function to find variable
// Once variable is found, search for multiplications and divisions associated with that variable
// after fiding both mults and divs, join all (meaning multiply or divide) associated with the same variable
// that will be the coefficient

// For cases like this buyQ*buyP + 0*sellP + 0*buyQ = Q2, where buyQ is both a variable and a coefficient
// we should create two versions of the same row, with buyQ as coefficient and another as a variable

// If you can't find the variable then the coefficient will be 0

// What's on the right or left of the equal must be a constant while the rest
// must not be a constant (meaning if the expressionhas one variable it's not considered constant)

// A row full of 0s can be returned but should be filtered as it's not valid

export function getAugmentedMatrices(
  equations: Equation[][],
  variables: string[]
): LinearMatrixUnresolved[] {
  const matricesRowsByEquation: LinearMatrixRowUnresolved[][] = new Array(
    equations.length
  );

  const variablesCombos: string[][] = getAllVariablesCombinations(
    variables,
    equations.length
  );

  equations.forEach((eqVariations, index) => {
    matricesRowsByEquation[index] = eqVariations.flatMap((eq) =>
      getLinearMatrixRows(eq, variablesCombos)
    );
  });

  return combineMatricesUnresolved(matricesRowsByEquation);
}

function getAllVariablesCombinations(
  variables: string[],
  maxVarsSize: number
): string[][] {
  const range = (size: number) => Array.from(Array(size), (_v, i) => i + 1);

  // filter repeated variables
  const uniqueVars: string[] = [...new Set(variables)];

  // Max number of variables to solve per matrice = maxVarsSize
  return getAllUniqueCombinations(range(maxVarsSize).map((_eq) => uniqueVars));

  // If we want all combination of 1 variable, 2 variables, 3 variables, ..., maxVarsSize variables
  /*return range(maxVarsSize).flatMap((index) =>
    getAllUniqueCombinations(range(index).map((_eq) => uniqueVars))
  );*/
}

// Based off of here https://stackoverflow.com/questions/53311809/all-possible-combinations-of-a-2d-array-in-javascript
function getAllUniqueCombinations(
  list: string[][],
  n = 0,
  result: string[][] = [],
  current: string[] = []
) {
  if (n === list.length) {
    result.push(current);
  } else {
    list[n].forEach((item) => {
      const auxList: string[][] = [];

      for (let i = 0; i < list.length; i++) {
        if (i <= n) {
          auxList[i] = list[i];
        } else {
          // If we filtered only the current item off the list
          // we would ensure no combination would have repeated elements
          // however that would not stop the existence of equal combinations
          // but with elements with different order
          // by excluding all that has already been selected until item
          // we ensure no repeated combos are created
          auxList[i] = list[i].slice(
            list[i].findIndex((elem) => elem === item) + 1
          );
        }
      }

      getAllUniqueCombinations(auxList, n + 1, result, [...current, item]);
    });
  }

  return result;
}

function getLinearMatrixRows(
  equation: Equation,
  variablesCombos: string[][]
): LinearMatrixRowUnresolved[] {
  return variablesCombos
    .map((varCombo) => getLinearMatrixRow(equation, varCombo))
    .filter((row) => row !== undefined) as LinearMatrixRowUnresolved[];
}

function getLinearMatrixRow(
  equation: Equation,
  variables: string[]
): LinearMatrixRowUnresolved | undefined {
  const leftRow = [];
  const rightRow = [];
  let leftCount = 0;
  let rightCount = 0;
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const leftExprCoefficients = getVariableCoefficients(
      equation.leftExpression,
      variable
    );
    const rightExprCoefficients = getVariableCoefficients(
      equation.rightExpression,
      variable
    );

    if (
      leftExprCoefficients !== undefined &&
      rightExprCoefficients !== undefined
    ) {
      // Maybe log this
      // `Same variable ${variable} present on both sides of the equation, which is not supported`
      return undefined;
    }

    const leftCoefficientDependent =
      leftExprCoefficients !== undefined &&
      variables.every(
        (elem) => !expressionContainsVariable(leftExprCoefficients, elem)
      ) === false;

    const rightCoefficientDependent =
      rightExprCoefficients !== undefined &&
      variables.every(
        (elem) => !expressionContainsVariable(rightExprCoefficients, elem)
      ) === false;

    if (leftCoefficientDependent || rightCoefficientDependent) {
      // Maybe log this
      // `Variable ${variable} has as coefficient one of the following variables: ${variables}`
      return undefined;
    }

    if (leftExprCoefficients !== undefined) {
      leftCount++;
    }

    if (rightExprCoefficients !== undefined) {
      rightCount++;
    }

    leftRow.push(leftExprCoefficients);
    rightRow.push(rightExprCoefficients);
  }

  let resRow: LinearMatrixRowUnresolved | undefined = undefined;
  if (leftCount === 0 && rightCount !== 0) {
    // Left is the constant
    resRow = {
      coefficientsAndVariables: rightRow.map((elem, index) => [
        elem !== undefined ? elem : getConstantExpression(0),
        variables[index],
      ]),
      constant: equation.leftExpression,
      equation,
    };

    if (!rowHasAllExpressionVariables(equation.rightExpression, resRow)) {
      return undefined;
    }
  } else if (leftCount !== 0 && rightCount === 0) {
    // Right is the constant
    resRow = {
      coefficientsAndVariables: leftRow.map((elem, index) => [
        elem !== undefined ? elem : getConstantExpression(0),
        variables[index],
      ]),
      constant: equation.rightExpression,
      equation,
    };

    if (!rowHasAllExpressionVariables(equation.leftExpression, resRow)) {
      return undefined;
    }
  }

  // leftCount === 0 && rightCount === 0 is an nvalid row, since it is in the form 0 = 0,
  // which means dependent solutions (resulting in infinite solutions for the matrix)
  return resRow;
}

function rowHasAllExpressionVariables(
  expression: Expression,
  row: LinearMatrixRowUnresolved
): boolean {
  // All expression variables, should have been captured by being either a variable or a coefficient in the row
  // if it doesn't fit neiter of the cases, it's because the equation would need to be further simlified to be
  // used as a linear matrix (taking into consideration the combo of variables chosen, for other combos this may not be true)
  return [...getVariablesFromExpression(expression)].every((variable) =>
    row.coefficientsAndVariables
      .flatMap((elem) => [...getVariablesFromExpression(elem[0]), elem[1]])
      .some((elem) => elem === variable)
  );
}

function getConstantExpression(value: number): Expression {
  return {
    values: [{ value: { value, type: 'Constant' }, type: 'Term' } as Term],
    type: 'Expression',
  } as Expression;
}

function expressionContainsVariable(
  expr: Expression,
  variable: string
): boolean {
  return expr.values.some((elem) => {
    if (isExpression(elem)) {
      return expressionContainsVariable(elem, variable);
    }

    return (
      isTerm(elem) && isVariable(elem.value) && elem.value.value === variable
    );
  });
}

function getVariablesFromExpression(expr: Expression): Set<string> {
  const res = new Set<string>();
  expr.values.forEach((elem) => {
    if (isExpression(elem)) {
      [...getVariablesFromExpression(elem)].forEach((variable) =>
        res.add(variable)
      );
    }

    if (isTerm(elem) && isVariable(elem.value)) {
      res.add(elem.value.value);
    }
  });

  return res;
}

export function solveMatricesUnresolved(
  unresolvedMatrices: LinearMatrixUnresolved[],
  inputValues: Equation[]
): LinearMatrix[] {
  let solvedVariables = getSolvedVariables(deepCopy(inputValues));

  // First select all the matrices that have constants (variables) that can be replaced by the solvedVariables
  return unresolvedMatrices
    .filter((matrix) =>
      [...matrix.constants].every(
        (constant) => solvedVariables[0][constant] != null
      )
    )
    .map((matrix) => {
      // CAHNGE THIS TO A FOR LOOP
      const rows = matrix.rows
        .map((row) => {
          const constant = getConstantBySolvingExpression(
            row.constant,
            solvedVariables
          );
          if (constant === undefined) {
            return undefined;
          }

          // CAHNGE THIS TO A FOR LOOP
          const coefficientsAndVariables = row.coefficientsAndVariables
            .map((elem) => {
              const coef = getConstantBySolvingExpression(
                elem[0],
                solvedVariables
              );
              if (coef === undefined) {
                return undefined;
              }

              return [coef.value, elem[1]];
            })
            .filter((elem) => elem !== undefined) as [
            number | string,
            string
          ][];

          if (
            coefficientsAndVariables.length !==
            row.coefficientsAndVariables.length
          ) {
            return undefined;
          }

          return {
            equation: row.equation,
            coefficientsAndVariables,
            constant: constant.value,
          } as LinearMatrixRow;
        })
        .filter((row) => row !== undefined);

      if (rows.length !== matrix.rows.length) {
        return undefined;
      }

      return {
        rows,
        variables: matrix.variables,
        constants: matrix.constants,
      } as LinearMatrix;
    })
    .filter((matrix) => matrix !== undefined) as LinearMatrix[];
}

export function solveLinearMatrices(
  linearMatrices: LinearMatrix[],
  inputValues: Equation[],
  variables: string[],
  postMatrixSolvedEquations: Equation[]
): Dictionary<number>[] {
  const solvedVariables = getSolvedVariables(deepCopy(inputValues));

  return linearMatrices
    .map((matrix) => {
      const numberMatrix = linearMatrixToNumber(matrix);
      const matrixVarsSolved = gauss(numberMatrix);

      if (!matrixVarsSolved.every((val) => isFinite(val))) {
        return undefined;
      }

      let auxSolvedVars = deepCopy(solvedVariables);

      // Add vars to solved variables
      for (let i = 0; i < matrix.rows[0].coefficientsAndVariables.length; i++) {
        const key = matrix.rows[0].coefficientsAndVariables[i][1];

        if (auxSolvedVars[0][key] == null) {
          auxSolvedVars[0][key] = matrixVarsSolved[i];
          auxSolvedVars[1] = auxSolvedVars[1] + 1;
        }
      }

      // If every variable is already calculated we can exit
      //if (variables.every((val) => auxSolvedVars[0][val] != null)) {
      //  return auxSolvedVars[0];
      //} Comment out as the post solved equations have variables that we will need
      // once we are validating if the solution is valid for all existent equations

      auxSolvedVars[0] = solveEquationsWithPreSolvedVars(
        postMatrixSolvedEquations,
        auxSolvedVars
      )[1];

      // If every variable is already calculated then this matrix was good enough to solve the system
      if (variables.every((val) => auxSolvedVars[0][val] != null)) {
        return auxSolvedVars[0];
      }

      return undefined;
    })
    .filter((elem) => elem !== undefined) as Dictionary<number>[];
}
