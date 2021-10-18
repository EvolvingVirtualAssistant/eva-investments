import { CliConstants } from '../constants/cliConstants.ts';
import { tokenizer } from '../utils/parser.ts';
import { print, println, readln } from '../utils/io.ts';

class CliTask {
  private running: boolean;
  private workerRef: Worker;

  constructor(workerRef: Worker) {
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
            msg: CliConstants.INTERPRET_COMMAND,
            tokens,
          });
        } else {
          print(CliConstants.LINE_PREFIX);
        }
      } while (this.running);
    } catch (err) {
      this.terminate();
      println(err);
      this.workerRef.postMessage(CliConstants.STOP_CLI_COMMAND);
    }
  }

  terminate() {
    this.running = false;
  }
}

const cliTask = new CliTask(<Worker>(<unknown>self));

(<Worker>(<unknown>self)).onmessage = function handleMessageFromParent(
  event: MessageEvent
) {
  if (event.data === CliConstants.START_CLI_COMMAND) {
    cliTask.run();
  } else if (event.data === CliConstants.STOP_CLI_COMMAND) {
    cliTask.terminate();
  } else if (event.data === CliConstants.FININSHED_PROCESSING_COMMAND) {
    // This only seems like it blocks while it's executing what was called
    // but in reality this worker is never blocked, so there's nothing stopping the
    // user from keeping on typing new commands, it will just look a bit odd visually

    // Add next command prefix
    print(CliConstants.LINE_PREFIX);
  }
};
