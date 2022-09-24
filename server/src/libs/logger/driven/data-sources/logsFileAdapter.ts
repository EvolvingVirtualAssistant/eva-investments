import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { config as dotEnvConfig } from 'dotenv';
import { pathJoin, ROOT_PATH } from '../../deps';
import { LogsRepository } from '../repositories/logsRepository';

const LOG_FILE_ROTATION_INTERVAL_ENV_KEY = 'LOG_FILE_ROTATION_INTERVAL';
const LOG_OUTPUT_FOLDER_ENV_KEY = 'LOG_OUTPUT_FOLDER';
const DEFAULT_ROTATION_INTERVAL = 3600;
const DATE_SEPARATOR = '_';

export class LogsFileAdapter implements LogsRepository {
  private static instance: LogsFileAdapter;

  private _logsFolderPath: string;
  private _rotationInterval: number;

  private constructor() {
    this._logsFolderPath = getLogsFolderPath();
    let interval = Number(process.env[LOG_FILE_ROTATION_INTERVAL_ENV_KEY]);
    if (isNaN(interval)) {
      interval = DEFAULT_ROTATION_INTERVAL;
    }

    // seconds to ms
    this._rotationInterval = interval * 1000;
    return;
  }

  static getInstance(): LogsFileAdapter {
    if (!LogsFileAdapter.instance) {
      LogsFileAdapter.instance = new LogsFileAdapter();
    }

    return LogsFileAdapter.instance;
  }

  saveLog(logGroups: string[], log: string): void {
    if (logGroups.length === 0) {
      throw new Error(
        'LogsFileAdapter: Error saving log, due to empty logGroups array'
      );
    }

    logGroups.forEach((logGroup) => {
      const file = getLogFilePath(
        this._logsFolderPath,
        this._rotationInterval,
        logGroup
      );

      writeFileSync(pathJoin(this._logsFolderPath, file), log, {
        encoding: 'utf8',
        flag: 'a'
      });
    });
  }
}

const getLogsFolderPath = (): string => {
  if (process.env[LOG_OUTPUT_FOLDER_ENV_KEY] == null) {
    dotEnvConfig({
      path: pathJoin(ROOT_PATH, '/resources/env/.env')
    });
  }

  const logsFolderPath = pathJoin(
    ROOT_PATH,
    process.env[LOG_OUTPUT_FOLDER_ENV_KEY] || ''
  );

  if (!existsSync(logsFolderPath)) {
    mkdirSync(logsFolderPath);
  }

  return logsFolderPath;
};

const getLogFilePath = (
  logsFolderPath: string,
  rotationInterval: number,
  logGroup: string
): string => {
  const files = readdirSync(logsFolderPath, {
    encoding: 'utf8',
    withFileTypes: false
  });

  const logGroupRegex = new RegExp(logGroup + '_(.*)\\.log');
  const targetFile = files
    .filter((file) => logGroupRegex.test(file))
    .map((file) => file.trim())
    .reduce((prev, curr) => {
      const prevDate = getDateFromLogFileName(prev, logGroupRegex);
      const currDate = getDateFromLogFileName(curr, logGroupRegex);

      if (prevDate == null) {
        return currDate == null ? '' : curr;
      }

      if (currDate == null) {
        return prev;
      }

      return prevDate < currDate ? curr : prev;
    }, '');

  // Rotate file
  if (targetFile === '') {
    return getNewLogFileName(logGroup);
  }

  const fileCreationDate =
    getDateFromLogFileName(targetFile, logGroupRegex)?.getTime() || 0;

  // Rotate file
  if (getUTCTimeStamp() > fileCreationDate + rotationInterval) {
    return getNewLogFileName(logGroup);
  }

  return targetFile;
};

const getUTCTimeStamp = (): number =>
  new Date(new Date().toUTCString().replace('GMT', '').trim()).getTime();

const getDateFromLogFileName = (
  fileName: string,
  logGroupRegex: RegExp
): Date | undefined => {
  const matches = fileName.match(logGroupRegex);

  if (matches == null || matches.length != 2) {
    return undefined;
  }

  const dateNums = matches[1]
    .split(DATE_SEPARATOR)
    .map((num) => (isNaN(Number(num)) ? 0 : Number(num)));

  if (dateNums.length != 7) {
    return undefined;
  }

  return new Date(
    dateNums[0],
    dateNums[1] - 1,
    dateNums[2],
    dateNums[3],
    dateNums[4],
    dateNums[5],
    dateNums[6]
  );
};

const getNewLogFileName = (logGroup: string): string => {
  const date = new Date();
  return (
    logGroup +
    DATE_SEPARATOR +
    (date.getUTCFullYear() +
      DATE_SEPARATOR +
      (date.getUTCMonth() + 1) +
      DATE_SEPARATOR +
      date.getUTCDate() +
      DATE_SEPARATOR +
      date.getUTCHours() +
      DATE_SEPARATOR +
      date.getUTCMinutes() +
      DATE_SEPARATOR +
      date.getUTCSeconds() +
      DATE_SEPARATOR +
      date.getUTCMilliseconds()) +
    '.log'
  );
};
