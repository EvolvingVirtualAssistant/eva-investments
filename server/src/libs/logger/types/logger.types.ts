export interface Dictionary<T> {
  [key: string]: T;
}

export type LoggerOptions = {
  logGroups?: string[];
  outputTypes?: LoggerOutputType[];
  id?: string;
  isAsyncFn?: boolean;
};

export type Logger = {
  logGroups: string[];
  outputTypes: LoggerOutputType[];
};

export enum LoggerLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum LoggerOutputType {
  CONSOLE = 'CONSOLE',
  FILE = 'FILE'
}

export const DEFAULT_LOG_GROUP = 'general';
export const DEFAULT_OUTPUT_TYPE = LoggerOutputType.FILE;

export const LOGGER_WORKER_HANDLER_FILE_PATH =
  './src/libs/logger/domain/services/loggerHandler.ts';
