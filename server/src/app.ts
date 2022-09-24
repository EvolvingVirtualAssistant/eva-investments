import { initAppContext } from './appContext';
import {
  logError,
  LoggerOutputType,
  terminateCli,
  wrapWithLogger
} from './deps';
import { sleep } from './utils/async';

async function main() {
  await initAppContext();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(10000);
  }
}

(async () => {
  await main();
})().catch((e) => {
  wrapWithLogger(() => logError(e), {
    outputTypes: [LoggerOutputType.CONSOLE, LoggerOutputType.FILE]
  })();
  terminateCli();
});

export * from './mod';
