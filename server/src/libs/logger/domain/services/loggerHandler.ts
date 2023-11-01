import {
  LOG_ID_REGEX,
  LOG_ID_SEPARATOR,
  LOG_MSG_SEPARATOR
} from '../../constants/loggerConstants';
import { WorkerTask } from '../../deps';
import { LogsConsoleAdapter } from '../../driven/data-sources/logsConsoleAdapter';
import { LogsFileAdapter } from '../../driven/data-sources/logsFileAdapter';
import { LogsRepository } from '../../driven/repositories/logsRepository';
import {
  DEFAULT_LOG_GROUP,
  DEFAULT_OUTPUT_TYPE,
  Dictionary,
  Logger,
  LoggerLevel,
  LoggerOutputType
} from '../../types/logger.types';

export const onMessage = (
  task: WorkerTask,
  intermediateCallback: (res: any, err: any) => void
): { result: any; error: any } => {
  try {
    switch (task.fn) {
      case LoggerLevel.INFO:
      case LoggerLevel.DEBUG:
      case LoggerLevel.WARNING:
      case LoggerLevel.ERROR:
        saveLog(
          task.fn,
          task.args[0],
          task.args[1],
          task.args[2],
          task.args[3],
          ...task.args[4]
        );
        break;
      default:
        throw new Error(`Worker: Unsupported log level ${task.fn}`);
    }
  } catch (e) {
    saveLoggingError(e);
  }

  return { result: '', error: undefined };
};

const saveLog = (
  level: LoggerLevel,
  loggers: Dictionary<Logger>,
  stack: string,
  timestamp: number,
  message: any,
  ...optionalParams: any[]
): void => {
  const [logId, log] = buildLog(
    level,
    stack,
    timestamp,
    message,
    ...optionalParams
  );

  const logger = loggers[logId];

  const logGroups =
    logger == null || logger.logGroups.length === 0
      ? [DEFAULT_LOG_GROUP]
      : logger.logGroups.map((group) =>
          !group?.trim() ? DEFAULT_LOG_GROUP : group.trim()
        );
  const outputTypes =
    logger == null || logger.outputTypes.length === 0
      ? [DEFAULT_OUTPUT_TYPE]
      : logger.outputTypes;

  outputTypes.forEach((outputType) => {
    getLogsRepository(outputType).saveLog(logGroups, log);
  });
};

const saveLoggingError = (e: unknown): void => {
  const msg = `${e}`;
  const log = prefixLog(Date.now(), 'LOGGING_ERROR', LoggerLevel.ERROR, msg);

  getLogsRepository(DEFAULT_OUTPUT_TYPE).saveLog([DEFAULT_LOG_GROUP], log);
};

const getLogsRepository = (outputType: LoggerOutputType): LogsRepository =>
  outputType === LoggerOutputType.FILE
    ? LogsFileAdapter.getInstance()
    : LogsConsoleAdapter.getInstance();

const buildLog = (
  level: LoggerLevel,
  stack: string,
  timestamp: number,
  message: any,
  ...optionalParams: any[]
): [string, string] => {
  const msg =
    optionalParams.length === 0
      ? message + ''
      : message + LOG_MSG_SEPARATOR + optionalParams.join(LOG_MSG_SEPARATOR);

  const [logId, logIdChain] = getLogId(stack);

  return [logId, prefixLog(timestamp, logIdChain, level, msg)];
};

const prefixLog = (
  timestamp: number,
  logId: string,
  level: LoggerLevel,
  msg: string
): string => {
  const log = msg.endsWith('\n') ? msg : msg + '\n';
  const dateTime = formatTimestamp(timestamp);
  return `[${dateTime}] - [${logId}] - [${level}] - ${log}`;
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const mm = date.getUTCMonth() + 1;
  const dd = date.getUTCDate();
  const hh = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();
  const ms = date.getUTCMilliseconds();

  const month = mm < 10 ? '0' + mm : mm;
  const day = dd < 10 ? '0' + dd : dd;
  const hours = hh < 10 ? '0' + hh : hh;
  const minutes = m < 10 ? '0' + m : m;
  const seconds = s < 10 ? '0' + s : s;
  const milliseconds = ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms;
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
};

const getLogId = (stack: string): [string, string] => {
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

  return [ids[ids.length - 1]!, ids.join(LOG_ID_SEPARATOR)];
};
