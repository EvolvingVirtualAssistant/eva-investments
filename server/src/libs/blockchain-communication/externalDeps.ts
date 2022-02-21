import { pathJoin, provider, ROOT_PATH } from './deps';
import { attemptImport } from './utils/import';
import { NodesRepository } from './driven/repositories/nodesRepository';

export interface ExternalDeps {
  getProvider?: (nodesRepository: NodesRepository) => provider;
}

let externalDeps: ExternalDeps | undefined;

export async function getExternalImports() {
  if (externalDeps) {
    return externalDeps;
  }

  const externalDepsPath = process.env['EXTERNAL_DEPS_PATH'];

  const externalImports = await attemptImport(
    externalDepsPath
      ? pathJoin(/*'file://', */ ROOT_PATH, externalDepsPath)
      : '',
    [],
    {}
  );

  externalDeps = {
    getProvider: externalImports.find((func) => func?.name === 'getProvider')
  };

  return externalDeps;
}
