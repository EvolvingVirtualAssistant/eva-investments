import { logWarn } from '../deps';

export async function attemptImport(
  path: string,
  importProps: string[] = [],
  fallbackImport: any = {}
): Promise<any[]> {
  let imported: any;
  try {
    imported = await import(path);
  } catch (e) {
    logWarn('Error while attemptImport', JSON.stringify(e));
    if (e instanceof Error) {
      logWarn('attemptImport error msg:', e.message);
    }
    imported = fallbackImport;
  }

  return importProps.length === 0
    ? Object.values(imported)
    : importProps
        .filter((prop) => imported[prop] != null)
        .map((prop) => imported[prop]);
}
