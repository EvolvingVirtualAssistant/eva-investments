import { taggedTemplate } from '../../constants/cliConstants';

export const ArbitrageCliConstants = {
  USAGE: 'arbitrage [COMMAND] [OPTIONS]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'contracts --help' for more information on the contracts command.\n`,
  ADAPTER_TOKEN: 'arbitrage',
  ADAPTER_DESCRIPTION: 'Arbitrage related operations',
  ARBITRAGE_START_TOKEN: 'start',
  ARBITRAGE_START_DESCRIPTION: 'Starts a new arbitrage given configFile(1)',
  ARBITRAGE_START_ALL_DESCRIPTION:
    'Starts a group of new arbitrages given configFile(1) that contains an array of file paths to individual configFiles',
  ARBITRAGE_LIST_TOKEN: 'list',
  ARBITRAGE_LIST_DESCRIPTION: 'Lists the current active arbitrage executions',
  ARBITRAGE_STOP_TOKEN: 'stop',
  ARBITRAGE_STOP_DESCRIPTION:
    'Stops an active arbitrage gracefully by providing the arbitrageId(1) and optionally a --force(2) flag to stop it immediately',
  ARBITRAGE_FORCE_OPTION_TOKEN: '--force',
  ARBITRAGE_ALL_OPTION_TOKEN: '--all',
  ARBITRAGE_STOP_ALL_DESCRIPTION:
    'Stops all active arbitrages gracefully by providing the --all(1) flag and optionally a --force(2) flag to stop all immediately'
} as const;
