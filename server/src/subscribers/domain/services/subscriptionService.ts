import { randomUUID } from 'crypto';
import { Dictionary } from 'src/types/types';
import {
  logDebug,
  logWarn,
  Web3Subscription,
  Web3,
  wrapWithLogger,
  BlockHeaderOutput,
  HexString,
  Web3EventMap
} from '../../../deps';

/**
 * @deprecated
 */
const subscriptions: Dictionary<Web3Subscription<{ data: BlockHeaderOutput }>> =
  {};

export interface CustomSubscription<T> {
  eventType: string;
  eventHandler: (event: T) => Promise<void>;
  errorHandler: (error: Error) => void;
  unsubscribe: (
    callback?: ((error: Error, result: boolean) => void) | undefined
  ) => void;
}

const customEventsSubs: Dictionary<CustomSubscription<any>> = {};

export const subscribeLatestBlock = (
  web3: Web3,
  dataHandler: (data: BlockHeaderOutput) => void,
  errorHandler?: (error: Error) => void
): Promise<Web3Subscription<{ data: BlockHeaderOutput }>> => {
  return web3.eth.subscribe('newBlockHeaders').then((subscription) => {
    subscription.on('data', dataHandler);

    // Return promise of subscription on connected
    return new Promise<Web3Subscription<{ data: BlockHeaderOutput }>>(
      (resolve, reject) => {
        let connected = false;

        subscription.on('connected', (subscriptionId: number) => {
          connected = true;
          subscriptions[subscriptionId] = subscription;

          resolve(subscription);
        });
        subscription.on('error', (error: Error) => {
          if (!connected) {
            reject(error);
          } else if (errorHandler != null) {
            errorHandler(error);
          } else {
            defaultErrorHandler(error);
          }
        });
      }
    );
  });

  // Return promise of subscription on connected
  /*return new Promise<Subscription<BlockHeader>>((resolve, reject) => {
    let connected = false;

    subscription.on('connected', (subscriptionId: string) => {
      connected = true;
      subscriptions[subscriptionId] = subscription;

      resolve(subscription);
    });
    subscription.on('error', (error: Error) => {
      if (!connected) {
        reject(error);
      } else if (errorHandler != null) {
        errorHandler(error);
      } else {
        defaultErrorHandler(error);
      }
    });
  });*/
};

const subscribePendingTransaction = (
  web3: Web3,
  dataHandler: (data: string) => void,
  errorHandler?: (error: Error) => void
): Promise<Web3Subscription<{ data: HexString }>> => {
  return web3.eth.subscribe('pendingTransactions').then((subscription) => {
    subscription.on('data', dataHandler);

    // Return promise of subscription on connected
    return new Promise<Web3Subscription<{ data: HexString }>>(
      (resolve, reject) => {
        let connected = false;

        subscription.on('connected', (subscriptionId: number) => {
          connected = true;
          resolve(subscription);
        });
        subscription.on('error', (error: Error) => {
          if (!connected) {
            reject(error);
          } else if (errorHandler != null) {
            errorHandler(error);
          } else {
            defaultErrorHandler(error);
          }
        });
      }
    );
  });
};

const subscribeCustomEvent = <T>(
  chainId: string,
  eventType: string,
  eventHandler: (data: T) => Promise<void>,
  errorHandler?: (error: Error) => void
): CustomSubscription<T> => {
  const key = getSubscriptionByChainEventKey(chainId, eventType);
  let eventSub = customEventsSubs[key];

  if (eventSub != null) {
    throw new Error(
      `Unable to subscribe to event ${eventType} for chain ${chainId}. A subscription for this event already exists`
    );
  }

  eventSub = {
    eventType,
    eventHandler,
    errorHandler: errorHandler != null ? errorHandler : defaultErrorHandler,
    unsubscribe: (callback?: (error: Error, result: boolean) => void) => {
      delete customEventsSubs[key];
      callback?.(new Error(), true);
    }
  };
  customEventsSubs[key] = eventSub;

  return eventSub;
};

export const emitCustomEvent = (
  chainId: string,
  eventType: string,
  event: any
) => {
  const key = getSubscriptionByChainEventKey(chainId, eventType);
  const customSub = customEventsSubs[key];

  if (customSub == null) {
    logWarn(
      `Failed to emit event ${event}. Unable to find subscription for event ${eventType} and chain ${chainId}`
    );
    return;
  }

  customSub.eventHandler(event);
};

export const unsubscribe = async (subscriptionId: string, force = false) => {
  const sub = subscriptionsByChainEvent[subscriptionId];
  if (!sub) {
    return;
  }

  if (!force) {
    sub.shouldTerminate = true;
    await new Promise((resolve, reject) => {
      sub.terminate = resolve;
    });
  }

  await sub.subscription.unsubscribe((error: Error, result: boolean) => {
    if (result) {
      delete subscriptionsByChainEvent[subscriptionId];
      logDebug(`Successfully unsubscribed - ${subscriptionId}`);
    } else {
      logWarn(`Error unsubscribing - ${subscriptionId} - ${error}`);
    }
  });
};

const defaultErrorHandler = (error: Error) => {
  logWarn(`Subscription error - ${error}`);
};

// ---------------- Register callbacks for chainId and event type ----------------

type SubscriptionByChainEvent<T, S extends Web3EventMap> = {
  subscription: Web3Subscription<S> | CustomSubscription<S>;
  callbacks: Callback<T>[][];
  shouldTerminate: boolean;
  terminate?: (value: unknown) => void;
};

