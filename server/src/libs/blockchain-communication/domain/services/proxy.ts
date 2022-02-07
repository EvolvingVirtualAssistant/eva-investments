import { ProxyError } from '../../errors/proxyError';
import { Dictionary } from '../../types/blockchainCommunication.types';

export type FnCallback = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  targetObj: Function,
  thisArg: any,
  argumentsList: any[]
) => any;
export type ObjCallbacks = Dictionary<FnCallback[] | ObjCallbacks>;

const RETURN_SUFFIX = 'return|';

interface PropFn {
  name: string;
  callbacks?: FnCallback[];
  callbacksByProps?: ObjCallbacks;
}
interface PropObj {
  name: string;
  callbacksByProps: ObjCallbacks;
}

export function setupProxy<T extends object>(
  target: T,
  callbacksByProps: ObjCallbacks
): T {
  const propsFns: PropFn[] = [];
  const propsObjs: PropObj[] = [];

  for (const [key, value] of Object.entries(callbacksByProps)) {
    if (key in target) {
      if (typeof value?.length !== 'number') {
        propsObjs.push({ name: key, callbacksByProps: value as ObjCallbacks });
      } else {
        const propFn = propsFns.find((prop) => prop.name === key);

        if (propFn != null) {
          if (propFn.callbacks == null) {
            propFn.callbacks = value as FnCallback[];
          } else {
            throw new ProxyError(`Duplicated key ${key}`);
          }
        } else {
          propsFns.push({
            name: key,
            callbacks: value as FnCallback[]
          });
        }
      }
    } else {
      const returnKey = key?.replace(RETURN_SUFFIX, '');
      if (returnKey in target) {
        // If this contains a RETURN_SUFFIX, then the return of calling
        // this field identified by key must be proxied

        const propFn = propsFns.find((prop) => prop.name === returnKey);

        if (propFn != null) {
          if (propFn.callbacksByProps == null) {
            propFn.callbacksByProps = value as ObjCallbacks;
          } else {
            throw new ProxyError(`Duplicated key ${key}`);
          }
        } else {
          propsFns.push({
            name: returnKey,
            callbacksByProps: value as ObjCallbacks
          });
        }
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
    for (const propObj of propsObjs) {
      const elem = newTarget[propObj.name as keyof typeof newTarget] as any;
      newTarget[propObj.name as keyof typeof newTarget] = setupProxy(
        elem,
        propObj.callbacksByProps
      );
    }
  }

  return newTarget;
}

function buildProxy<T extends object>(target: T, targetProps: PropFn[]): T {
  // Proxy for target with a Get Handler
  return new Proxy(target, getHandler(targetProps));
}

function getHandler<T extends object>(targetProps: PropFn[]) {
  return {
    get: (obj: T, prop: string | symbol) => {
      const elem = prop in obj ? obj[prop as keyof typeof obj] : undefined;
      const propString =
        typeof prop === 'symbol' ? (prop as symbol).description || '' : prop;
      const propFn = targetProps.find((p) => p.name === propString);

      if (propFn !== undefined && typeof elem === 'function') {
        return new Proxy(elem, {
          ...constructorHandler(propFn),
          ...applyHandler(propFn)
        });
      } else {
        return Reflect.get(obj, prop);
      }
    }
  };
}

function constructorHandler(propFn: PropFn) {
  if (propFn.callbacks != null) {
    return {
      construct: (
        // eslint-disable-next-line @typescript-eslint/ban-types
        target: Function,
        argumentsList: any[],
        // eslint-disable-next-line @typescript-eslint/ban-types
        newTarget: Function
      ) => {
        processCallbacks(
          target,
          newTarget,
          argumentsList,
          propFn.callbacks || []
        );
        const newObj = Reflect.construct(target, argumentsList, newTarget);
        return setupProxy(newObj, propFn.callbacksByProps || {});
      }
    };
  }

  return {
    construct: (
      // eslint-disable-next-line @typescript-eslint/ban-types
      target: Function,
      argumentsList: any[],
      // eslint-disable-next-line @typescript-eslint/ban-types
      newTarget: Function
    ) => {
      const newObj = Reflect.construct(target, argumentsList, newTarget);
      return setupProxy(newObj, propFn.callbacksByProps || {});
    }
  };
}

function applyHandler(propFn: PropFn) {
  if (propFn.callbacksByProps != null) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-types
      apply: (targetObj: Function, thisArg: any, argumentsList: any[]) => {
        processCallbacks(
          targetObj,
          thisArg,
          argumentsList,
          propFn.callbacks || []
        );

        const newTarget = Reflect.apply(targetObj, thisArg, argumentsList);
        return setupProxy(newTarget, propFn.callbacksByProps || {});
      }
    };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/ban-types
    apply: (targetObj: Function, thisArg: any, argumentsList: any[]) => {
      processCallbacks(
        targetObj,
        thisArg,
        argumentsList,
        propFn.callbacks || []
      );
      return Reflect.apply(targetObj, thisArg, argumentsList);
    }
  };
}

async function processCallbacks(
  // eslint-disable-next-line @typescript-eslint/ban-types
  targetObj: Function,
  thisArg: any,
  argumentsList: any[],
  callbacks: FnCallback[]
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
