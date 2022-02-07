import { pathJoin, readFileSync, ROOT_PATH } from '../../deps';
import { CallbackError } from '../../errors/callbackError';
import { Dictionary } from '../../types/blockchainCommunication.types';
import { attemptImport } from '../../utils/import';
import { isType } from '../../utils/typeGuards';
import { FnCallback, ObjCallbacks } from './proxy';

const importedCallbacksKey = (fnCallbackPath: FnCallbackPath) =>
  `${fnCallbackPath.filePath}_${fnCallbackPath.functionName}`;

const isFnCallbacksPath = (obj: unknown) =>
  isType(obj, ['filePath', 'functionName'], []);

type FnCallbackPath = {
  filePath: string;
  functionName: string;
};
type ObjCallbacksPath = Dictionary<
  FnCallback[] | FnCallbackPath[] | ObjCallbacksPath
>;

export const PROXY_CALLBACKS_PATH_ENV_KEY = 'PROXY_CALLBACKS_PATH';

export async function loadCallbacks(): Promise<ObjCallbacks | undefined> {
  const proxyCallbacksPath = process.env[PROXY_CALLBACKS_PATH_ENV_KEY];

  if (proxyCallbacksPath == null) {
    return undefined;
  }

  const jsonPath = pathJoin(/*'file://', */ ROOT_PATH, proxyCallbacksPath);
  let callbacksByProps = {};
  try {
    callbacksByProps = JSON.parse(
      readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' })
    );
  } catch (err) {
    if (typeof err === 'string') {
      throw new CallbackError(err);
    } else if (err instanceof Error) {
      throw new CallbackError(err.message);
    } else {
      throw new CallbackError(`${err}`);
    }
  }

  const importedCallbacks: Dictionary<FnCallback> = {};
  return await resolveCallbacksImports(callbacksByProps, importedCallbacks);
}

async function resolveCallbacksImports(
  callbacksByProps: ObjCallbacksPath,
  importedCallbacks: Dictionary<FnCallback>
): Promise<ObjCallbacks> {
  const newCallbacksByProps: ObjCallbacks = {};
  for (const [key, value] of Object.entries(callbacksByProps)) {
    if (typeof value?.length === 'number') {
      const tempCallbacks: FnCallback[] = [];
      for (let i = 0; i < value.length; i++) {
        if (isFnCallbacksPath((value as FnCallbackPath[])[i])) {
          const resolvedImport = await resolveImport(
            (value as FnCallbackPath[])[i],
            importedCallbacks
          );
          tempCallbacks.push(resolvedImport);
        }
      }

      if (tempCallbacks.length > 0) {
        newCallbacksByProps[key] = tempCallbacks;
      } else {
        newCallbacksByProps[key] = value as FnCallback[];
      }
    } else {
      newCallbacksByProps[key] = await resolveCallbacksImports(
        value as ObjCallbacksPath,
        importedCallbacks
      );
    }
  }

  return newCallbacksByProps;
}

async function resolveImport(
  fnCallbackPath: FnCallbackPath,
  importedCallbacks: Dictionary<FnCallback>
): Promise<FnCallback> {
  const resolvedImport =
    importedCallbacks[importedCallbacksKey(fnCallbackPath)];
  if (resolvedImport != null) {
    return resolvedImport;
  }

  const imports = await attemptImport(
    pathJoin(/*'file://', */ ROOT_PATH, fnCallbackPath.filePath),
    [fnCallbackPath.functionName],
    {}
  );

  if (imports.length === 0) {
    throw new CallbackError(
      `There was an error importing callback with name ${fnCallbackPath.functionName} from ${fnCallbackPath.filePath}`
    );
  }

  importedCallbacks[importedCallbacksKey(fnCallbackPath)] = imports[0];

  return imports[0];
}
