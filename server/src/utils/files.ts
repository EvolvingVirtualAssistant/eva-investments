import { readFileSync } from 'fs';

export function readTextFile(path: string): string {
  return readFileSync(path, { encoding: 'utf8', flag: 'r' });
}

export function readJsonFile(path: string): any {
  return JSON.parse(readTextFile(path));
}
