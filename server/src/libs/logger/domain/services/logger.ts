import { WorkerPool } from '../../deps';
import {
  DEFAULT_LOG_GROUP,
  DEFAULT_OUTPUT_TYPE,
  Dictionary,
  Logger,
  LoggerLevel,
  LoggerOptions
} from '../../types/logger.types';

let _workerPool: WorkerPool;
const _loggers: Dictionary<Logger> = {};

export const wrapWithLogger = (
  options: LoggerOptions,
  fn: (...args: any[]) => any,
  ...args: any[]
) => {
  if (_workerPool == null) {
    _workerPool = new WorkerPool(
      1,
      './src/libs/logger/domain/services/logHandler.ts'
    );
  }

  const { id = generateId() } = options;
  let targetLogger = _loggers[id];
  if (targetLogger == null) {
    targetLogger = {
      logGroups: options.logGroups,
      outputTypes: options.outputTypes
    };
    _loggers[id] = targetLogger;
  }

  const optLogGroups =
    options.logGroups.length === 0 ? [DEFAULT_LOG_GROUP] : options.logGroups;
  const optOutputTypes =
    options.outputTypes.length === 0
      ? [DEFAULT_OUTPUT_TYPE]
      : options.outputTypes;

  targetLogger.logGroups.push(
    ...optLogGroups.filter((group) => !targetLogger.logGroups.includes(group))
  );
  targetLogger.outputTypes.push(
    ...optOutputTypes.filter((out) => !targetLogger.outputTypes.includes(out))
  );

  const logger: { [x: string]: any } = {};
  logger[id] = () => {
    fn(...args);
  };
  logger[id]();
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
    throw new Error(
      'wrapWithLogger has not been called yet. wrapWithLogger must always be called before calling log.'
    );
  }

  const e: { [x: string]: any } = {};
  Error.captureStackTrace(e);

  _workerPool.runTask(workerDoneCallback, level, [
    _loggers,
    e.stack,
    Date.now(),
    message,
    optionalParams
  ]);
};

const workerDoneCallback = (result: any, error: any) => {
  return;
};
