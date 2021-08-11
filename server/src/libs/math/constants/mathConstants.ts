export const EquationConstants = {
  INVALID_EQUATION_FORMAT:
    'An equation must contain a left side expression equaling a right side expression (e.g., x = 2)',
  EQUATION_EXPRESSION_EMPTY:
    'A left or rigt side of an expression must always contain a term',
} as const;

// deno-lint-ignore no-explicit-any
function taggedTemplate(strings: TemplateStringsArray, ..._keys: any[]) {
  // deno-lint-ignore no-explicit-any
  return function (...values: any[]) {
    return strings.map((elem, i) => `${elem}${values[i] || ''}`).join('');
  };
}
