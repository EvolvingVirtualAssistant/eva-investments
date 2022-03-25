import { test, fail, assertEquals } from '../../../../../wrap/testWrapper';
import { setupProxy } from '../../../../../../src/libs/blockchain-communication/domain/services/proxy';
import { sleep } from '../../../../../../src/utils/async';

class MockClass {
  calledFn1Count = 0;
  calledFn1Args: any[] = [];
  calledCallbacks: string[] = [];

  callbacksFinished = false;

  prop1: InnerMockClass = new InnerMockClass();

  InnerMockClass = InnerMockClass;

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

  static calledInnerMockClassCount = 0;
  static calledInnerMockClassArgs: any[] = [];
  static calledInnerMockCallbacks: string[] = [];

  constructor(_numArg?: number, _stringArg?: string) {
    // nothing to do here
  }

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
  } else if (fn.name === 'InnerMockClass') {
    mockObj['calledInnerMockClassCount'] += 1;
    mockObj['calledInnerMockClassArgs'].push(...fnArgs);
    mockObj['calledInnerMockCallbacks'].push(callbackName);
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

test('Should not setup proxy for properties if callbacks are empty', () => {
  const mockObj = new MockClass();
  const proxyMockObj = setupProxy(mockObj, {});
  assertUnmodifiedObj(proxyMockObj, mockObj);
});

test('Should not setup proxy for missing properties', () => {
  const callbacksByProps = {
    missingProp: [mockSyncFn, mockSyncThrowErrorFn]
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

async function callAndAssertInnerMockClass(
  proxyMockObj: MockClass
): Promise<InnerMockClass> {
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockCallbacks.length, 0);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassCount, 0);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs.length, 0);

  const innerMock = new proxyMockObj.InnerMockClass(1, '2');

  await waitForLastCallback(
    proxyMockObj.InnerMockClass as unknown as InnerMockClass
  );

  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockCallbacks.length, 2);
  assertEquals(
    proxyMockObj.InnerMockClass.calledInnerMockCallbacks.includes(
      'mockAsyncFn'
    ),
    true
  );
  assertEquals(
    proxyMockObj.InnerMockClass.calledInnerMockCallbacks.includes(
      'mockAsyncThrowErrorFn'
    ),
    true
  );
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassCount, 2);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs.length, 4);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs[0], 1);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs[1], '2');
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs[2], 1);
  assertEquals(proxyMockObj.InnerMockClass.calledInnerMockClassArgs[3], '2');

  // Reset data
  proxyMockObj.InnerMockClass.calledInnerMockClassCount = 0;
  proxyMockObj.InnerMockClass.calledInnerMockClassArgs = [];
  proxyMockObj.InnerMockClass.calledInnerMockCallbacks = [];

  return innerMock;
}

async function callAndAssertInnerFn1(proxyMockObj: InnerMockClass) {
  assertEquals(proxyMockObj.calledCallbacks.length, 0);
  assertEquals(proxyMockObj.calledInnerFn1Count, 0);
  assertEquals(proxyMockObj.calledInnerFn1Args.length, 0);

  proxyMockObj.innerFn1(false);

  await waitForLastCallback(proxyMockObj);

  assertEquals(proxyMockObj.calledCallbacks.length, 2);
  assertEquals(proxyMockObj.calledCallbacks.includes('mockSyncFn'), true);
  assertEquals(
    proxyMockObj.calledCallbacks.includes('mockSyncThrowErrorFn'),
    true
  );
  assertEquals(proxyMockObj.calledInnerFn1Count, 2);
  assertEquals(proxyMockObj.calledInnerFn1Args.length, 2);
  assertEquals(proxyMockObj.calledInnerFn1Args[0], false);
  assertEquals(proxyMockObj.calledInnerFn1Args[1], false);
}

test('Should setup proxy on existing props and call specified callbacks', async () => {
  const callbacksByProps = {
    prop1: {
      innerFn1: [mockSyncFn, mockSyncThrowErrorFn, lastCallback]
    },
    fn1: [mockAsyncFn, mockAsyncThrowErrorFn, lastCallback]
  };
  const mockObj = new MockClass();
  const proxyMockObj = setupProxy(mockObj, callbacksByProps);
  await callAndAssertFn1(proxyMockObj);
  await callAndAssertInnerFn1(proxyMockObj.prop1);
});

test('Should setup proxy on new instances and function returns', async () => {
  const callbacksByProps = {
    InnerMockClass: [mockAsyncFn, mockAsyncThrowErrorFn, lastCallback],
    'return|InnerMockClass': {
      innerFn1: [mockSyncFn, mockSyncThrowErrorFn, lastCallback]
    }
  };
  const mockObj = new MockClass();
  const proxyMockObj = setupProxy(mockObj, callbacksByProps);
  const innerMock = await callAndAssertInnerMockClass(proxyMockObj);
  await callAndAssertInnerFn1(innerMock);
});
