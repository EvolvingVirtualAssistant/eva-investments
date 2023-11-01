import { AsyncResource } from './deps';

// TODO: Maybe add support for long lived tasks (instead of emitDestroy right away)
export class WorkerPoolTask extends AsyncResource {
  private _doneCallback;
  private _taskId;

  constructor(doneCallback: (...args: any[]) => any, taskId: string) {
    super('WorkerPoolTask');
    this._doneCallback = doneCallback;
    this._taskId = taskId;
  }

  done(result: any, error: any) {
    this.runInAsyncScope(
      async (res: any, err: any) => {
        try {
          await this._doneCallback(res, err);
        } catch (e) {
          console.error('workerPoolTask - runInAsyncScope', e);
        }
      },
      null,
      result,
      error
    );
  }

  get taskId() {
    return this._taskId;
  }
}
