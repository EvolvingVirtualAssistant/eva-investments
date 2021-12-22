import { initCliWorker } from '../worker/cliWorker';
import { CliContext } from '../worker/cliContext';
import { Command } from '../types/cli.types';
import { CliConstants } from '../constants/cliConstants';
import { getCurrentPath } from '../utils/paths';

export function cliAdapter(command?: Command): ClassDecorator {
  initCliWorker();

  return function (target: any) {
    const originalConstructor = target.prototype.constructor;
    let singleton = new target.prototype.constructor();
    const cliContext = CliContext.getInstance();
    cliContext.registerCliAdapter(
      singleton,
      CliConstants.CLI_ADAPTER_PATH_AND_CLASS(getCurrentPath(), target.name),
      command
    );

    let initialized = false;

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
