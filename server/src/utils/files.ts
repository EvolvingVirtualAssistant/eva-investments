import { readFileSync, writeFileSync } from 'fs';

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
