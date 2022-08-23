export interface Dictionary<T> {
  [key: string]: T;
}

export type LoggerOptions = {
  logGroups: string[];
  id?: string;
  outputTypes: LoggerOutputType[];
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
