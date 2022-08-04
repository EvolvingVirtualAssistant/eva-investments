import { AsyncResource } from './deps';

// TODO: Maybe add support for long lived tasks (instead of emitDestroy right away)
export class WorkerPoolTask extends AsyncResource {
  private doneCallback;

  constructor(doneCallback: (...args: any[]) => any) {
    super('WorkerPoolTask');
    this.doneCallback = doneCallback;
  }

  done(result: any, error: any) {
    this.runInAsyncScope(this.doneCallback, null, result, error);
    this.emitDestroy();
  }
}
