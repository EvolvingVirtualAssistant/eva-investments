import { readFileSync, writeFileSync } from 'fs';
import { pathJoin } from '../deps';

export function readTextFile(path: string): string {
  return readFileSync(path, { encoding: 'utf8', flag: 'r' });
}

export function readJsonFile(path: string): any {
  return JSON.parse(readTextFile(path));
}

export function writeTextFile(path: string, data: string): void {
  writeFileSync(path, data, { encoding: 'utf8', flag: 'w' });
}

export function writeJsonFile(path: string, data: object): void {
  writeTextFile(path, JSON.stringify(data));
}

export function getObjFromJson<T>(
  envKey: string,
  rootPath: string,
  buildObj: (objToBuild: T) => T,
  validation?: (objToValidate: T) => void
): T {
  const obj: T = getJsonFromEnvKey(envKey, rootPath);

  validation?.(obj);

  return buildObj(obj);
}

export function getJsonFromEnvKey<T>(key: string, rootPath: string): T {
  const jsonPath: string = pathJoin(rootPath, process.env[key] || '');

  return readJsonFile(jsonPath);
}
