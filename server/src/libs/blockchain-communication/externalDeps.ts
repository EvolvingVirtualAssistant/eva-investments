import { pathJoin, ROOT_PATH } from '../../deps';
import { attemptImport } from '../../utils/import';

export interface ExternalDeps {
  field1: () => boolean;
}

const externalDepsPath = process.env['EXTERNAL_DEPS_PATH'];

let externalDeps: ExternalDeps | undefined;

export async function getExternalImports() {
  if (externalDeps) {
    return externalDeps;
  }

  const externalImports = await attemptImport(
    externalDepsPath ? pathJoin('file://', ROOT_PATH, externalDepsPath) : '',
    [],
    {}
  );

  externalDeps = {
    field1: externalImports[0]
  };

  return externalDeps;
}
