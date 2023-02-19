import { parentPort, pathJoin, ROOT_PATH } from './deps';
import { Dictionary, WorkerTask } from './workerPool.types';

type OnMessageFunction = (
  task: WorkerTask
) => Promise<{ result: any; error: any }>;

const workerFilePaths: Dictionary<OnMessageFunction> = {};

parentPort?.on('message', async (task: WorkerTask) => {
  let result;
  let error;
  try {
    let workerOnMessageFn = workerFilePaths[task.workerFilePath];

    if (workerOnMessageFn == null) {
      workerOnMessageFn = await getWorkerOnMessageFn(task.workerFilePath);
      workerFilePaths[task.workerFilePath] = workerOnMessageFn;
    }

    const res = await workerOnMessageFn(task);
    result = res.result;
    error = res.error;
  } catch (e) {
    console.warn('worker - onmessage error', e);
    error = e;
  } finally {
    parentPort?.postMessage({ result, error });
  }
});

const getWorkerOnMessageFn = async (
  workerFilePath: string
): Promise<OnMessageFunction> => {
  const path = pathJoin(ROOT_PATH, workerFilePath);

  const imported = await import(path);

  const onMessageFn = imported?.['onMessage'];
  if (onMessageFn == null) {
    throw new Error(
      `Unable to find onMessage function in ${path}. Imported=${JSON.stringify(
        imported
      )}`
    );
  }

  // As it is, this cast can be dangerous (would need to check for args, their type and function return)
  return onMessageFn as OnMessageFunction;
};
