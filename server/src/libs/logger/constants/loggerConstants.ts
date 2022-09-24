export const LOG_WRAP_FUNCTION_START = 'loggerWrapFunctionStart_';
export const LOG_WRAP_FUNCTION_END = '_loggerWrapFunctionEnd';
export const LOG_ID_REGEX = new RegExp(
  '.*' + LOG_WRAP_FUNCTION_START + '(.*)' + LOG_WRAP_FUNCTION_END
);
export const LOG_ID_SEPARATOR = ' > ';
export const LOG_MSG_SEPARATOR = ' ';
