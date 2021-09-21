import { CliConstants } from './constants/cliConstants.ts';

export { cliAdapter } from './decorators/cliAdapter.ts';
export { cliEntrypoint } from './decorators/cliEntrypoint.ts';
export { CliError } from './errors/cliError.ts';
export type { Command } from './types/cli.types.ts';
export { print, println } from './utils/io.ts';
export {
  getAllCliEntrypointsByCliAdapter,
  getAllCliAdapters,
} from './worker/cliContext.ts';

export const CLI_ADAPTER_DEFAULT_TOKEN = CliConstants.CLI_ADAPTER_DEFAULT_TOKEN;
