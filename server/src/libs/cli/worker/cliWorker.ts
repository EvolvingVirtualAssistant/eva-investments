import { CliConstants } from "../constants/cliConstants.ts";

var cliWorkerStarted = false;

export function initCliWorker(): void {
    if (cliWorkerStarted) {
      return;
    }

    cliWorkerStarted = true;

    const cliWorker = new Worker(new URL("./cliTask.ts", import.meta.url).href, {
      type: "module",
      deno: {
        namespace: true,
        permissions: "none"
      }
    });
  
    cliWorker.addEventListener("message", event => {
      if (event.data === CliConstants.STOP_CLI_COMMAND) {
        Deno.exit(); // NOT A GOOD A IDEA TO HAVE A LIB TERMINATING EXECUTION
        // WHAT HAPPENS IF I JUST THROW AN ERROR HERE? LIKELY WILL CRASH THE CODE, JUST NOT SURE WHERE
      }
    });
  
    cliWorker.postMessage(CliConstants.START_CLI_COMMAND);
}