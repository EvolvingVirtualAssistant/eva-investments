import { initAppContext } from './appContext';
import { terminateCli } from './deps';
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
  console.log(e);
  terminateCli();
});

export * from './mod';
