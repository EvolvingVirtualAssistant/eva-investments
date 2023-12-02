import { taggedTemplate } from '../../constants/cliConstants';

export const ArbitrageCliConstants = {
  USAGE: 'arbitrage [COMMAND] [OPTIONS]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'arbitrage --help' for more information on the arbitrage command.\n`,
  ADAPTER_TOKEN: 'arbitrage',
  ADAPTER_DESCRIPTION: 'Arbitrage related operations',
  ARBITRAGE_START_TOKEN: 'start',
  ARBITRAGE_START_DESCRIPTION: 'Starts a new arbitrage given configFile(1)',
  ARBITRAGE_START_ALL_TOKEN: 'start_all',
  ARBITRAGE_START_ALL_DESCRIPTION:
    'Starts a group of new arbitrages given configFile(1) that contains an array of file paths to individual configFiles',
  ARBITRAGE_LIST_TOKEN: 'list',
  ARBITRAGE_LIST_DESCRIPTION: 'Lists the current active arbitrage executions',
  ARBITRAGE_STOP_TOKEN: 'stop',
  ARBITRAGE_STOP_DESCRIPTION:
    'Stops an active arbitrage gracefully by providing the arbitrageId(1)',
  ARBITRAGE_STOP_FORCE_TOKEN: 'stop_force',
  ARBITRAGE_STOP_FORCE_DESCRIPTION:
    'Stops an active arbitrage immediately by providing the arbitrageId(1)',
  ARBITRAGE_STOP_ALL_TOKEN: 'stop_all',
  ARBITRAGE_STOP_ALL_DESCRIPTION: 'Stops all active arbitrages gracefully',
  ARBITRAGE_STOP_ALL_FORCE_TOKEN: 'stop_all_force',
  ARBITRAGE_STOP_ALL_FORCE_DESCRIPTION:
    'Stops all active arbitrages immediately'
} as const;
