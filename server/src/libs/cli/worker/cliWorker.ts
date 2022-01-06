import { CliConstants } from '../constants/cliConstants';
import { Worker, readline } from '../deps';
import { print, println } from '../utils/io';
import { tokenizer } from '../utils/parser';
import { CliContext } from './cliContext';

let cliWorker: Worker | null;
let readlineInterface: readline.Interface | null;
let initialized = false;

export function initCli(): void {
  if (initialized) {
    return;
  }

  initialized = true;
  initCliNode();
}

export function terminateCli() {
  if (cliWorker != null) {
    cliWorker.terminate();
    cliWorker = null;
  }

  if (readlineInterface != null) {
    readlineInterface?.close();
    readlineInterface = null;
  }

  initialized = false;
}

function initCliNode() {
  print(CliConstants.LINE_PREFIX);
  readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  readlineInterface.on('SIGINT', () => {
    readlineInterface?.close();
    process.exit(0);
  });
  readlineInterface.on('line', async (line: string) => {
    try {
      const tokens = tokenizer(line.trim());
      await CliContext.getInstance().interpretCommand(tokens);
      print(CliConstants.LINE_PREFIX);
    } catch (err) {
      if (typeof err === 'string') {
        readlineInterface?.write;
        println(err);
      } else if (err instanceof Error) {
        println(err.message);
      } else {
        println(`Error on cliWorker: ${err}`);
      }

      readlineInterface?.close();
      process.exit(0);
    }
  });
}

function initCliDeno() {
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
