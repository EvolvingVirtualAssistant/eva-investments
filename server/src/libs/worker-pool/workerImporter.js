// Taken from here https://wanago.io/2019/05/06/node-js-typescript-12-worker-threads/

const { join } = require('path');
const { readdirSync } = require('fs');
const { workerData } = require('worker_threads');

const findRootFolder = (path) => {
  let foldersMatched = 0;
  for (const dirEntry of readdirSync(path)) {
    if (foldersMatched === 2) {
      //root folder found
      return path;
    }

    if (dirEntry === 'src' || dirEntry === 'tests') {
      foldersMatched++;
    } else if (
      dirEntry === 'libs' ||
      dirEntry === 'unit' ||
      dirEntry === 'integration'
    ) {
      return findRootFolder(path.substr(0, path.lastIndexOf('/')));
    } else if (dirEntry === 'server' || dirEntry === 'app') {
      return findRootFolder(join(path, dirEntry));
    }
  }

  if (foldersMatched === 2) {
    //root folder found
    return path;
  }

  throw new Error('Could not find root folder');
};

// path config
const currentWorkingDir = __dirname + '/../../../../'; //process.cwd();
const ROOT_PATH = findRootFolder(currentWorkingDir);

require('ts-node').register();
require(join(ROOT_PATH, workerData.workerFilePath));
