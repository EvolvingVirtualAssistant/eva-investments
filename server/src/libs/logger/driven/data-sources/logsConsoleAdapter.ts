import { LogsRepository } from '../repositories/logsRepository';

export class LogsConsoleAdapter implements LogsRepository {
  private static instance: LogsConsoleAdapter;

  private constructor() {
    return;
  }

  static getInstance(): LogsConsoleAdapter {
    if (!LogsConsoleAdapter.instance) {
      LogsConsoleAdapter.instance = new LogsConsoleAdapter();
    }

    return LogsConsoleAdapter.instance;
  }

  saveLog(logGroups: string[], log: string): void {
    if (logGroups.length === 0) {
      throw new Error(
        'LogsConsoleAdapter: Error saving log, due to empty logGroups array'
      );
    }
    console.log(`[${logGroups.join(',')}] - ${log}`);
  }
}
