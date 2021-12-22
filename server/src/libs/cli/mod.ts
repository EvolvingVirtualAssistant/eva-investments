import { CliConstants } from './constants/cliConstants';

export { cliAdapter } from './decorators/cliAdapter';
export { cliEntrypoint } from './decorators/cliEntrypoint';
export { CliError } from './errors/cliError';
export type { Command } from './types/cli.types';
export { print, println } from './utils/io';
export {
  getAllCliEntrypointsByCliAdapter,
  getAllCliAdapters
} from './worker/cliContext';

export const CLI_ADAPTER_DEFAULT_TOKEN = CliConstants.CLI_ADAPTER_DEFAULT_TOKEN;
