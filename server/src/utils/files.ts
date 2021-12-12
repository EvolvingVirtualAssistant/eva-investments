export function readTextFile(path: string): string {
  return Deno.readTextFileSync(path);
}

export function readJsonFile(path: string): any {
  return JSON.parse(readTextFile(path));
}
