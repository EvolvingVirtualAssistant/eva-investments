import { initCliWorker } from '../worker/cliWorker.ts';
import { cliContext } from '../worker/cliContext.ts';
import { Command } from '../types/cli.types.ts';
import { CliConstants } from '../constants/cliConstants.ts';
import { getCurrentPath } from '../utils/paths.ts';

export function cliAdapter(command?: Command): ClassDecorator {
  initCliWorker();
  return function (target: any) {
    cliContext.registerCliAdapter(
      CliConstants.CLI_ADAPTER_PATH_AND_CLASS(getCurrentPath(), target.name),
      command
    );
  };
}
