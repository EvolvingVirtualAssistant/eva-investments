import { parentPort, WorkerTask } from '../../deps';
import { onMessage } from './logHandler';

console.log('logHandler worker file initialization');

parentPort?.on('message', async (task: WorkerTask) => {
  const res = onMessage(task);
  parentPort?.postMessage(res);
});
