import { EventEmitter, pathJoin, ROOT_PATH, Worker } from './deps';
import {
  Dictionary,
  GENERIC_WORKER_FILE_PATH,
  WorkerTask
} from './workerPool.types';
import { WorkerPoolTask } from './workerPoolTask';

type WorkerWithPoolTask = {
  worker: Worker;
  workerPoolTask?: WorkerPoolTask;
};

type TaskDoneCallback = {
  task: WorkerTask;
  doneCallback: (result: any, error: any) => void;
};

const FREE_WORKER_EVENT = 'freedWorker';

// Based on https://nodejs.org/api/async_context.html#using-asyncresource-for-a-worker-thread-pool

export class WorkerPool extends EventEmitter {
  private static instance: WorkerPool;

  private workers: Dictionary<WorkerWithPoolTask[]>;
  private tasks: TaskDoneCallback[];

  private constructor() {
    super();
    this.workers = {};
    this.tasks = [];

    this.on(FREE_WORKER_EVENT, (workerFilePath: string) => {
      const taskIndex = this.tasks.findIndex(
        (t) => t.task.workerFilePath == workerFilePath
      );

      if (taskIndex >= 0) {
        const task = this.tasks.splice(taskIndex, 1)[0];

        if (task != null) {
          this.runTask(
            workerFilePath,
            task.doneCallback,
            task.task.fn,
            task.task.args
          );
        }
      }
    });
  }

  static getInstance(): WorkerPool {
    if (WorkerPool.instance == null) {
      WorkerPool.instance = new WorkerPool();
    }

    return WorkerPool.instance;
  }

  private initializeWorker(workerFilePath: string): WorkerWithPoolTask {
    const worker: WorkerWithPoolTask = {
      worker: new Worker(
        pathJoin(ROOT_PATH, './src/libs/worker-pool/workerImporter.js'),
        { workerData: { workerFilePath } }
      )
    };

    worker.worker.on('message', ({ result, error }) => {
      if (result != null) {
        worker.workerPoolTask?.done(result, null);
        worker.workerPoolTask = undefined;
      } else {
        console.error(
          'Received msg with error from worker',
          error,
          worker.workerPoolTask
        );
        worker.workerPoolTask?.done(null, error);
        worker.workerPoolTask = undefined;
      }

      // Notify there is a new free worker
      this.emit(FREE_WORKER_EVENT, workerFilePath);
    });

    worker.worker.on('error', (error) => {
      console.error('Error received from worker', error, worker.workerPoolTask);
      if (worker.workerPoolTask == null) {
        this.emit('error', error);
      } else {
        console.error(
          'worker should be calling postMessage instead of not catching an exception'
        );
      }

      // Delete worker and create a new one
      this.workers[workerFilePath].splice(
        this.workers[workerFilePath].indexOf(worker),
        1
      );
      this.addWorker(workerFilePath);
    });

    return worker;
  }

  addWorker(workerFilePath: string, shareWorker = true) {
    let workerElems = this.workers[workerFilePath];

    if (workerElems == null) {
      workerElems = [];
    }

    if (workerElems.length > 0 && shareWorker) {
      return;
    }

    if (workerElems.length === 0 || !shareWorker) {
      const worker = this.initializeWorker(workerFilePath);
      workerElems.push(worker);
    }

    this.workers[workerFilePath] = workerElems;
    this.emit(FREE_WORKER_EVENT, workerFilePath);
  }

  runTask(
    workerFilePath: string,
    doneCallback: (result: any, error: any) => void,
    fn: string,
    args: any[]
  ) {
    let workerElems = this.workers[workerFilePath];
    if (workerElems == null) {
      workerElems = this.workers[GENERIC_WORKER_FILE_PATH];

      if (workerElems == null) {
        throw new Error(
          `Unrecognized worker file path: ${workerFilePath} and no generic worker was created in the pool`
        );
      }
    }

    const task: WorkerTask = { workerFilePath, fn, args };
    const freeWorker = workerElems.find((w) => w.workerPoolTask == null);
    if (freeWorker == null) {
      // queue up a new task
      this.tasks.push({ task, doneCallback });
      return;
    }

    freeWorker.workerPoolTask = new WorkerPoolTask(doneCallback);
    freeWorker.worker.postMessage(task);
  }

  async terminate() {
    const workersTermination = Object.values(this.workers)
      .flatMap((workerElems) => workerElems)
      .map((worker) => worker.worker.terminate());
    await Promise.allSettled(workersTermination);
  }

  getWorkersSize(workerFilePath = ''): number {
    return workerFilePath === ''
      ? Object.values(this.workers).flatMap((workerElems) => workerElems).length
      : this.workers[workerFilePath]?.length || 0;
  }
}
