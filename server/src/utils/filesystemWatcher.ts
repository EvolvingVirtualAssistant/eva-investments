import { Dictionary } from '../types/types';
import { FSWatcher, watch, WatchEventType } from '../deps';

interface FileTime {
  callTime: number;
  timeoutId: NodeJS.Timeout;
  watcher: FSWatcher;
}

const WAIT_FILE_READY_TIME = 1000; // ms

const filesWatched: Dictionary<FileTime[]> = {};
const watchers: Dictionary<FSWatcher> = {};

export function watchFile(filePath: string, callback: () => void): void {
  const watcher = watch(filePath, (event: WatchEventType, filename: string) => {
    if (event === 'change') {
      invokeCallback(filePath, callback, watcher);
      return;
    }

    console.log(
      `filesystemWatcher - Ignored event ${event} received for file ${filename} (${filePath})`
    );
  });
}

function invokeCallback(
  filePath: string,
  callback: () => void,
  watcher: FSWatcher
): void {
  const fileTimes = filesWatched[filePath] || [];
  const index = fileTimes.findIndex((file) => file.watcher === watcher);
  const currTime = Date.now();

  if (index < 0) {
    fileTimes.push({
      callTime: currTime,
      timeoutId: setTimeout(callback, WAIT_FILE_READY_TIME),
      watcher
    });
  } else {
    if (currTime - fileTimes[index].callTime < WAIT_FILE_READY_TIME) {
      clearTimeout(fileTimes[index].timeoutId);
    }

    fileTimes[index].callTime = currTime;
    fileTimes[index].timeoutId = setTimeout(callback, WAIT_FILE_READY_TIME);
  }

  filesWatched[filePath] = fileTimes;
}

export function unwatchFile(filePath: string): void {
  const fileTimes = filesWatched[filePath];

  if (fileTimes != null) {
    fileTimes.forEach((fileTime) => {
      fileTime.timeoutId.unref();
      clearTimeout(fileTime.timeoutId);
      fileTime.watcher.removeAllListeners();
      fileTime.watcher.close();
    });
    delete filesWatched[filePath];
  }
}
