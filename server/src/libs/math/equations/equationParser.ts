import { EquationConstants } from './../constants/mathConstants.ts';
import { EquationError } from './../errors/equationError.ts';
import {
  Constant,
  Equation,
  Expression,
  isStringSubtraction,
  isStringOperator,
  isTempExpression,
  Operator,
  Term,
  Variable,
  isExpression,
  isTerm,
  isVariable,
} from './../types/math.types.ts';

export function parseEquation(equation: string): Equation {
  if (equation.trim() === '') {
    throw new EquationError(EquationConstants.INVALID_EQUATION_FORMAT);
  }

  const exprs = equation.split('=');

  if (exprs.length != 2) {
    throw new EquationError(EquationConstants.INVALID_EQUATION_FORMAT);
  }

  const [leftExpression, variables] = getExpression(exprs[0]);
  const [rightExpression, rightVariables] = getExpression(exprs[1]);

  rightVariables.forEach((variable) => {
    if (!variables.has(variable)) {
      variables.add(variable);
    }
  });

  return {
    leftExpression,
    rightExpression,
    variables,
  };
}

export function parseExpression(expression: string): Expression {
  if (expression.trim() === '') {
    throw new EquationError('Expression is empty');
  }

  const expr: Expression = parseExpressionWithParentheses(
    [],
    { expr: expression.substring(0) },
    0,
    new Set<string>()
  );

  return expr;
}

function getExpression(expression: string): [Expression, Set<string>] {
  if (expression.trim() === '') {
    throw new EquationError(EquationConstants.EQUATION_EXPRESSION_EMPTY);
  }

  const variables: Set<string> = new Set<string>();
  const expr: Expression = parseExpressionWithParentheses(
    [],
    { expr: expression.substring(0) },
    0,
    variables
  );

  return [expr, variables];
}

function parseExpressionWithParentheses(
  brackets: [number, string][],
  exprWrap: { expr: string },
  expressionIndex: number,
  variables: Set<string>
): Expression {
  let exprTreeLayer: (Term | Operator | Expression)[] = [];

  let i = expressionIndex;
  for (; i < exprWrap.expr.length; i++) {
    if (exprWrap.expr[i] === '(') {
      brackets.push([i, exprWrap.expr[i]]);
      exprTreeLayer.push(
        parseExpressionWithParentheses(brackets, exprWrap, i + 1, variables)
      );
    } else if (exprWrap.expr[i] === ')') {
      if (brackets[brackets.length - 1][1] === '(') {
        const brk: [number, string] = brackets.pop() || [-1, '']; // This will crash this code if someone accesses -1

        const matches = getTermsAndOperators(exprWrap.expr, brk[0] + 1, i);
        const elements = buildExpression(matches, variables);
        replaceTempExpressionsByExpressions(elements, exprTreeLayer);

        exprTreeLayer = elements;
        exprWrap.expr =
          exprWrap.expr.substring(0, brk[0]) +
          '#' +
          exprWrap.expr.substring(i + 1, exprWrap.expr.length);
        return { values: exprTreeLayer, type: 'Expression' };
      } else {
        throw new Error('Unmatching number of bracketss');
      }
    }
  }

  if (brackets.length > 0) {
    throw new Error('Unmatching number of brackets');
  }

  const matches = getTermsAndOperators(exprWrap.expr, 0, exprWrap.expr.length);
  const elements = buildExpression(matches, variables);
  replaceTempExpressionsByExpressions(elements, exprTreeLayer);

  return { values: elements, type: 'Expression' };
}

function replaceTempExpressionsByExpressions(
  source: (Term | Operator | Expression)[],
  replacements: (Term | Operator | Expression)[]
): void {
  for (let i = 0, j = 0; i < source.length; i++) {
    if (isTempExpression(source[i])) {
      source[i] = replacements[j];
      j++;
    }
  }
}

function getTermsAndOperators(
  expr: string,
  start: number,
  end: number
): RegExpMatchArray {
  const matches = expr
    .substring(start, end)
    .match(
      /\+|\-|\*|\/|#|[A-Za-z0-9]*[A-Za-z]+[A-Za-z0-9]*|[0-9]+(\.[0-9]+)*/g
    );
  if (matches == null) {
    throw new Error('');
  }
  return matches;
}

function buildExpression(
  matches: RegExpMatchArray,
  variables: Set<string>
): (Term | Operator | Expression)[] {
  const exprTreeLayer: (Term | Operator | Expression)[] = [];

  for (let j = 0; j < matches.length; j++) {
    // expression sanity
    if (isStringOperator(matches[j])) {
      if (j === matches.length - 1) {
        throw new Error(`Expression cannot end with: ${matches[j]}`);
      } else if (j === 0 && !isStringSubtraction(matches[j])) {
        throw new Error(`Expression cannot start with operator: ${matches[j]}`);
      } else if (j > 0 && isStringOperator(matches[j - 1])) {
        throw new Error(
          `Expression cannot have two consecutive operators: ${matches[j - 1]}${
            matches[j]
          }`
        );
      }

      exprTreeLayer.push({ value: matches[j], type: 'Operator' } as Operator);
    } else if (matches[j] === '#') {
      exprTreeLayer.push({
        value: { value: matches[j], type: 'Variable' } as Variable,
        type: 'Term',
      } as Term);
    } else {
      if (j > 0 && !isStringOperator(matches[j - 1])) {
        throw new Error(
          `Expression cannot have two consecutive terms: ${matches[j - 1]}${
            matches[j]
          }`
        );
      }

      if (!isNaN(Number(matches[j]))) {
        exprTreeLayer.push({
          value: { value: Number(matches[j]), type: 'Constant' } as Constant,
          type: 'Term',
        } as Term);
      } else {
        exprTreeLayer.push({
          value: { value: matches[j], type: 'Variable' } as Variable,
          type: 'Term',
        } as Term);
        variables.add(matches[j]);
      }
    }
  }

  return exprTreeLayer;
}

export function equationToString(
  equation: Equation,
  invertSides: boolean
): string {
  return invertSides
    ? `${expressionToString(equation.rightExpression)}=${expressionToString(
        equation.leftExpression
      )}`
    : `${expressionToString(equation.leftExpression)}=${expressionToString(
        equation.rightExpression
      )}`;
}

export function expressionToString(expression: Expression): string {
  return expression.values
    .map((elem) => {
      if (isExpression(elem)) {
        return `(${expressionToString(elem)})`;
      } else if (isTerm(elem)) {
        return termToString(elem);
      }

      return operatorToString(elem as Operator);
    })
    .join('');
}

function termToString(term: Term): string {
  return term.value.value + '';
}

function operatorToString(op: Operator): string {
  return op.value;
}
