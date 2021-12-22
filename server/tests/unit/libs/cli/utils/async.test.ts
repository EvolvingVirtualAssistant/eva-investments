import { test, assertEquals } from '../../../../wrap/testWrapper';
import { isAsync } from '../../../../../src/libs/cli/utils/async';

test('Should be an async function', () => {
  const asyncFunction = async () => {
    return await 'This is an async function';
  };

  assertEquals(isAsync(asyncFunction), true);
});

test('Generator function should not be an async function', () => {
  const generatorFunction = function* fun() {
    yield 'This is a generator function';
  };

  assertEquals(isAsync(generatorFunction), false);
});

test('Should not be an async function', () => {
  const syncFunction = () => {
    return 'This is a sync function';
  };

  assertEquals(isAsync(syncFunction), false);
});

test('An object should not be an async function', () => {
  assertEquals(isAsync({ name: "I'm not really a function" }), false);
});
