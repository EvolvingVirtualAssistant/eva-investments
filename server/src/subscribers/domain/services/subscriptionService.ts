import { Dictionary } from 'src/types/types';
import { BlockHeader, Subscription, Web3 } from '../../../deps';

/**
 * @deprecated
 */
const subscriptions: Dictionary<Subscription<BlockHeader>> = {};

export const subscribeLatestBlock = (
  web3: Web3,
  dataHandler: (data: BlockHeader) => void,
  errorHandler?: (error: Error) => void
): Promise<Subscription<BlockHeader>> => {
  const subscription = web3.eth
    .subscribe('newBlockHeaders')
    .on('data', dataHandler);

  // Return promise of subscription on connected
  return new Promise<Subscription<BlockHeader>>((resolve, reject) => {
    let connected = false;

    subscription
      .on('connected', (subscriptionId: string) => {
        console.log(`Successfully subscribed ${subscriptionId}`);

        connected = true;
        subscriptions[subscriptionId] = subscription;

        resolve(subscription);
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
};

export const unsubscribe = (subscriptionId: number): void => {
  subscriptions[subscriptionId]?.unsubscribe(
    (error: Error, result: boolean) => {
      if (result) {
        console.log(`Successfully unsubscribed - ${subscriptionId}`);
      } else {
        console.log(`Error unsubscribing - ${subscriptionId} - ${error}`);
      }
    }
  );
};

const defaultErrorHandler = (error: Error) => {
  console.log(`Subscription error - ${error}`);
};

// ---------------- Register callbacks for chainId and event type ----------------

type SubscriptionByChainEvent<T> = {
  subscription: Subscription<BlockHeader>;
  callbacks: Callback<T>[][];
};

type Callback<T> = {
  callback: (event: T, ...args: any[]) => any;
  args: any[];
  priority: number;
};

const getSubscriptionByChainEventKey = (
  chainId: number,
  eventType: string
): string => chainId + eventType;
const subscriptionsByChainEvent: Dictionary<SubscriptionByChainEvent<any>> = {};

export const registerSubscription = async <T>(
  web3: Web3,
  chainId: number,
  eventType: string,
  priority = Number.MAX_SAFE_INTEGER,
  callback: (event: T, ...args: any[]) => any,
  ...args: any[]
): Promise<void> => {
  const key = getSubscriptionByChainEventKey(chainId, eventType);

  let sub = subscriptionsByChainEvent[key];
  if (sub == null) {
    let subscription;
    switch (eventType) {
      case 'newBlockHeaders':
        subscription = await subscribeLatestBlock(
          web3,
          getDataHandlerBlockHeader(key)
        );
        break;
      default:
        throw new Error(
          `registerSubscription: Unsupported eventType ${eventType}`
        );
    }

    sub = {
      subscription,
      callbacks: []
    };
    subscriptionsByChainEvent[key] = sub;
  }

  addCallbackToSubscription(sub, priority, callback, ...args);
};

const addCallbackToSubscription = <T>(
  sub: SubscriptionByChainEvent<T>,
  priority: number,
  callback: (event: T, ...args: any[]) => any,
  ...args: any[]
): void => {
  let inserted = false;
  for (let i = 0; !inserted && i < sub.callbacks.length; i++) {
    if (priority < sub.callbacks[i][0].priority) {
      const removedElems = sub.callbacks.splice(i, sub.callbacks.length - i, [
        { callback, args, priority }
      ]);
      sub.callbacks = sub.callbacks.concat(removedElems);
      inserted = true;
    } else if (sub.callbacks[i][0].priority === priority) {
      sub.callbacks[i].push({ callback, args, priority });
      inserted = true;
    }
  }

  if (!inserted) {
    sub.callbacks.push([{ callback, args, priority }]);
  }
};

const getDataHandlerBlockHeader =
  (subscriptionKey: string) =>
  async (data: BlockHeader): Promise<void> => {
    const sub = subscriptionsByChainEvent[subscriptionKey];

    if (sub == null) {
      return;
    }

    for (let i = 0; i < sub.callbacks.length; i++) {
      await Promise.allSettled(
        sub.callbacks[i].map(({ callback, args }) => callback(data, ...args))
      );
    }
  };
