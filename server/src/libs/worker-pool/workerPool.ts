import { EventEmitter, pathJoin, randomUUID, ROOT_PATH, Worker } from './deps';
import { Dictionary, WorkerTask } from './workerPool.types';
import { WorkerPoolTask } from './workerPoolTask';

type WorkerWithPoolTask = {
  worker: Worker;
  workerPoolTask?: WorkerPoolTask;
  shared: boolean;
};

type TaskDoneCallback = {
  task: WorkerTask;
  doneCallback: (result: any, error: any) => void;
};

const FREE_WORKER_EVENT = 'freedWorker';

// Based on https://nodejs.org/api/async_context.html#using-asyncresource-for-a-worker-thread-pool

export class WorkerPool extends EventEmitter {
  private static instance: WorkerPool;

  private workers: Dictionary<WorkerWithPoolTask>;
  private tasks: TaskDoneCallback[];

  private constructor() {
    super();
    this.workers = {};
    this.tasks = [];

    this.on(FREE_WORKER_EVENT, () => {
      if (this.tasks.length > 0) {
        const task = this.tasks.shift();
        if (task != null) {
          this.runTask(
            task.task.workerFilePath,
            task.doneCallback,
            task.task.fn,
            task.task.args,
            task.task.workerId
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

  private initializeWorker(shared: boolean, id: string = randomUUID()): string {
    const worker: WorkerWithPoolTask = {
      worker: new Worker(
        pathJoin(ROOT_PATH, './src/libs/worker-pool/workerImporter.js'),
        {
          workerData: {
            workerFilePath: './src/libs/worker-pool/genericWorker.ts'
          }
        }
      ),
      shared
    };

    worker.worker.on('message', ({ result, error, taskId, isFinished }) => {
      if (worker.workerPoolTask?.taskId != taskId) {
        console.warn(
          `Received message for taskId ${taskId}, but was expecting taskId ${worker.workerPoolTask?.taskId}`,
          result,
          error
        );
        return;
      }

      if (result != null) {
        worker.workerPoolTask?.done(result, null);

        if (!isFinished) {
          return;
        }

        worker.workerPoolTask?.emitDestroy();
        worker.workerPoolTask = undefined;
      } else {
        console.error(
          'Received msg with error from worker and task',
          error,
          worker.workerPoolTask,
          taskId
        );
        worker.workerPoolTask?.done(null, error);
        worker.workerPoolTask = undefined;
      }

      // Notify there is a new free worker
      this.emit(FREE_WORKER_EVENT);
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
      worker.worker.removeAllListeners();
      delete this.workers[id];
      this.addWorker(worker.shared);
    });

    this.workers[id] = worker;
    this.emit(FREE_WORKER_EVENT);

    return id;
  }

  addWorker(shareWorker = true): string {
    return this.initializeWorker(shareWorker);
  }

  runTask(
    workerFilePath: string,
    doneCallback: (result: any, error: any) => void,
    fn: string,
    args: any[],
    id?: string
  ) {
    let freeWorker: WorkerWithPoolTask | undefined;

    if (id != null) {
      const worker = this.workers[id];
      if (worker == null) {
        throw new Error(`Unrecognized worker: ${id}`);
      }

      if (worker.workerPoolTask == null) {
        freeWorker = worker;
      }
    } else {
      // no id, then any shared worker goes

      freeWorker = Object.values(this.workers).find(
        ({ workerPoolTask, shared }) => shared && workerPoolTask == null
      );
    }

    const task: WorkerTask = {
      workerFilePath,
      fn,
      args,
      workerId: id,
      taskId: randomUUID()
    };
    if (freeWorker == null) {
      // queue up a new task
      this.tasks.push({ task, doneCallback });
      return;
    }

    freeWorker.workerPoolTask = new WorkerPoolTask(doneCallback, task.taskId);
    freeWorker.worker.postMessage(task);
  }

  async terminate() {
    const workersTermination = Object.values(this.workers).map((worker) =>
      worker.worker.terminate()
    );
    await Promise.allSettled(workersTermination);
  }

  getWorkersSize(sharedWorkers?: boolean): number {
    return sharedWorkers == null
      ? Object.keys(this.workers).length
      : Object.values(this.workers).filter(
          ({ shared }) => shared === sharedWorkers
        ).length;
  }
}
