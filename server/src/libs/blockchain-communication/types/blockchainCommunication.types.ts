export enum ProviderType {
  HTTP = 'HTTP', // Http
  WS = 'WS', // Websockets
  IPC = 'IPC', // Inter-process communication
}

export type NodeType = keyof typeof ProviderType;

export interface Dictionary<T> {
  [key: string]: T;
}
