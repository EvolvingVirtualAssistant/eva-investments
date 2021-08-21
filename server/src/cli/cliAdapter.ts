import { CliConstants } from "./constants.ts";
import { tokenizer } from "./parser.ts";
import { print, println, readln } from "./io.ts";

class CliAdapter {
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
                print("> ");

                const line = await readln();
                const tokens = tokenizer(<string>line);
                println(tokens.join(" "));

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

const cliAdapter = new CliAdapter((<Worker><unknown>self));

(<Worker><unknown>self).onmessage = function handleMessageFromParent(event: MessageEvent) {
    if (event.data === "start") {
        cliAdapter.run();
    } else if (event.data === "stop") {
        cliAdapter.terminate()
    }
}