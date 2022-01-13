import {
  test,
  assertEquals,
  assertThrows
} from '../../../../../wrap/testWrapper';
import {
  isNodeOptions,
  isHttpNodeOptions,
  isWsNodeOptions,
  isIpcNodeOptions,
  buildNodeOptions,
  buildHttpNodeOptions,
  buildWsNodeOptions,
  buildIpcNodeOptions
} from '../../../../../../src/libs/blockchain-communication/domain/entities/nodeOptions';
import { BuildNodeError } from '../../../../../../src/libs/blockchain-communication/errors/buildNodeError';

test('Should be Node Options', () => {
  const nodeOptions = {
    host: 'some host',
    type: 'HTTP'
  };
  assertEquals(isNodeOptions(nodeOptions), true);
  const nodeOptions1 = {
    ...nodeOptions,
    keepAlive: true
  };
  assertEquals(isNodeOptions(nodeOptions1), true);
  const nodeOptions2 = {
    ...nodeOptions1,
    timeout: 0
  };
  assertEquals(isNodeOptions(nodeOptions2), true);
});

test('Should build Node Options', () => {
  const nodeOptions = {
    host: 'some host',
    type: 'HTTP',
    keepAlive: true,
    timeout: 0
  };

  const node = buildNodeOptions(nodeOptions);
  assertEquals(node.type, 'HTTP');
});

test('Should not build Node Options', () => {
  const nodeOptions = {
    host: 'some host',
    keepAlive: true,
    timeout: 0
  };

  assertThrows(() => buildNodeOptions(nodeOptions), BuildNodeError);
});

test('Should be Http Node', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'HTTP',
    timeout: 0
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions), true);
  const httpNodeOptions1 = {
    ...httpNodeOptions,
    withCredentials: true
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions1), true);
  const httpNodeOptions2 = {
    ...httpNodeOptions1,
    headers: [
      {
        name: 'some header key',
        value: 'some header value'
      }
    ]
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions2), true);
});

test('Should not be Http Node Options with invalid headers', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'HTTP',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
        invalidField: 'invalid field'
      }
    ]
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions), false);
});

test('Should not be Http Node Options with invalid agent', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'HTTP',
    agent: {
      httpAgent: {
        maxSockets: 0,
        invalidField: 'invalid field'
      },
      invalidField: 'invalid field'
    }
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions), false);
});

test('Should not be Http Node Options with wrong type', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'WS'
  };
  assertEquals(isHttpNodeOptions(httpNodeOptions), false);
});

test('Should build Http Node Options', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'HTTP',
    keepAlive: true,
    headers: [
      {
        name: 'some header key',
        value: 'some header value'
      }
    ],
    agent: {
      httpAgent: {
        maxSockets: Infinity
      },
      baseUrl: 'base'
    }
  };

  const node = buildHttpNodeOptions(httpNodeOptions);
  assertEquals(node.type, 'HTTP');
});

test('Should not build Http Node Options', () => {
  const httpNodeOptions = {
    host: 'some host',
    type: 'IPC',
    headers: [
      {
        name: 'some header key',
        value: 'some header value'
      }
    ]
  };

  assertThrows(() => buildHttpNodeOptions(httpNodeOptions), BuildNodeError);
});

test('Should be Ws Node Options', () => {
  const wsNodeOptions = {
    host: 'some host',
    type: 'WS',
    timeout: 0,
    protocol: 'ws-sub-protocol'
  };
  assertEquals(isWsNodeOptions(wsNodeOptions), true);
  const wsNodeOptions1 = {
    ...wsNodeOptions,
    config: {
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000
    },
    requestOptions: {
      agent: false
    }
  };
  assertEquals(isWsNodeOptions(wsNodeOptions1), true);
  const wsNodeOptions2 = {
    ...wsNodeOptions1,
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false
    }
  };
  assertEquals(isWsNodeOptions(wsNodeOptions2), true);
});

test('Should not be Ws Node Options with invalid headers', () => {
  const wsNodeOptions = {
    host: 'some host',
    type: 'WS',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
        invalidField: 'invalid field'
      }
    ]
  };
  assertEquals(isWsNodeOptions(wsNodeOptions), false);
});

test('Should not be Ws Node Options with invalid reconnect options', () => {
  const wsNodeOptions = {
    host: 'some host',
    type: 'WS',
    timeout: 0,
    protocol: 'ws-sub-protocol',
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
      someExtraProperty: true
    }
  };
  assertEquals(isWsNodeOptions(wsNodeOptions), false);
});

test('Should not be Ws Node Options with wrong types', () => {
  const wsNodeOptions = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    timeout: 0,
    protocol: 'ws-sub-protocol',
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false
    }
  };
  assertEquals(isWsNodeOptions(wsNodeOptions), false);
});

test('Should build Ws Node Options', () => {
  const wsNodeOptions = {
    host: 'some host',
    type: 'WS',
    keepAlive: true,
    headers: [
      {
        name: 'some header key',
        value: 'some header value'
      }
    ]
  };

  const node = buildWsNodeOptions(wsNodeOptions);
  assertEquals(node.type, 'WS');
});

test('Should not build Ws Node Options', () => {
  const wsNodeOptions = {
    host: 'some host',
    type: 'IPC',
    headers: [
      {
        name: 'some header key',
        value: 'some header value'
      }
    ]
  };

  assertThrows(() => buildWsNodeOptions(wsNodeOptions), BuildNodeError);
});

test('Should be Ipc Node Options', () => {
  const ipcNodeOptions = {
    host: 'some host',
    type: 'IPC',
    timeout: 0
  };
  assertEquals(isIpcNodeOptions(ipcNodeOptions), true);
  const ipcNodeOptions1 = {
    ...ipcNodeOptions,
    keepAlive: true
  };
  assertEquals(isIpcNodeOptions(ipcNodeOptions1), true);
});

test('Should not be Ipc Node Options with wrong types', () => {
  const ipcNodeOptions = {
    host: 'some host',
    type: 'WS',
    timeout: 0
  };
  assertEquals(isIpcNodeOptions(ipcNodeOptions), false);
});

test('Should build Ipc Node Options', () => {
  const ipcNodeOptions = {
    host: 'some host',
    type: 'IPC',
    keepAlive: true,
    timeout: 0
  };

  const node = buildIpcNodeOptions(ipcNodeOptions);
  assertEquals(node.type, 'IPC');
});

test('Should not build Ipc Node Options', () => {
  const ipcNodeOptions = {
    host: 'some host',
    keepAlive: true,
    timeout: 0
  };

  assertThrows(() => buildIpcNodeOptions(ipcNodeOptions), BuildNodeError);
});
