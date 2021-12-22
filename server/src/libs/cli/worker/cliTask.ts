import { CliConstants } from '../constants/cliConstants';
import { tokenizer } from '../utils/parser';
import { print, println, readln } from '../utils/io';
import { MessagePort, parentPort } from '../deps';

class CliTask {
  private running: boolean;
  private workerRef: MessagePort;

  constructor(workerRef: MessagePort) {
    this.running = false;
    this.workerRef = workerRef;
  }

  async run() {
    // If it's already running, this method has been called previously
    if (this.running) {
      return;
    } else {
      this.running = true;
    }

    try {
      // Add next command prefix
      print(CliConstants.LINE_PREFIX);
      do {
        const line = await readln();

        const tokens = tokenizer(line);

        if (tokens.length > 0) {
          this.workerRef.postMessage({
            data: {
              msg: CliConstants.INTERPRET_COMMAND,
              tokens
            }
          });
        } else {
          print(CliConstants.LINE_PREFIX);
        }
      } while (this.running);
    } catch (err) {
      this.terminate();

      if (typeof err === 'string') {
        println(err);
      } else if (err instanceof Error) {
        println(err.message);
      } else {
        println(`Error on cliTask: ${err}`);
      }

      this.workerRef.postMessage({ data: CliConstants.STOP_CLI_COMMAND });
    }
  }

  terminate() {
    this.running = false;
  }
}

const cliTask = parentPort == null ? undefined : new CliTask(parentPort);

parentPort?.on('message', (event: any) => {
  if (event.data === CliConstants.START_CLI_COMMAND) {
    cliTask?.run();
  } else if (event.data === CliConstants.STOP_CLI_COMMAND) {
    cliTask?.terminate();
  } else if (event.data === CliConstants.FININSHED_PROCESSING_COMMAND) {
    // This only seems like it blocks while it's executing what was called
    // but in reality this worker is never blocked, so there's nothing stopping the
    // user from keeping on typing new commands, it will just look a bit odd visually

    // Add next command prefix
    print(CliConstants.LINE_PREFIX);
  }
});
