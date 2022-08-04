import { EventEmitter, pathJoin, ROOT_PATH, Worker } from './deps';
import { WorkerTask } from './workerPool.types';
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
  private _numThreads: number;
  private _workerFilePath: string;
  private workers: WorkerWithPoolTask[];
  private freeWorkers: WorkerWithPoolTask[];
  private tasks: TaskDoneCallback[];

  constructor(numThreads: number, workerFilePath: string) {
    super();
    this._numThreads = numThreads;
    this._workerFilePath = workerFilePath;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < this._numThreads; i++) {
      this.addWorker();
    }

    this.on(FREE_WORKER_EVENT, () => {
      if (this.tasks.length > 0) {
        const task = this.tasks.shift();

        if (task != null) {
          this.runTask(task.doneCallback, task.task.fn, task.task.args);
        }
      }
    });
  }

  private addWorker() {
    const worker: WorkerWithPoolTask = {
      worker: new Worker(
        pathJoin(ROOT_PATH, './src/libs/worker-pool/workerImporter.js'),
        {
          workerData: {
            workerFilePath: this._workerFilePath
          }
        }
      )
    };

    worker.worker.on('message', (result) => {
      worker.workerPoolTask?.done(result, null);
      worker.workerPoolTask = undefined;

      // Notify there is a new free worker
      this.freeWorkers.push(worker);
      this.emit(FREE_WORKER_EVENT);
    });

    worker.worker.on('error', (error) => {
      if (worker.workerPoolTask != null) {
        worker.workerPoolTask?.done(null, error);
      } else {
        this.emit('error', error);
      }

      // Delete worker and create a new one
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addWorker();
    });

    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(FREE_WORKER_EVENT);
  }

  runTask(
    doneCallback: (result: any, error: any) => void,
    fn: string,
    args: any[]
  ) {
    const task: WorkerTask = { fn, args };
    if (this.freeWorkers.length === 0) {
      // queue up a new task
      this.tasks.push({ task, doneCallback });
      return;
    }

    const worker = this.freeWorkers.pop();

    if (worker != null) {
      worker.workerPoolTask = new WorkerPoolTask(doneCallback);
      worker.worker.postMessage(task);
    }
  }

  async terminate() {
    const workersTermination = this.workers.map((worker) =>
      worker.worker.terminate()
    );
    await Promise.allSettled(workersTermination);
  }
}
