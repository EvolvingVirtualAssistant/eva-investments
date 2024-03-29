import { Dictionary } from '../types/types';
import { FSWatcher, logWarn, watch, WatchEventType } from '../deps';

interface FileTime {
  callTime?: number;
  timeoutId?: NodeJS.Timeout;
  watcher: FSWatcher;
}

const WAIT_FILE_READY_TIME = 1000; // ms

const filesWatched: Dictionary<FileTime[]> = {};

export function watchFile(filePath: string, callback: () => void): FSWatcher {
  const watcher = watch(filePath, (event: WatchEventType, filename: string) => {
    if (event === 'change') {
      invokeCallback(filePath, callback, watcher);
      return;
    }

    logWarn(
      `filesystemWatcher - Ignored event ${event} received for file ${filename} (${filePath})`
    );
  });

  const fileTimes = filesWatched[filePath] || [];
  fileTimes.push({ watcher });
  filesWatched[filePath] = fileTimes;

  return watcher;
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
    if (
      fileTimes[index].callTime != null &&
      fileTimes[index].timeoutId != null &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currTime - fileTimes[index].callTime! < WAIT_FILE_READY_TIME
    ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clearTimeout(fileTimes[index].timeoutId!);
    }

    fileTimes[index].callTime = currTime;
    fileTimes[index].timeoutId = setTimeout(callback, WAIT_FILE_READY_TIME);
  }

  filesWatched[filePath] = fileTimes;
}

export function unwatchFile(filePath: string, watchers: FSWatcher[]): void {
  const fileTimes = filesWatched[filePath];

  if (fileTimes != null) {
    const newFileTimes: FileTime[] = [];
    fileTimes.forEach((fileTime) => {
      if (watchers.some((watcher) => watcher === fileTime.watcher)) {
        if (fileTime.timeoutId != null) {
          fileTime.timeoutId.unref();
          clearTimeout(fileTime.timeoutId);
        }

        fileTime.watcher.close();
      } else {
        newFileTimes.push(fileTime);
      }
    });

    if (newFileTimes.length === 0) {
      delete filesWatched[filePath];
    } else {
      filesWatched[filePath] = newFileTimes;
    }
  }
}
