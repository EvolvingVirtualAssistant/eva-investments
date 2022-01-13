import {
  execute,
  BlockchainCommunication,
  initCli,
  terminateCli
} from './deps';
import { sleep } from './utils/async';
import { RootCliAdapter } from './rootCliAdapter';
import { WalletsCliAdapter } from './wallets/drivers/walletsCliAdapter';
import { NodesConfigFileAdapter } from './node-providers/driven/data-sources/nodesConfigFileAdapter';
import { NodesMemoryAdapter } from './node-providers/driven/data-sources/nodesMemoryAdapter';

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
  initCli();
  return {
    rootCliAdapter: new RootCliAdapter(),
    walletsCliAdapter: new WalletsCliAdapter()
  };
}

function initWeb3() {
  const blockchainCommunication = new BlockchainCommunication(
    NodesConfigFileAdapter.getInstance(),
    NodesMemoryAdapter.getInstance()
  );

  return blockchainCommunication.web3;
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

  const web3 = initWeb3();

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
