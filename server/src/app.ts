import { execute } from './deps';
import { sleep } from './utils/async';
import { RootCliAdapter } from './rootCliAdapter';
import { WalletsCliAdapter } from './wallets/drivers/walletsCliAdapter';
import { web3 } from './deps';

/*await execute();

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);
const body = new TextEncoder().encode("Hello World\n");

console.log("EVA Investments Server");
console.log(`Server started on port ${PORT}`);
for await (const req of s) {
  req.respond({ body });
}*/

// Init all cliAdapters
function initCliAdapters() {
  return {
    rootCliAdapter: new RootCliAdapter(),
    walletsCliAdapter: new WalletsCliAdapter()
  };
}

async function main() {
  /*web3.eth.getAccounts().then(console.log);
  web3.eth.subscribe(
    'pendingTransactions',
    (error: Error, transactionHash: string) => {
      console.log("I'm subscribing");
    }
  );*/
  /*web3.eth.subscribe(
    'pendingTransactions',
    (error: Error, transactionHash: string) => {
      console.log("I'm subscribing");
    }
  );*/
  const cliAdapters = initCliAdapters();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(10000);
  }
}

await main();
