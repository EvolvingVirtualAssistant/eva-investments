import { CliConstants } from '../constants/cliConstants.ts';
import { cliContext } from './cliContext.ts';

export function initCliWorker(): void {
  if (cliWorker != null) {
    return;
  }

  cliWorker = new Worker(new URL('./cliTask.ts', import.meta.url).href, {
    type: 'module',
    deno: {
      namespace: true,
      permissions: 'none',
    },
  });

  cliWorker.addEventListener('message', async (event) => {
    if (event.data === CliConstants.STOP_CLI_COMMAND) {
      cliWorker!.terminate();
      Deno.exit();
    } else if (event.data.msg === CliConstants.INTERPRET_COMMAND) {
      await cliContext.interpretCommand(event.data.tokens);
      cliWorker!.postMessage(CliConstants.FININSHED_PROCESSING_COMMAND);
    }
  });

  cliWorker.postMessage(CliConstants.START_CLI_COMMAND);
}

export function terminateCliWorker() {
  if (cliWorker != null) {
    cliWorker.terminate();
    cliWorker = null;
  }
}

var cliWorker: Worker | null;
