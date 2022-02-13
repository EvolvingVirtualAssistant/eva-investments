import {
  test,
  assertEquals,
  assertThrowsAsync
} from '../../../../../wrap/testWrapper';
import {
  PROXY_CALLBACKS_PATH_ENV_KEY,
  loadCallbacks
} from '../../../../../../src/libs/blockchain-communication/domain/services/callbacksLoader';
import { CallbackError } from '../../../../../../src/libs/blockchain-communication/errors/callbackError';
import {
  FnCallback,
  ObjCallbacks
} from '../../../../../../src/libs/blockchain-communication/domain/services/proxy';
import { testFunc1 } from '../../../../../resources/libs/blockchain-communication/dynamicImportSample';

const originalProxyCallbacksEnvKey = process.env[PROXY_CALLBACKS_PATH_ENV_KEY];
const resourcesDirPath = '/tests/resources/libs/blockchain-communication';

function clearContext() {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] = originalProxyCallbacksEnvKey;
}

test('Should not load callbacks if env variable with callbacks file path is not set', async () => {
  delete process.env[PROXY_CALLBACKS_PATH_ENV_KEY];

  const callbacks = await loadCallbacks();

  assertEquals(callbacks, undefined);

  clearContext();
});

test('Should not load callbacks if callbacks file path does not exist', async () => {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] = '/missing/path';

  await assertThrowsAsync(
    loadCallbacks,
    CallbackError,
    'no such file or directory'
  );

  clearContext();
});

test('Should not load callbacks if callbacks file is not a valid JSON', async () => {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] =
    resourcesDirPath + '/invalidCallbacks.json';

  await assertThrowsAsync(loadCallbacks, CallbackError, 'Unexpected token');

  clearContext();
});

test('Should not load callbacks if one of the dynamic imports is not found', async () => {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] =
    resourcesDirPath + '/invalidCallbacksImports.json';

  await assertThrowsAsync(
    loadCallbacks,
    CallbackError,
    'There was an error importing callback'
  );

  clearContext();
});

test('Should load empty callbacks if callbacks file has no callbacks', async () => {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] =
    resourcesDirPath + '/emptyCallbacks.json';

  const callbacks = await loadCallbacks();

  assertEquals(Object.keys(callbacks!).length, 0);

  clearContext();
});

test('Should load callbacks', async () => {
  process.env[PROXY_CALLBACKS_PATH_ENV_KEY] =
    resourcesDirPath + '/proxyCallbacks.json';

  const callbacks = await loadCallbacks();

  assertEquals(callbacks !== undefined, true);
  assertEquals(typeof callbacks?.prop1.length !== 'number', true);
  assertEquals((callbacks?.prop1 as ObjCallbacks).innerFn1.length, 1);
  assertEquals(
    typeof ((callbacks?.prop1 as ObjCallbacks).innerFn1 as FnCallback[])[0],
    'function'
  );
  assertEquals(
    ((callbacks?.prop1 as ObjCallbacks).innerFn1 as FnCallback[])[0],
    testFunc1
  );

  clearContext();
});
