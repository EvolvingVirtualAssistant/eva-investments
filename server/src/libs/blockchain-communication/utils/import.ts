export async function attemptImport(
  path: string,
  importProps: string[] = [],
  fallbackImport: any = {}
): Promise<any[]> {
  let imported: any;
  try {
    imported = await import(path);
  } catch (e) {
    console.log(e);
    imported = fallbackImport;
  }

  return importProps.length === 0
    ? Object.values(imported)
    : importProps
        .filter((prop) => imported[prop] != null)
        .map((prop) => imported[prop]);
}