type Callback<T> = {
  id: string;
  callback: (event: T, ...args: any[]) => any;
  args: any[];
  priority: number;
  isAsyncCallback: boolean;
  skipOnUnfinishedEvent: boolean;
  lastEventFinished: boolean;
  terminated: boolean;
  log: (
    logFn: (message?: any, ...optionalParams: any[]) => void,
    message?: any,
    ...optionalParams: any[]
  ) => void;
};

const getSubscriptionByChainEventKey = (
  chainId: string,
  eventType: string
): string => chainId + eventType;
const subscriptionsByChainEvent: Dictionary<
  SubscriptionByChainEvent<any, any>
> = {};

export const registerSubscription = async <T>(
  web3: Web3,
  chainId: string,
  eventType: string,
  priority = Number.MAX_SAFE_INTEGER,
  skipOnUnfinishedEvent = false,
  isAsyncCallback: boolean,
  callback: (event: T, ...args: any[]) => any,
  ...args: any[]
): Promise<{ subscriptionId: string; callbackId: string }> => {
  const key = getSubscriptionByChainEventKey(chainId, eventType);

  let sub = subscriptionsByChainEvent[key];
  if (sub == null) {
    let subscription;
    switch (eventType) {
      case 'newBlockHeaders':
        subscription = await subscribeLatestBlock(web3, getDataHandler(key));
        logDebug(`New subscription on newBlockHeaders, for chain ${chainId}`);
        break;
      case 'pendingTransactions':
        subscription = await subscribePendingTransaction(
          web3,
          getDataHandler(key)
        );
        logDebug(
          `New subscription on pendingTransactions, for chain ${chainId}`
        );
        break;
      default:
        subscription = await subscribeCustomEvent(
          chainId,
          eventType,
          getDataHandler(key)
        );
        logDebug(`New subscription on ${eventType}, for chain ${chainId}`);
        break;
    }

    sub = {
      subscription,
      callbacks: [],
      shouldTerminate: false
    };
    subscriptionsByChainEvent[key] = sub;
  }

  const callbackId = addCallbackToSubscription(
    sub,
    priority,
    skipOnUnfinishedEvent,
    isAsyncCallback,
    callback,
    ...args
  );

  return { subscriptionId: key, callbackId };
};

const addCallbackToSubscription = <T, S extends Web3EventMap>(
  sub: SubscriptionByChainEvent<T, S>,
  priority: number,
  skipOnUnfinishedEvent: boolean,
  isAsyncCallback: boolean,
  callback: (event: T, ...args: any[]) => any,
  ...args: any[]
): string => {
  let inserted = false;
  const id = randomUUID();

  const log = wrapWithLogger(
    (
      logFn: (message?: any, ...optionalParams: any[]) => void,
      message?: any,
      ...optionalParams: any[]
    ) => {
      logFn(message, ...optionalParams);
    }
  );
  for (let i = 0; !inserted && i < sub.callbacks.length; i++) {
    if (priority < sub.callbacks[i][0].priority) {
      const removedElems = sub.callbacks.splice(i, sub.callbacks.length - i, [
        {
          id,
          callback,
          args,
          priority,
          skipOnUnfinishedEvent,
          isAsyncCallback,
          lastEventFinished: true,
          terminated: false,
          log
        }
      ]);
      sub.callbacks = sub.callbacks.concat(removedElems);
      inserted = true;
    } else if (sub.callbacks[i][0].priority === priority) {
      sub.callbacks[i].push({
        id,
        callback,
        args,
        priority,
        skipOnUnfinishedEvent,
        isAsyncCallback,
        lastEventFinished: true,
        terminated: false,
        log
      });
      inserted = true;
    }
  }

  if (!inserted) {
    sub.callbacks.push([
      {
        id,
        callback,
        args,
        priority,
        skipOnUnfinishedEvent,
        isAsyncCallback,
        lastEventFinished: true,
        terminated: false,
        log
      }
    ]);
  }

  return id;
};

export const unregisterCallback = (
  subscriptionId: string,
  callbackId: string
) => {
  const sub = subscriptionsByChainEvent[subscriptionId];

  if (!sub) {
    return;
  }

  sub.callbacks = sub.callbacks.map((callbacks) => {
    return callbacks.filter((callback) => callback.id !== callbackId);
  });
};

const getDataHandler = <S>(subscriptionKey: string) => {
  return async (data: S): Promise<void> => {
    const sub = subscriptionsByChainEvent[subscriptionKey];

    if (sub == null) {
      return;
    }

    let callbacksByPriorityTerminated = 0;
    for (let i = 0; i < sub.callbacks.length; i++) {
      const promsByPriority: Promise<any>[] = [];

      sub.callbacks[i]
        .filter(({ terminated }) => !terminated)
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
              .catch((reason: any) => {
                callback.log(
                  logWarn,
                  'getDataHandler async callback: ',
                  reason
                );
              })
              .finally(() => {
                callback.lastEventFinished = true;
                if (sub.shouldTerminate) {
                  callback.terminated = true;
                }
              });
            promsByPriority.push(prom);
            return;
          }

          try {
            promsByPriority.push(
              Promise.resolve(callback.callback(data, ...callback.args))
            );
          } catch (e) {
            callback.log(logWarn, 'getDataHandler callback: ', e);
            promsByPriority.push(Promise.reject(e));
          } finally {
            callback.lastEventFinished = true;
            if (sub.shouldTerminate) {
              callback.terminated = true;
            }
          }
        });
      await Promise.allSettled(promsByPriority);
      callbacksByPriorityTerminated =
        callbacksByPriorityTerminated + (promsByPriority.length === 0 ? 1 : 0);
    }

    if (
      sub.shouldTerminate &&
      callbacksByPriorityTerminated === sub.callbacks.length
    ) {
      sub.terminate?.('');
      sub.terminate = undefined;
    }
  };
};
