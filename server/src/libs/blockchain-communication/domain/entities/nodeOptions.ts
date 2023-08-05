import { isType } from '../../utils/typeGuards';
import { BuildNodeError } from './errors/buildNodeError';
import {
  Dictionary,
  NodeType
} from '../../types/blockchainCommunication.types';
import { SocketConstructorOpts } from '../../deps';

export interface NodeOptions {
  host: string;
  type: NodeType;
  isFree?: boolean;
}

// ----------------------------------- HTTP -----------------------------------

// type https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html#keepalive
export interface HttpNodeOptions extends NodeOptions {
  providerOptions: ProviderOptions;
}

type ProviderOptions = RequestInit;

export function buildHttpNodeOptions(obj: any): HttpNodeOptions {
  if (!isHttpNodeOptions(obj)) {
    throw new BuildNodeError('HttpNode', obj);
  }

  return { ...(obj as HttpNodeOptions) };
}

export function isHttpNodeOptions(obj: any): boolean {
  return (
    isType(obj, ['host', 'type'], ['isFree', 'providerOptions']) &&
    ((obj as unknown as HttpNodeOptions).providerOptions === undefined ||
      validProviderOptions(
        (obj as unknown as HttpNodeOptions).providerOptions
      )) &&
    (obj as unknown as HttpNodeOptions).type === 'HTTP'
  );
}

function validProviderOptions(providerOptions: ProviderOptions | undefined) {
  return (
    providerOptions !== undefined &&
    isType(
      providerOptions,
      [],
      ['headers', 'credentials', 'body', 'keepalive', 'method'] // only adding these ones for the time being
    )
  );
}

// --------------------------------- Websocket --------------------------------

// Based on ClientOptions
export interface WsNodeOptions extends NodeOptions {
  headers?: Dictionary<string>;
  maxPayload?: number;
  protocol?: string;
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
      ['isFree', 'headers', 'maxPayload', 'protocol', 'reconnectOptions']
    ) &&
    ((obj as unknown as WsNodeOptions).reconnectOptions === undefined ||
      isReconnectOptions((obj as unknown as WsNodeOptions).reconnectOptions)) &&
    (obj as unknown as WsNodeOptions).type === 'WS'
  );
}

export interface ReconnectOptions {
  autoReconnect: boolean;
  delay: number;
  maxAttempts: number;
}

function isReconnectOptions(obj: any): boolean {
  return isType(obj, ['autoReconnect', 'delay', 'maxAttempts'], []);
}

// ----------------------------------- IPC ------------------------------------

// Take a look at https://nodejs.org/api/net.html#class-netserver
// (and the deno equivalent https://deno.land/std@0.114.0/node/net.ts)
// in order to understand what options are supported in
// the creationg of a net.Server, and what options can be specified
// in the underlying socket
export type IpcNodeOptions = NodeOptions &
  SocketConstructorOpts & { reconnectOptions: ReconnectOptions };

export function buildIpcNodeOptions(obj: any): IpcNodeOptions {
  if (!isIpcNodeOptions(obj)) {
    throw new BuildNodeError('IpcNode', obj);
  }

  return { ...(obj as IpcNodeOptions) };
}

export function isIpcNodeOptions(obj: any): boolean {
  return (
    isType(
      obj,
      ['host', 'type'],
      [
        'isFree',
        'fd',
        'allowHalfOpen',
        'readable',
        'writable',
        'signal',
        'reconnectOptions'
      ]
    ) &&
    ((obj as unknown as WsNodeOptions).reconnectOptions === undefined ||
      isReconnectOptions((obj as unknown as WsNodeOptions).reconnectOptions)) &&
    (obj as unknown as IpcNodeOptions).type === 'IPC'
  );
}
