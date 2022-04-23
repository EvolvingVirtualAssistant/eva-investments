import { Dictionary } from 'src/types/types';
import { BlockHeader, Subscription, Web3 } from '../../../deps';

const subscriptions: Dictionary<Subscription<BlockHeader>> = {};

export function subscribeLatestBlock(
  web3: Web3,
  dataHandler: (data: BlockHeader) => void,
  errorHandler?: (error: Error) => void
): Promise<string> {
  const subscription = web3.eth
    .subscribe('newBlockHeaders')
    .on('data', dataHandler);

  // Return promise of subscription id on connected
  return new Promise<string>((resolve, reject) => {
    let connected = false;

    subscription
      .on('connected', (subscriptionId: string) => {
        console.log(`Successfully subscribed ${subscriptionId}`);

        connected = true;
        subscriptions[subscriptionId] = subscription;

        resolve(subscriptionId);
      })
      .on('error', (error: Error) => {
        if (!connected) {
          reject(error);
        } else if (errorHandler != null) {
          errorHandler(error);
        } else {
          defaultErrorHandler(error);
        }
      });
  });
}

export function unsubscribe(subscriptionId: number): void {
  subscriptions[subscriptionId]?.unsubscribe(
    (error: Error, result: boolean) => {
      if (result) {
        console.log(`Successfully unsubscribed - ${subscriptionId}`);
      } else {
        console.log(`Error unsubscribing - ${subscriptionId} - ${error}`);
      }
    }
  );
}

const defaultErrorHandler = (error: Error) => {
  console.log(`Subscription error - ${error}`);
};

/*

add in appContext for testing stuff
let lastBlockTime = Date.now();

  console.log('Test1');
  subscribeLatestBlock(
    appContext.blockchainCommunication!.web3,
    (data: any) => {
      const timestamp: number =
        (typeof data.timestamp === 'number'
          ? data.timestamp
          : Number.parseInt(data.timestamp)) * 1000;
      const timeSinceLastBlock =
        new Date(timestamp - lastBlockTime).getTime() / 1000; // seconds
      const delay = new Date(Date.now() - timestamp).getTime() / 1000; // seconds
      lastBlockTime = timestamp;

      console.log(
        `Data -> Block ${data.number} date - ${new Date(
          timestamp
        )}. Time since last block - ${timeSinceLastBlock}s. Delay - ${delay}s`
      );
    }
  ).then(
    (value: string) => {
      console.log(`app - Successfully subscribed ${value}`);
    },
    (reason: Error) => {
      console.log(`app - Error ${reason}`);
    }
  );
  console.log('Test2');

*/
