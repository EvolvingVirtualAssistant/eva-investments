import {
  LOG_ID_REGEX,
  LOG_WRAP_FUNCTION_END,
  LOG_WRAP_FUNCTION_START
} from '../../constants/loggerConstants';
import { GENERIC_WORKER_FILE_PATH, WorkerPool } from '../../deps';
import {
  DEFAULT_LOG_GROUP,
  DEFAULT_OUTPUT_TYPE,
  Dictionary,
  Logger,
  LoggerLevel,
  LoggerOptions,
  LoggerOutputType,
  LOGGER_WORKER_HANDLER_FILE_PATH
} from '../../types/logger.types';

let _workerPool: WorkerPool;
const _loggers: Dictionary<Logger> = {};

// shows how the stacks can be customized and how the function names are displayed:
// https://v8.dev/docs/stack-trace-api#customizing-stack-traces

export const wrapWithLogger = <T>(
  fn: (...args: any[]) => T,
  options: LoggerOptions = {
    logGroups: [],
    outputTypes: [],
    isAsyncFn: false
  }
): ((...args: any[]) => T) => {
  if (_workerPool == null) {
    _workerPool = WorkerPool.getInstance();
    _workerPool.addWorker(GENERIC_WORKER_FILE_PATH);
  }

  const id = getId(options.id);
  let targetLogger = _loggers[id];
  let optLogGroups: string[] = [];
  let optOutputTypes: LoggerOutputType[] = [];
  if (targetLogger == null) {
    targetLogger = {
      logGroups: options.logGroups || [],
      outputTypes: options.outputTypes || []
    };
    _loggers[id] = targetLogger;

    optLogGroups =
      options.logGroups == null || options.logGroups.length === 0
        ? [DEFAULT_LOG_GROUP]
        : options.logGroups;
    optOutputTypes =
      options.outputTypes == null || options.outputTypes.length === 0
        ? [DEFAULT_OUTPUT_TYPE]
        : options.outputTypes;
  } else {
    // Inherit the logGroups and outputTypes previsously defined for this id
    optLogGroups =
      options.logGroups == null || options.logGroups.length === 0
        ? []
        : options.logGroups;
    optOutputTypes =
      options.outputTypes == null || options.outputTypes.length === 0
        ? []
        : options.outputTypes;
  }

  targetLogger.logGroups.push(
    ...optLogGroups.filter((group) => !targetLogger.logGroups.includes(group))
  );
  targetLogger.outputTypes.push(
    ...optOutputTypes.filter((out) => !targetLogger.outputTypes.includes(out))
  );

  const prefixSuffixId = `${LOG_WRAP_FUNCTION_START}${id}${LOG_WRAP_FUNCTION_END}`;
  const f = {
    [prefixSuffixId]: function (...args: any[]) {
      return fn(...args);
    }
  }[prefixSuffixId];
  const fAsync = {
    [prefixSuffixId]: async function (...args: any[]) {
      return await fn(...args);
    }
  }[prefixSuffixId];
  // This is a kinda shady cast tbh, but should work for now
  return options.isAsyncFn ? (fAsync as unknown as (...args: any[]) => T) : f;
};

const getId = (id?: string): string => {
  if (id != null) {
    return id;
  }

  const e: { [x: string]: any } = {};
  Error.captureStackTrace(e);

  // Try to get id from context (from an error stack)
  // Fallback to generate a new id
  return getParentLogId(e.stack) || generateId();
};

const getParentLogId = (stack: string): string | null => {
  const lines = stack.split('\n');

  const ids: string[] = [];
  lines.reverse().forEach((line) => {
    if (!LOG_ID_REGEX.test(line)) {
      return;
    }

    const matches = line.match(LOG_ID_REGEX);
    if (matches == null || matches.length != 2) {
      throw new Error(`Unable to find log id in stack: ${stack}`);
    }

    if (!ids.includes(matches[1])) {
      ids.push(matches[1]);
    }
  });

  return ids.length > 0 ? ids[ids.length - 1] : null;
};

const charset =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

const generateId = (): string => {
  const charsetLength = charset.length;
  const length = 10;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  }

  return result;
};

export const logInfo = (message?: any, ...optionalParams: any[]) =>
  log(LoggerLevel.INFO, message, ...optionalParams);
export const logDebug = (message?: any, ...optionalParams: any[]) =>
  log(LoggerLevel.DEBUG, message, ...optionalParams);
export const logWarn = (message?: any, ...optionalParams: any[]) =>
  log(LoggerLevel.WARNING, message, ...optionalParams);
export const logError = (message?: any, ...optionalParams: any[]) =>
  log(LoggerLevel.ERROR, message, ...optionalParams);

const log = (level: LoggerLevel, message?: any, ...optionalParams: any[]) => {
  if (_workerPool == null) {
    _workerPool = WorkerPool.getInstance();
    _workerPool.addWorker(GENERIC_WORKER_FILE_PATH);
  }

  const e: { [x: string]: any } = {};
  Error.captureStackTrace(e);

  _workerPool.runTask(
    LOGGER_WORKER_HANDLER_FILE_PATH,
    workerDoneCallback,
    level,
    [_loggers, e.stack, Date.now(), message, optionalParams]
  );
};

const workerDoneCallback = (result: any, error: any) => {
  return;
};
