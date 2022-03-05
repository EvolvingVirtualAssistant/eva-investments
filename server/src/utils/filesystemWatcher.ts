import { Dictionary } from '../types/types';
import { watch, WatchEventType } from '../deps';

interface FileTime {
  callTime: number;
  timeoutId: NodeJS.Timeout;
}

const WAIT_FILE_READY_TIME = 1000; // ms

const filesWatched: Dictionary<FileTime> = {};

export function watchFile(filePath: string, callback: () => void): void {
  // TODO Consider storing the FSWatcher for any required cleanup (not sure if needed)
  watch(filePath, (event: WatchEventType, filename: string) => {
    if (event === 'change') {
      invokeCallback(filePath, callback);
      return;
    }

    console.log(
      `filesystemWatcher - Ignored event ${event} received for file ${filename} (${filePath})`
    );
  });
}

function invokeCallback(filePath: string, callback: () => void): void {
  const fileTime = filesWatched[filePath];
  const currTime = Date.now();

  if (fileTime != null && currTime - fileTime.callTime < WAIT_FILE_READY_TIME) {
    clearTimeout(fileTime.timeoutId);
  }

  filesWatched[filePath] = {
    callTime: currTime,
    timeoutId: setTimeout(callback, WAIT_FILE_READY_TIME)
  };
}
