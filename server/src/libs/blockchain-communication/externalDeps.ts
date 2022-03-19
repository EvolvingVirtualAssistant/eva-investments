import { pathJoin, ROOT_PATH } from './deps';
import { attemptImport } from './utils/import';
import { NodesRepository } from './driven/repositories/nodesRepository';
import { Node } from './domain/entities/node';

export interface ExternalDeps {
  getProviderNode?: (nodesRepository: NodesRepository) => Node;
  registerProviderRotation?: (
    setProviderCallback: (targetNode: Node) => void
  ) => void;
  unregisterProviderRotation?: () => void;
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

  const externalImportsFind = (prop: string) =>
    externalImports.find((func) => func?.name === prop);

  externalDeps = {
    getProviderNode: externalImportsFind('getProviderNode'),
    registerProviderRotation: externalImportsFind('registerProviderRotation'),
    unregisterProviderRotation: externalImportsFind(
      'unregisterProviderRotation'
    )
  };

  return externalDeps;
}
