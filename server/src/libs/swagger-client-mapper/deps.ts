import SwaggerClient from 'swagger-client';
export { SwaggerClient };

import { join as pathJoin } from 'path';
export { pathJoin };

import { readFile as fsReadFile, readdir as fsReaddir, readdirSync } from 'fs';
import { promisify } from 'util';

export const readFile = promisify(fsReadFile);
export const readdir = promisify(fsReaddir);

function findRootFolder(path: string): string {
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
      return findRootFolder(pathJoin(path, dirEntry));
    }
  }

  if (foldersMatched === 2) {
    //root folder found
    return path;
  }

  throw new Error('Could not find root folder');
}

// path config
const currentWorkingDir = __dirname + '/../../../../'; //process.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);
export { logDebug } from 'logger';
