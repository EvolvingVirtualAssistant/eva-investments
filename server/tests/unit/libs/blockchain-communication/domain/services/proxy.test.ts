import { assertEquals, fail } from 'https://deno.land/std/testing/asserts.ts';
import { setupProxy } from '../../../../../../src/libs/blockchain-communication/domain/services/proxy.ts';
import { sleep } from '../../../../../../src/utils/async.ts';

class MockClass {
  calledFn1Count = 0;
  calledFn1Args: any[] = [];
  calledCallbacks: string[] = [];

  callbacksFinished = false;

  prop1: InnerMockClass = new InnerMockClass();

  fn1(_numArg: number, _stringArg: string): boolean {
    return true;
  }
}

class InnerMockClass {
  calledInnerFn1Count = 0;
  calledInnerFn1Args: any[] = [];
  calledCallbacks: string[] = [];

  callbacksFinished = false;

  innerProp1 = 'Inner Prop 1';

  innerFn1(_booleanArg: boolean): boolean {
    return true;
  }
}

const TIMEOUT = 60000;

function setCallbackPropsInMockObj(
  callbackName: string,
  fn: Function,
  mockObj: any,
  fnArgs: any[]
) {
  if (fn.name === 'fn1') {
    mockObj['calledFn1Count'] += 1;
    mockObj['calledFn1Args'].push(...fnArgs);
    mockObj['calledCallbacks'].push(callbackName);
  } else if (fn.name === 'innerFn1') {
    mockObj['calledInnerFn1Count'] += 1;
    mockObj['calledInnerFn1Args'].push(...fnArgs);
    mockObj['calledCallbacks'].push(callbackName);
  }
}

const mockSyncFn = (arg1: Function, arg2: any, arg3: any[]) => {
  setCallbackPropsInMockObj('mockSyncFn', arg1, arg2, arg3);
};
const mockAsyncFn = async (arg1: Function, arg2: any, arg3: any[]) => {
  await sleep(50);
  setCallbackPropsInMockObj('mockAsyncFn', arg1, arg2, arg3);
};
const mockSyncThrowErrorFn = (arg1: Function, arg2: any, arg3: any[]) => {
  setCallbackPropsInMockObj('mockSyncThrowErrorFn', arg1, arg2, arg3);
  throw mockError;
};
const mockAsyncThrowErrorFn = async (
  arg1: Function,
  arg2: any,
  arg3: any[]
) => {
  await sleep(50);
  setCallbackPropsInMockObj('mockAsyncThrowErrorFn', arg1, arg2, arg3);
  throw mockError;
};
const lastCallback = (arg1: Function, arg2: any, arg3: any[]) => {
  arg2['callbacksFinished'] = true;
};

const mockError = new Error('Mock Error Message');

function assertUnmodifiedObj(obj1: MockClass, obj2: MockClass): void {
  assertEquals(obj1, obj2);
  assertEquals(obj1.calledCallbacks.length, 0);
  assertEquals(obj1.prop1.calledCallbacks.length, 0);
  assertEquals(obj2.calledCallbacks.length, 0);
  assertEquals(obj2.prop1.calledCallbacks.length, 0);
}

Deno.test(
  'Should not setup proxy for properties if callbacks are empty',
  () => {
    const mockObj = new MockClass();
    const proxyMockObj = setupProxy(mockObj, {});
    assertUnmodifiedObj(proxyMockObj, mockObj);
  }
);

Deno.test('Should not setup proxy for missing properties', () => {
  const callbacksByProps = {
    missingProp: [mockSyncFn, mockSyncThrowErrorFn],
  };
  const mockObj = new MockClass();
  const proxyMockObj = setupProxy(mockObj, callbacksByProps);
  assertUnmodifiedObj(proxyMockObj, mockObj);
});

async function waitForLastCallback(obj: MockClass | InnerMockClass) {
  // Wait for last callback
  const currTime = Date.now();
  while (!obj.callbacksFinished) {
    await sleep(100);
    if (Date.now() - currTime > TIMEOUT) {
      fail('Failed in waitForLastCallback');
    }
  }
}

async function callAndAssertFn1(proxyMockObj: MockClass) {
  assertEquals(proxyMockObj.calledCallbacks.length, 0);
  assertEquals(proxyMockObj.calledFn1Count, 0);
  assertEquals(proxyMockObj.calledFn1Args.length, 0);

  proxyMockObj.fn1(1, '2');

  await waitForLastCallback(proxyMockObj);

  assertEquals(proxyMockObj.calledCallbacks.length, 2);
  assertEquals(proxyMockObj.calledCallbacks.includes('mockAsyncFn'), true);
  assertEquals(
    proxyMockObj.calledCallbacks.includes('mockAsyncThrowErrorFn'),
    true
  );
  assertEquals(proxyMockObj.calledFn1Count, 2);
  assertEquals(proxyMockObj.calledFn1Args.length, 4);
  assertEquals(proxyMockObj.calledFn1Args[0], 1);
  assertEquals(proxyMockObj.calledFn1Args[1], '2');
  assertEquals(proxyMockObj.calledFn1Args[2], 1);
  assertEquals(proxyMockObj.calledFn1Args[3], '2');
}

async function callAndAssertInnerFn1(proxyMockObj: MockClass) {
  assertEquals(proxyMockObj.prop1.calledCallbacks.length, 0);
  assertEquals(proxyMockObj.prop1.calledInnerFn1Count, 0);
  assertEquals(proxyMockObj.prop1.calledInnerFn1Args.length, 0);

  proxyMockObj.prop1.innerFn1(false);

  await waitForLastCallback(proxyMockObj.prop1);

  assertEquals(proxyMockObj.prop1.calledCallbacks.length, 2);
  assertEquals(proxyMockObj.prop1.calledCallbacks.includes('mockSyncFn'), true);
  assertEquals(
    proxyMockObj.prop1.calledCallbacks.includes('mockSyncThrowErrorFn'),
    true
  );
  assertEquals(proxyMockObj.prop1.calledInnerFn1Count, 2);
  assertEquals(proxyMockObj.prop1.calledInnerFn1Args.length, 2);
  assertEquals(proxyMockObj.prop1.calledInnerFn1Args[0], false);
  assertEquals(proxyMockObj.prop1.calledInnerFn1Args[1], false);
}

Deno.test(
  'Should setup proxy on existing props and call specified callbacks',
  async () => {
    const callbacksByProps = {
      prop1: {
        innerFn1: [mockSyncFn, mockSyncThrowErrorFn, lastCallback],
      },
      fn1: [mockAsyncFn, mockAsyncThrowErrorFn, lastCallback],
    };
    const mockObj = new MockClass();
    const proxyMockObj = setupProxy(mockObj, callbacksByProps);
    await callAndAssertFn1(proxyMockObj);
    await callAndAssertInnerFn1(proxyMockObj);
  }
);
