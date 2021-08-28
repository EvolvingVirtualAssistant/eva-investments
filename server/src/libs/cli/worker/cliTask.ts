import { CliConstants } from "../constants/cliConstants.ts";
import { tokenizer } from "../utils/parser.ts";
import { print, println, readln } from "../utils/io.ts";
import { cliContext } from "./cliContext.ts";

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
            do {
                // Add prefix
                print(CliConstants.LINE_PREFIX);

                const line = await readln();
                const tokens = tokenizer(line);
                cliContext.interpretCommand(tokens);

                // THIS WILL LIKELY SHOULD BE REMOVED FROM HERE AND BE SPECIFIC FOR A SYSTEM USING THIS LIB
                if (line === CliConstants.STOP_APP_COMMAND) {
                    this.workerRef.postMessage(CliConstants.STOP_APP_COMMAND);
                }
            } while (this.running)
        } catch (err) {
            this.running = false;
            println(err);
            this.workerRef.postMessage(CliConstants.STOP_APP_COMMAND);
        }
    }

    terminate() {
        this.running = false;
    }
}

const cliTask = new CliTask((<Worker><unknown>self));

(<Worker><unknown>self).onmessage = function handleMessageFromParent(event: MessageEvent) {
    if (event.data === CliConstants.START_CLI_COMMAND) {
        cliTask.run();
    } else if (event.data === CliConstants.STOP_CLI_COMMAND) {
        cliTask.terminate()
    }
}