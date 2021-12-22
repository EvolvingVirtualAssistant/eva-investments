import { pathJoin, ROOT_PATH } from '../../deps';
import { attemptImport } from '../../utils/import';

export interface ExternalDeps {
  field1: () => boolean;
}

const externalDepsPath = process.env['EXTERNAL_DEPS_PATH'];
const externalImports = await attemptImport(
  externalDepsPath ? pathJoin('file://', ROOT_PATH, externalDepsPath) : '',
  [],
  {}
);

export const externalDeps: ExternalDeps = {
  field1: externalImports[0]
};
