import { CliConstants } from '../constants/cliConstants';

export function getCurrentPath() {
  const myError = new Error();
  const trace = myError?.stack?.split('\n');
  const lastLine = trace?.[trace.length - 1] || '';

  return lastLine.substring(
    lastLine.indexOf('/') + 1,
    lastLine.search(CliConstants.REGEX_COLON_DIGITS)
  );
}
