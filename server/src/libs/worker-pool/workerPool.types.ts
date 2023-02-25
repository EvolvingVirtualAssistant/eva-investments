export type WorkerTask = {
  workerFilePath: string;
  fn: string;
  args: any[];
  workerId?: string;
};

export interface Dictionary<T> {
  [key: string]: T;
}
