import { CliConstants } from '../constants/cliConstants';
import { Worker } from '../deps';
import { CliContext } from './cliContext';

export function initCliWorker(): void {
  if (cliWorker != null) {
    return;
  }

  cliWorker = new Worker(process.cwd() + '/src/libs/cli/worker/cliTask.ts');

  cliWorker.addListener('message', async (event: any) => {
    if (event.data === CliConstants.STOP_CLI_COMMAND) {
      cliWorker?.terminate();
      process.exit(0);
    } else if (event.data.msg === CliConstants.INTERPRET_COMMAND) {
      await CliContext.getInstance().interpretCommand(event.data.tokens);
      cliWorker?.postMessage({
        data: CliConstants.FININSHED_PROCESSING_COMMAND
      });
    }
  });

  cliWorker.postMessage({ data: CliConstants.START_CLI_COMMAND });
}

export function terminateCliWorker() {
  if (cliWorker != null) {
    cliWorker.terminate();
    cliWorker = null;
  }
}

let cliWorker: Worker | null;
