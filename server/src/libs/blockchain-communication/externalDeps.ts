import { pathJoin, ROOT_PATH } from '../../deps.ts';
import { attemptImport } from '../../utils/import.ts';

export interface ExternalDeps {
  field1: () => boolean;
}

const externalDepsPath = Deno.env.get('EXTERNAL_DEPS_PATH');
const externalImports = await attemptImport(
  externalDepsPath ? pathJoin('file://', ROOT_PATH, externalDepsPath) : '',
  [],
  {}
);

export const externalDeps: ExternalDeps = {
  field1: externalImports[0],
};
