export type WorkerTask = {
  workerFilePath: string;
  fn: string;
  args: any[];
};

export interface Dictionary<T> {
  [key: string]: T;
}

// If you use the generic worker file path, your file path specified on the runTask
// will be dynamically imported and must contain an onMessage function like this:
// onMessage(task: WorkerTask): Promise<{ result: any; error: any }>
// Note: do not declare a parentPort in that dynamically imported file
// it will result in duplicated processing of events (one on the generic worker, and the other on the specified file)
export const GENERIC_WORKER_FILE_PATH =
  './src/libs/worker-pool/genericWorker.ts';
