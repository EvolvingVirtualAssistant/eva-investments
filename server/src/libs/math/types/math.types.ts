const operators = ['+', '-', '*', '/'] as const;
export interface Operator {
  value: typeof operators[number];
}
export const isStringOperator = (op: any): boolean => operators.includes(op);
export const isOperator = (obj: any): obj is Operator =>
  'type' in obj && obj.type === 'Operator';
export const isMultiplication = (op: Operator): boolean =>
  operators[2] === op.value;
export const isDivision = (op: Operator): boolean => operators[3] === op.value;
export const isAddition = (op: Operator): boolean => operators[0] === op.value;
export const isStringSubtraction = (op: string): boolean => operators[1] === op;
export const isSubtraction = (op: Operator): boolean =>
  operators[1] === op.value;

export interface Variable {
  value: string;
  readonly type: 'Variable';
}

export const isVariable = (obj: any): obj is Variable =>
  'type' in obj && obj.type === 'Variable';

export interface Constant {
  value: number;
  readonly type: 'Constant';
}

export const isConstant = (obj: any): obj is Constant =>
  'type' in obj && obj.type === 'Constant';

// MAY BE A GOOF IDEA TO DELETE THIS; OR USE IT AS BASE INTERFACE TO BE EXTENDED BY VARIABLE AND CONSTANT WHICH WOULD REDUCE THE SIZE OF THE TREES
export interface Term {
  value: Variable | Constant;
  readonly type: 'Term';
}

export const isTerm = (obj: any): obj is Term =>
  'type' in obj && obj.type === 'Term';

export const isTempExpression = (exp: Term | Operator | Expression): boolean =>
  'type' in exp && exp.type === 'Term' && exp.value.value === '#';

export interface Expression {
  values: (Term | Operator | Expression)[];
  readonly type: 'Expression';
}

export const isExpression = (obj: any): obj is Expression =>
  'type' in obj && obj.type === 'Expression';

export interface Equation {
  leftExpression: Expression;
  rightExpression: Expression;
  variables: Set<string>;
}

export interface Dictionary<T> {
  [key: string]: T;
}

export interface LinearMatrixRow {
  equation?: Equation;
  coefficientsAndVariables: [number | string, string][];
  constant: number | string;
}

export interface LinearMatrix {
  rows: LinearMatrixRow[];
  variables: Set<string>;
  constants: Set<string>;
}

export interface LinearMatrixRowUnresolved {
  equation?: Equation;
  coefficientsAndVariables: [Expression, string][];
  constant: Expression;
}

export interface LinearMatrixUnresolved {
  rows: LinearMatrixRowUnresolved[];
  variables: Set<string>;
  constants: Set<string>;
}
