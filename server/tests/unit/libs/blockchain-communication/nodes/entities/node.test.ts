import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import {
  BaseNode,
  HttpNode,
  IpcNode,
  WsNode,
} from '../../../../../../src/libs/blockchain-communication/nodes/entities/node.ts';
import { BuildNodeError } from '../../../../../../src/libs/blockchain-communication/errors/buildNodeError.ts';

Deno.test('Should be Base Node', () => {
  const baseNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
  };
  assertEquals(BaseNode.isBaseNode(baseNode), true);
  const baseNode1 = {
    ...baseNode,
    keepAlive: true,
  };
  assertEquals(BaseNode.isBaseNode(baseNode1), true);
  const baseNode2 = {
    ...baseNode1,
    timeout: 0,
  };
  assertEquals(BaseNode.isBaseNode(baseNode2), true);
});

Deno.test('Should build Base Node', () => {
  const baseNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    keepAlive: true,
    timeout: 0,
  };

  const node = BaseNode.buildBaseNode(baseNode);
  assertEquals(node instanceof BaseNode, true);
});

Deno.test('Should not build Base Node', () => {
  const baseNode = {
    id: 1,
    host: 'some host',
    keepAlive: true,
    timeout: 0,
  };

  assertThrows(() => BaseNode.buildBaseNode(baseNode), BuildNodeError);
});

Deno.test('Should be Http Node', () => {
  const httpNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    timeout: 0,
  };
  assertEquals(HttpNode.isHttpNode(httpNode), true);
  const httpNode1 = {
    ...httpNode,
    withCredentials: true,
  };
  assertEquals(HttpNode.isHttpNode(httpNode1), true);
  const httpNode2 = {
    ...httpNode1,
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
      },
    ],
  };
  assertEquals(HttpNode.isHttpNode(httpNode2), true);
});

Deno.test('Should not be Http Node with invalid headers', () => {
  const httpNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
        invalidField: 'invalid field',
      },
    ],
  };
  assertEquals(HttpNode.isHttpNode(httpNode), false);
});

Deno.test('Should not be Http Node with wrong type', () => {
  const httpNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
  };
  assertEquals(HttpNode.isHttpNode(httpNode), false);
});

Deno.test('Should build Http Node', () => {
  const httpNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    keepAlive: true,
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
      },
    ],
  };

  const node = HttpNode.buildHttpNode(httpNode);
  assertEquals(node instanceof HttpNode, true);
});

Deno.test('Should not build Http Node', () => {
  const httpNode = {
    id: 1,
    host: 'some host',
    type: 'IPC',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
      },
    ],
  };

  assertThrows(() => HttpNode.buildHttpNode(httpNode), BuildNodeError);
});

Deno.test('Should be Ws Node', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
    timeout: 0,
    protocol: 'ws-sub-protocol',
  };
  assertEquals(WsNode.isWsNode(wsNode), true);
  const wsNode1 = {
    ...wsNode,
    config: {
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
    requestOptions: {
      agent: false,
    },
  };
  assertEquals(WsNode.isWsNode(wsNode1), true);
  const wsNode2 = {
    ...wsNode1,
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
    },
  };
  assertEquals(WsNode.isWsNode(wsNode2), true);
});

Deno.test('Should not be Http Node with invalid headers', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
        invalidField: 'invalid field',
      },
    ],
  };
  assertEquals(WsNode.isWsNode(wsNode), false);
});

Deno.test('Should not be Ws Node with invalid reconnect options', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
    timeout: 0,
    protocol: 'ws-sub-protocol',
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
      someExtraProperty: true,
    },
  };
  assertEquals(WsNode.isWsNode(wsNode), false);
});

Deno.test('Should not be Ws Node with wrong types', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'HTTP',
    timeout: 0,
    protocol: 'ws-sub-protocol',
    reconnectOptions: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
    },
  };
  assertEquals(WsNode.isWsNode(wsNode), false);
});

Deno.test('Should build Ws Node', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
    keepAlive: true,
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
      },
    ],
  };

  const node = WsNode.buildWsNode(wsNode);
  assertEquals(node instanceof WsNode, true);
});

Deno.test('Should not build Ws Node', () => {
  const wsNode = {
    id: 1,
    host: 'some host',
    type: 'IPC',
    headers: [
      {
        name: 'some header key',
        value: 'some header value',
      },
    ],
  };

  assertThrows(() => WsNode.buildWsNode(wsNode), BuildNodeError);
});

Deno.test('Should be Ipc Node', () => {
  const ipcNode = {
    id: 1,
    host: 'some host',
    type: 'IPC',
    timeout: 0,
  };
  assertEquals(IpcNode.isIpcNode(ipcNode), true);
  const ipcNode1 = {
    ...ipcNode,
    keepAlive: true,
  };
  assertEquals(IpcNode.isIpcNode(ipcNode1), true);
});

Deno.test('Should not be Ipc Node with wrong types', () => {
  const ipcNode = {
    id: 1,
    host: 'some host',
    type: 'WS',
    timeout: 0,
  };
  assertEquals(IpcNode.isIpcNode(ipcNode), false);
});

Deno.test('Should build Ipc Node', () => {
  const ipcNode = {
    id: 1,
    host: 'some host',
    type: 'IPC',
    keepAlive: true,
    timeout: 0,
  };

  const node = IpcNode.buildIpcNode(ipcNode);
  assertEquals(node instanceof IpcNode, true);
});

Deno.test('Should not build Ipc Node', () => {
  const ipcNode = {
    id: 1,
    host: 'some host',
    keepAlive: true,
    timeout: 0,
  };

  assertThrows(() => IpcNode.buildIpcNode(ipcNode), BuildNodeError);
});
