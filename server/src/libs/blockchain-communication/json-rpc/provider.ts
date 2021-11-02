import { Web3 } from '../deps.ts';

// This will be specifically for read

// - This will be responsible for seaminglessly configuring different types of providers and all looking like the same
// even if some are not supported by some libraries and others are.
// So no provider should have extra functionalities, they should all do the common things, unless there's a big advantage of
// doing something specific to one provider
// - This will be responsible for controlling metrics (speed of connection, number of accesses to eth nodes (look into infura or other eth nodes providers what are the typically price models and api keys usage restrictions))
// - This will be responsible for choosing the datasource for reading/saving metrics, API Keys, Eth nodes URLs
// - This will be responsible for dynamically adjusting the provider to connect to, depending on the outcome of the metrics,
// thus optimizing the speed of connection

export class Provider {
  private web3Provider;

  constructor() {
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

    this.web3Provider = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
    this.web3Provider.eth.getAccounts().then(console.log);

    const a = 0;
  }
}
