import { Dictionary } from '../../types/blockchainCommunication.types';

export type FnCallbacks = ((
  // eslint-disable-next-line @typescript-eslint/ban-types
  targetObj: Function,
  thisArg: any,
  argumentsList: any[]
) => any)[];
export type ObjCallbacks = Dictionary<FnCallbacks | ObjCallbacks>;

export function setupProxy<T extends object>(
  target: T,
  callbacksByProps: ObjCallbacks
): T {
  const propsFns: [string, any][] = [];
  const propsObjs: [string, any][] = [];

  for (const [key, value] of Object.entries(callbacksByProps)) {
    if (key in target) {
      if (typeof value?.length === 'number') {
        // callbacksByPropPath[key] === array of callbacks (i.e., FnCallbacks)
        propsFns.push([key, value]);
      } else {
        // callbacksByPropPath[key] === dictionary (i.e., PropObj)
        propsObjs.push([key, value]);
      }
    }
  }

  let newTarget = target;

  // Then there are properties that are functions which need to be proxied, meaning the
  // object containing this properties (i.e., target), must be proxied with the get handler
  if (propsFns.length > 0) {
    newTarget = buildProxy(newTarget, propsFns);
  }

  // Then there are properties that are objects, which need not to be proxied
  // By having these properties processed after the functions, we ensure we set them
  // either in the original object or a proxy version of that object
  if (propsObjs.length > 0) {
    for (const [key, value] of propsObjs) {
      const elem = newTarget[key as keyof typeof newTarget] as any;
      newTarget[key as keyof typeof newTarget] = setupProxy(elem, value);
    }
  }

  return newTarget;
}

function buildProxy<T extends object>(
  target: T,
  targetProps: [string, any][]
): T {
  // Proxy for target with a Get Handler
  return new Proxy(target, getHandler(targetProps));
}

function getHandler<T extends object>(
  targetProps: [
    string,
    ((targetObj: object, thisArg: any, argumentsList: any[]) => any)[]
  ][]
) {
  return {
    get: (obj: T, prop: string | symbol) => {
      const elem = prop in obj ? obj[prop as keyof typeof obj] : undefined;
      const propString =
        typeof prop === 'symbol' ? (prop as symbol).description || '' : prop;
      const tuple = targetProps.find((p) => p[0] === propString);

      if (tuple !== undefined && typeof elem === 'function') {
        // Proxy for targetProp (function) with an Apply Handler
        return new Proxy(elem, applyHandler(tuple[1]));
      } else {
        return Reflect.get(obj, prop);
      }
    }
  };
}

function applyHandler(
  callbacks: ((targetObj: object, thisArg: any, argumentsList: any[]) => any)[]
) {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-types
    apply: (targetObj: Function, thisArg: any, argumentsList: any[]) => {
      processCallbacks(targetObj, thisArg, argumentsList, callbacks);
      return Reflect.apply(targetObj, thisArg, argumentsList);
    }
  };
}

async function processCallbacks(
  // eslint-disable-next-line @typescript-eslint/ban-types
  targetObj: Function,
  thisArg: any,
  argumentsList: any[],
  callbacks: ((targetObj: object, thisArg: any, argumentsList: any[]) => any)[]
) {
  for (let i = 0; i < callbacks.length; i++) {
    try {
      // Running this sequentially since I do not care about Promise all fail fast mechanism,
      // because each callback is indepent of the others
      await callbacks[i](targetObj, thisArg, argumentsList);
    } catch (e) {
      console.log(
        `Error while processing callback ${
          callbacks[i].name || ''
        } in apply proxy: ${e}`
      );
    }
  }
}
