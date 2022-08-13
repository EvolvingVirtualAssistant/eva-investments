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
  isAsyncCallback: boolean;
  skipOnUnfinishedEvent: boolean;
  lastEventFinished: boolean;
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
  skipOnUnfinishedEvent = false,
  isAsyncCallback: boolean,
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
        console.log(
          `New subscription on newBlockHeaders, for chain ${chainId}`
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

  addCallbackToSubscription(
    sub,
    priority,
    skipOnUnfinishedEvent,
    isAsyncCallback,
    callback,
    ...args
  );
};

const addCallbackToSubscription = <T>(
  sub: SubscriptionByChainEvent<T>,
  priority: number,
  skipOnUnfinishedEvent: boolean,
  isAsyncCallback: boolean,
  callback: (event: T, ...args: any[]) => any,
  ...args: any[]
): void => {
  let inserted = false;
  for (let i = 0; !inserted && i < sub.callbacks.length; i++) {
    if (priority < sub.callbacks[i][0].priority) {
      const removedElems = sub.callbacks.splice(i, sub.callbacks.length - i, [
        {
          callback,
          args,
          priority,
          skipOnUnfinishedEvent,
          isAsyncCallback,
          lastEventFinished: true
        }
      ]);
      sub.callbacks = sub.callbacks.concat(removedElems);
      inserted = true;
    } else if (sub.callbacks[i][0].priority === priority) {
      sub.callbacks[i].push({
        callback,
        args,
        priority,
        skipOnUnfinishedEvent,
        isAsyncCallback,
        lastEventFinished: true
      });
      inserted = true;
    }
  }

  if (!inserted) {
    sub.callbacks.push([
      {
        callback,
        args,
        priority,
        skipOnUnfinishedEvent,
        isAsyncCallback,
        lastEventFinished: true
      }
    ]);
  }
};

const getDataHandlerBlockHeader = (subscriptionKey: string) => {
  return async (data: BlockHeader): Promise<void> => {
    const sub = subscriptionsByChainEvent[subscriptionKey];

    if (sub == null) {
      return;
    }

    for (let i = 0; i < sub.callbacks.length; i++) {
      const promsByPriority: Promise<any>[] = [];

      sub.callbacks[i]
        .filter(
          ({ skipOnUnfinishedEvent, lastEventFinished }) =>
            !skipOnUnfinishedEvent ||
            (skipOnUnfinishedEvent && lastEventFinished)
        )
        .forEach((callback) => {
          callback.lastEventFinished = false;

          if (callback.isAsyncCallback) {
            const prom = callback
              .callback(data, ...callback.args)
              .catch((reason: any) =>
                console.error(
                  'getDataHandlerBlockHeader async callback: ',
                  reason
                )
              )
              .finally(() => {
                callback.lastEventFinished = true;
              });
            promsByPriority.push(prom);
            return;
          }

          try {
            promsByPriority.push(
              Promise.resolve(callback.callback(data, ...callback.args))
            );
          } catch (e) {
            console.error('getDataHandlerBlockHeader callback: ', e);
            promsByPriority.push(Promise.reject(e));
          } finally {
            callback.lastEventFinished = true;
          }
        });
      await Promise.allSettled(promsByPriority);
    }
  };
};
