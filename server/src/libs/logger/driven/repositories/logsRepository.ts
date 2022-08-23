export interface LogsRepository {
  saveLog(logGroups: string[], log: string): void;
}
