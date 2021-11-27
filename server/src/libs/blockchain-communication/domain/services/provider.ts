import { Web3 } from '../../deps.ts';

// This will be specifically for read

// - This will be responsible for seaminglessly configuring different types of providers and all looking like the same
// even if some are not supported by some libraries and others are.
// So no provider should have extra functionalities, they should all do the common things, unless there's a big advantage of
// doing something specific to one provider

export class Provider {
  private static instance: Provider;

  private clientLib: Web3 = new Web3();

  private constructor() {
    /*var options = {
      keepAlive: true,
      withCredentials: false,
      timeout: 20000, // ms
      headers: [
        {
          name: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
      agent: {
        http: http.Agent(...),
        baseUrl: '',
      },
    };*/
    /*this.web3Provider = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
    this.web3Provider.eth.getAccounts().then(console.log);

    const a = 0;*/
  }

  static getInstance(): Provider {
    if (!Provider.instance) {
      Provider.instance = new Provider();
    }

    return Provider.instance;
  }

  setBlockchainClientLib(clientLib: Web3) {
    this.clientLib = clientLib;
  }
}
