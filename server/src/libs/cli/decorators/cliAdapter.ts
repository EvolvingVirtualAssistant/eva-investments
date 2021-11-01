import { initCliWorker } from '../worker/cliWorker.ts';
import { cliContext } from '../worker/cliContext.ts';
import { Command } from '../types/cli.types.ts';
import { CliConstants } from '../constants/cliConstants.ts';
import { getCurrentPath } from '../utils/paths.ts';

export function cliAdapter(command?: Command): ClassDecorator {
  initCliWorker();

  return function (target: any) {
    var originalConstructor = target.prototype.constructor;
    var singleton = new target.prototype.constructor();
    cliContext.registerCliAdapter(
      singleton,
      CliConstants.CLI_ADAPTER_PATH_AND_CLASS(getCurrentPath(), target.name),
      command
    );

    var initialized = false;

    const res: typeof target.prototype.constructor = function (...args: any[]) {
      if (!initialized) {
        const newInstance = new originalConstructor(...args);
        cliContext.updateCliEntrypointClassInstance(singleton, newInstance);
        singleton = newInstance;
        initialized = true;
      }

      // We can also just throw an exception here, saying that the class can no longer be instantiated
      return singleton;
    };

    return res;
  };
}
