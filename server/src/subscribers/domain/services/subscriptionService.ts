import { randomUUID } from 'crypto';
import { Dictionary } from 'src/types/types';
import {
  BlockHeader,
  logDebug,
  logWarn,
  Subscription,
  Web3,
  wrapWithLogger
} from '../../../deps';

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

type SubscriptionByChainEvent<T> = {
  subscription: Subscription<BlockHeader>;
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
): Promise<{ subscriptionId: string; callbackId: string }> => {
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
        logDebug(`New subscription on newBlockHeaders, for chain ${chainId}`);
        break;
      default:
        throw new Error(
          `registerSubscription: Unsupported eventType ${eventType}`
        );
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

const addCallbackToSubscription = <T>(
  sub: SubscriptionByChainEvent<T>,
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

const getDataHandlerBlockHeader = (subscriptionKey: string) => {
  return async (data: BlockHeader): Promise<void> => {
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
                  'getDataHandlerBlockHeader async callback: ',
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
            callback.log(logWarn, 'getDataHandlerBlockHeader callback: ', e);
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
