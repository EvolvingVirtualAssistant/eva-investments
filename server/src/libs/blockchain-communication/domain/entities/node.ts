import { NodeOptions } from './nodeOptions';

export interface Node {
  id: number; // is this even relevant???? we are comparing with equalNodes regardless and the id has no use
  url: string;
  apiKey?: string;

  options: NodeOptions[];
}

export function equalNodes(node1?: Node, node2?: Node): boolean {
  // Test for scenarios of node === null or node === undefined
  return (
    node1 != null &&
    node2 != null &&
    concatObjProperties(node1) === concatObjProperties(node2)
  );
}

function concatObjProperties<T>(obj: T): string {
  if (obj == null) {
    throw new Error(
      `concatObjProperties: error concatenating obj properties, due to obj being ${obj}`
    );
  }

  // Test what happens when obj is null or undefined (actually do unit tests for all possible primitive types aside from just object)
  if (typeof obj != 'object') {
    return obj + '';
  }

  return Object.keys(obj)
    .sort()
    .map((key) => `${key}=${concatObjProperties(obj[key as keyof T])}`)
    .join();
}
