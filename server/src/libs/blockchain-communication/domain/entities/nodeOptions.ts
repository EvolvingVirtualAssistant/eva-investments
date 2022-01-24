import { isType } from '../../utils/typeGuards';
import { BuildNodeError } from '../../errors/buildNodeError';
import { NodeType } from '../../types/blockchainCommunication.types';

export interface NodeOptions {
  host: string;
  type: NodeType;

  // Http, Ws (clientConfig), Ipc (server listener connections -> sockets)
  keepAlive?: boolean;
  // Http, Ws, Ipc (server listener connections -> sockets)
  timeout?: number;
}

export interface Header {
  name: string;
  value: string;
}

function isHeader(obj: any): boolean {
  return isType(obj, ['name', 'value'], []);
}

function validHeaders(headers: Header[] | undefined) {
  return headers !== undefined && headers.every((header) => isHeader(header));
}

// ----------------------------------- HTTP -----------------------------------

export interface HttpNodeOptions extends NodeOptions {
  agent?: Agent;
  withCredentials?: boolean;
  headers?: Header[];
}

export function buildHttpNodeOptions(obj: any): HttpNodeOptions {
  if (!isHttpNodeOptions(obj)) {
    throw new BuildNodeError('HttpNode', obj);
  }

  return { ...(obj as HttpNodeOptions) };
}

export function isHttpNodeOptions(obj: any): boolean {
  return (
    isType(
      obj,
      ['host', 'type'],
      ['keepAlive', 'agent', 'timeout', 'withCredentials', 'headers']
    ) &&
    ((obj as unknown as HttpNodeOptions).headers === undefined ||
      validHeaders((obj as unknown as HttpNodeOptions).headers)) &&
    ((obj as unknown as HttpNodeOptions).agent === undefined ||
      validAgent((obj as unknown as HttpNodeOptions).agent)) &&
    (obj as unknown as HttpNodeOptions).type === 'HTTP'
  );
}

export interface Agent {
  http?: HttpAgentOptions;
  https?: HttpsAgentOptions;
  baseUrl?: string;
}

export interface HttpAgentOptions {
  keepAlive?: boolean;
  keepAliveMsecs?: number;
  maxSockets?: number;
  maxTotalSockets?: number;
  maxFreeSockets?: number;
  scheduling?: string;
  timeout?: number;
}

export interface HttpsAgentOptions extends HttpAgentOptions {
  maxCachedSessions?: number;
  servername?: string;
}

function isAgent(obj: any): boolean {
  return (
    isType(obj, [], ['http', 'https', 'baseUrl']) &&
    ((obj as Agent).http === undefined || isHttpAgent((obj as Agent).http)) &&
    ((obj as Agent).https === undefined || isHttpsAgent((obj as Agent).https))
  );
}

function isHttpAgent(obj: any): boolean {
  return isType(
    obj,
    [],
    [
      'keepAlive',
      'keepAliveMsecs',
      'maxSockets',
      'maxTotalSockets',
      'maxFreeSockets',
      'scheduling',
      'timeout'
    ]
  );
}

function isHttpsAgent(obj: any): boolean {
  return isType(
    obj,
    [],
    [
      'keepAlive',
      'keepAliveMsecs',
      'maxSockets',
      'maxTotalSockets',
      'maxFreeSockets',
      'scheduling',
      'timeout',
      'maxCachedSessions',
      'timeout'
    ]
  );
}

function validAgent(agent: Agent | undefined) {
  return agent !== undefined && isAgent(agent);
}

// --------------------------------- Websocket --------------------------------

export interface WsNodeOptions extends NodeOptions {
  headers?: Header[];

  protocol?: string;

  // If in the future we use any of the values inside the object
  // on our code, then maybe consider giving it a proper type,
  // but for now we'll be passing it directly to the underlying libs
  config?: object;

  // If in the future we use any of the values inside the object
  // on our code, then maybe consider giving it a proper type,
  // but for now we'll be passing it directly to the underlying libs
  requestOptions?: any;

  reconnectOptions?: ReconnectOptions;
}

export function buildWsNodeOptions(obj: any): WsNodeOptions {
  if (!isWsNodeOptions(obj)) {
    throw new BuildNodeError('WsNode', obj);
  }

  return { ...(obj as WsNodeOptions) };
}

export function isWsNodeOptions(obj: any): boolean {
  return (
    isType(
      obj,
      ['host', 'type'],
      [
        'keepAlive',
        'timeout',
        'headers',
        'protocol',
        'config',
        'requestOptions',
        'reconnectOptions'
      ]
    ) &&
    ((obj as unknown as WsNodeOptions).headers === undefined ||
      validHeaders((obj as unknown as WsNodeOptions).headers)) &&
    ((obj as unknown as WsNodeOptions).reconnectOptions === undefined ||
      isReconnectOptions((obj as unknown as WsNodeOptions).reconnectOptions)) &&
    (obj as unknown as WsNodeOptions).type === 'WS'
  );
}

export interface ReconnectOptions {
  auto?: boolean;
  delay?: number;
  maxAttempts?: number;
  onTimeout?: boolean;
}

function isReconnectOptions(obj: any): boolean {
  return isType(obj, [], ['auto', 'delay', 'maxAttempts', 'onTimeout']);
}

// ----------------------------------- IPC ------------------------------------

// Take a look at https://nodejs.org/api/net.html#class-netserver
// (and the deno equivalent https://deno.land/std@0.114.0/node/net.ts)
// in order to understand what options are supported in
// the creationg of a net.Server, and what options can be specified
// in the underlying socket
export type IpcNodeOptions = NodeOptions;

export function buildIpcNodeOptions(obj: any): IpcNodeOptions {
  if (!isIpcNodeOptions(obj)) {
    throw new BuildNodeError('IpcNode', obj);
  }

  return { ...(obj as IpcNodeOptions) };
}

export function isIpcNodeOptions(obj: any): boolean {
  return (
    isType(obj, ['host', 'type'], ['keepAlive', 'timeout']) &&
    (obj as unknown as IpcNodeOptions).type === 'IPC'
  );
}
