export { serve } from 'https://deno.land/std@0.77.0/http/server.ts';
import { join as pathJoin } from 'https://deno.land/std@0.108.0/path/mod.ts';
export { pathJoin };

// config
export type { DenonConfig } from 'https://deno.land/x/denon@2.4.9/mod.ts';
import { config as dotEnvConfig } from 'https://deno.land/x/dotenv/mod.ts';
export { dotEnvConfig };

// libs
import SwaggerClient from '../src/libs/swagger-client-v3_17_0.js'; //v3.15.0 -> "https://cdn.skypack.dev/swagger-client";
export { SwaggerClient };
export { getApiSignature } from '../src/libs/api-signature/mod.ts';
export type { Sign } from '../src/libs/api-signature/mod.ts';

// tests
export {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.106.0/testing/asserts.ts';

// path config
const currentWorkingDir = Deno.cwd();
export const ROOT_PATH = findRootFolder(currentWorkingDir);
console.log('ROOT_PATH', ROOT_PATH);

console.log('Loading env file...');
const envConfig = dotEnvConfig({
  export: true,
  safe: true,
  path: pathJoin(ROOT_PATH, '/resources/env/.env'),
  example: pathJoin(ROOT_PATH, '/resources/env/.env.required_keys'),
});
console.log(envConfig);

function findRootFolder(path: string): string {
  let foldersMatched = 0;
  for (const dirEntry of Deno.readDirSync(path)) {
    if (foldersMatched === 2) {
      //root folder found
      return path;
    }

    if (dirEntry.name === 'src' || dirEntry.name === 'tests') {
      foldersMatched++;
    } else if (
      dirEntry.name === 'libs' ||
      dirEntry.name === 'unit' ||
      dirEntry.name === 'integration'
    ) {
      return findRootFolder(path.substr(0, path.lastIndexOf('/')));
    } else if (dirEntry.name === 'server' || dirEntry.name === 'app') {
      return findRootFolder(pathJoin(path, dirEntry.name));
    }
  }

  if (foldersMatched === 2) {
    //root folder found
    return path;
  }

  throw new Error('Could not find root folder');
}
