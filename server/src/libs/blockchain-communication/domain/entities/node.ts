import { isType } from '../../../../utils/typeGuards.ts';
import { BuildNodeError } from '../../errors/buildNodeError.ts';
import { NodeType } from '../../types/blockchainCommunication.types.ts';

export class BaseNode {
  id: number;
  host: string;
  type: NodeType;

  // Http, Ws (clientConfig), Ipc (server listener connections -> sockets)
  keepAlive?: boolean;
  // Http, Ws, Ipc (server listener connections -> sockets)
  timeout?: number;

  protected constructor(id: number, host: string, type: NodeType) {
    this.id = id;
    this.host = host;
    this.type = type;
  }

  static buildBaseNode(obj: any): BaseNode {
    if (!BaseNode.isBaseNode(obj)) {
      throw new BuildNodeError('BaseNode', obj);
    }

    const castObj = obj as BaseNode;
    const node = new BaseNode(castObj.id, castObj.host, castObj.type);
    node.keepAlive = castObj.keepAlive;
    node.timeout = castObj.timeout;

    return node;
  }

  static isBaseNode(obj: any): boolean {
    return isType(obj, ['id', 'host', 'type'], ['keepAlive', 'timeout']);
  }
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

export class HttpNode extends BaseNode {
  // If deno supports this at some point, look into it (this is an HttpAgent on web3js lib, that contains http.Agent objects from node)
  // private agent;

  withCredentials?: boolean;

  headers?: Header[];

  constructor(id: number, host: string) {
    super(id, host, 'HTTP');
  }

  static buildHttpNode(obj: any): HttpNode {
    if (!HttpNode.isHttpNode(obj)) {
      throw new BuildNodeError('HttpNode', obj);
    }

    const castObj = obj as HttpNode;
    const node = new HttpNode(castObj.id, castObj.host);
    node.keepAlive = castObj.keepAlive;
    node.timeout = castObj.timeout;
    node.withCredentials = castObj.withCredentials;
    node.headers = castObj.headers;

    return node;
  }

  static isHttpNode(obj: any): boolean {
    return (
      isType(
        obj,
        ['id', 'host', 'type'],
        ['keepAlive', 'timeout', 'withCredentials', 'headers']
      ) &&
      ((obj as unknown as HttpNode).headers === undefined ||
        validHeaders((obj as unknown as HttpNode).headers)) &&
      (obj as unknown as HttpNode).type === 'HTTP'
    );
  }
}

// --------------------------------- Websocket --------------------------------

export class WsNode extends BaseNode {
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

  constructor(id: number, host: string) {
    super(id, host, 'WS');
  }

  static buildWsNode(obj: any): WsNode {
    if (!WsNode.isWsNode(obj)) {
      throw new BuildNodeError('WsNode', obj);
    }

    const castObj = obj as WsNode;
    const node = new WsNode(castObj.id, castObj.host);
    node.keepAlive = castObj.keepAlive;
    node.timeout = castObj.timeout;
    node.headers = castObj.headers;
    node.protocol = castObj.protocol;
    node.config = castObj.config;
    node.reconnectOptions = castObj.reconnectOptions;
    node.requestOptions = castObj.requestOptions;

    return node;
  }

  static isWsNode(obj: any): boolean {
    return (
      isType(
        obj,
        ['id', 'host', 'type'],
        [
          'keepAlive',
          'timeout',
          'headers',
          'protocol',
          'config',
          'requestOptions',
          'reconnectOptions',
        ]
      ) &&
      ((obj as unknown as WsNode).headers === undefined ||
        validHeaders((obj as unknown as WsNode).headers)) &&
      ((obj as unknown as WsNode).reconnectOptions === undefined ||
        isReconnectOptions((obj as unknown as WsNode).reconnectOptions)) &&
      (obj as unknown as WsNode).type === 'WS'
    );
  }
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

export class IpcNode extends BaseNode {
  // Take a look at https://nodejs.org/api/net.html#class-netserver
  // (and the deno equivalent https://deno.land/std@0.114.0/node/net.ts)
  // in order to understand what options are supported in
  // the creationg of a net.Server, and what options can be specified
  // in the underlying socket

  constructor(id: number, host: string) {
    super(id, host, 'IPC');
  }

  static buildIpcNode(obj: any): IpcNode {
    if (!IpcNode.isIpcNode(obj)) {
      throw new BuildNodeError('IpcNode', obj);
    }

    const castObj = obj as IpcNode;
    const node = new IpcNode(castObj.id, castObj.host);
    node.keepAlive = castObj.keepAlive;
    node.timeout = castObj.timeout;

    return node;
  }

  static isIpcNode(obj: any): boolean {
    return (
      isType(obj, ['id', 'host', 'type'], ['keepAlive', 'timeout']) &&
      (obj as unknown as IpcNode).type === 'IPC'
    );
  }
}
