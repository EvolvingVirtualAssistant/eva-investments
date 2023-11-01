export type WorkerTask = {
  workerFilePath: string;
  fn: string;
  args: any[];
  workerId?: string;
  taskId: string;
};

export interface Dictionary<T> {
  [key: string]: T;
}
