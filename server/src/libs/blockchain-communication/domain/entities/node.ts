import { isType } from '../../../../utils/typeGuards.ts';
import { BuildNodeError } from '../../errors/buildNodeError.ts';
import { NodeType } from '../../types/blockchainCommunication.types.ts';

export class BaseNode {
  protected id: number;
  protected host: string;
  protected type: NodeType;

  // Http, Ws (clientConfig), Ipc (server listener connections -> sockets)
  protected keepAlive?: boolean;
  // Http, Ws, Ipc (server listener connections -> sockets)
  protected timeout?: number;

  constructor(id: number, host: string, type: NodeType) {
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

    if (castObj.keepAlive !== undefined) {
      node.setKeepAlive(castObj.keepAlive);
    }

    if (castObj.timeout !== undefined) {
      node.setTimeout(castObj.timeout);
    }

    return node;
  }

  static isBaseNode(obj: any): boolean {
    return isType(obj, ['id', 'host', 'type'], ['keepAlive', 'timeout']);
  }

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getHost(): string {
    return this.host;
  }

  setHost(host: string): void {
    this.host = host;
  }

  getType(): NodeType {
    return this.type;
  }

  setType(type: NodeType): void {
    this.type = type;
  }

  getKeepAlive(): boolean | undefined {
    return this.keepAlive;
  }

  setKeepAlive(keepAlive: boolean): void {
    this.keepAlive = keepAlive;
  }

  getTimeout(): number | undefined {
    return this.timeout;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
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

  private withCredentials?: boolean;

  private headers?: Header[];

  constructor(id: number, host: string) {
    super(id, host, 'HTTP');
  }

  static buildHttpNode(obj: any): HttpNode {
    if (!HttpNode.isHttpNode(obj)) {
      throw new BuildNodeError('HttpNode', obj);
    }

    const castObj = obj as HttpNode;
    const node = new HttpNode(castObj.id, castObj.host);

    if (castObj.keepAlive !== undefined) {
      node.setKeepAlive(castObj.keepAlive);
    }

    if (castObj.timeout !== undefined) {
      node.setTimeout(castObj.timeout);
    }

    if (castObj.withCredentials !== undefined) {
      node.setWithCredentials(castObj.withCredentials);
    }

    if (castObj.headers !== undefined) {
      node.setHeaders(castObj.headers);
    }

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

  getWithCredentials(): boolean | undefined {
    return this.withCredentials;
  }

  setWithCredentials(withCredentials: boolean): void {
    this.withCredentials = withCredentials;
  }

  getHeaders(): Header[] | undefined {
    return this.headers;
  }

  setHeaders(headers: Header[]): void {
    this.headers = headers;
  }
}

// --------------------------------- Websocket --------------------------------

export class WsNode extends BaseNode {
  private headers?: Header[];

  private protocol?: string;

  // If in the future we use any of the values inside the object
  // on our code, then maybe consider giving it a proper type,
  // but for now we'll be passing it directly to the underlying libs
  private config?: object;

  // If in the future we use any of the values inside the object
  // on our code, then maybe consider giving it a proper type,
  // but for now we'll be passing it directly to the underlying libs
  private requestOptions?: any;

  private reconnectOptions?: ReconnectOptions;

  constructor(id: number, host: string) {
    super(id, host, 'WS');
  }

  static buildWsNode(obj: any): WsNode {
    if (!WsNode.isWsNode(obj)) {
      throw new BuildNodeError('WsNode', obj);
    }

    const castObj = obj as WsNode;
    const node = new WsNode(castObj.id, castObj.host);

    if (castObj.keepAlive !== undefined) {
      node.setKeepAlive(castObj.keepAlive);
    }

    if (castObj.timeout !== undefined) {
      node.setTimeout(castObj.timeout);
    }

    if (castObj.headers !== undefined) {
      node.setHeaders(castObj.headers);
    }

    if (castObj.protocol !== undefined) {
      node.setProtocol(castObj.protocol);
    }

    if (castObj.config !== undefined) {
      node.setConfig(castObj.config);
    }

    if (castObj.reconnectOptions !== undefined) {
      node.setReconnectOptions(castObj.reconnectOptions);
    }

    if (castObj.requestOptions !== undefined) {
      node.setRequestOptions(castObj.requestOptions);
    }

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

  getHeaders(): Header[] | undefined {
    return this.headers;
  }

  setHeaders(headers: Header[]): void {
    this.headers = headers;
  }

  getProtocol(): string | undefined {
    return this.protocol;
  }

  setProtocol(protocol: string): void {
    this.protocol = protocol;
  }

  getConfig(): object | undefined {
    return this.config;
  }

  setConfig(config: object): void {
    this.config = config;
  }

  getRequestOptions(): any | undefined {
    return this.requestOptions;
  }

  setRequestOptions(requestOptions: any): void {
    this.requestOptions = requestOptions;
  }

  getReconnectOptions(): ReconnectOptions | undefined {
    return this.reconnectOptions;
  }

  setReconnectOptions(reconnectOptions: ReconnectOptions): void {
    this.reconnectOptions = reconnectOptions;
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

    if (castObj.keepAlive !== undefined) {
      node.setKeepAlive(castObj.keepAlive);
    }

    if (castObj.timeout !== undefined) {
      node.setTimeout(castObj.timeout);
    }

    return node;
  }

  static isIpcNode(obj: any): boolean {
    return (
      isType(obj, ['id', 'host', 'type'], ['keepAlive', 'timeout']) &&
      (obj as unknown as IpcNode).type === 'IPC'
    );
  }
}
