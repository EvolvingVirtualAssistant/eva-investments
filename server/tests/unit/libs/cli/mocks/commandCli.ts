import {
  CommandCliAdapter,
  CommandCliEntrypoint
} from '../../../../../src/libs/cli/types/cli.types';

export const MOCK_CLI_ADAPTER_COMMAND: CommandCliAdapter = {
  tokens: ['mock_cli_adapter'],
  description: 'MOCK CLI ADAPTER'
};
export const MOCK_CLI_ADAPTER_NO_TOKENS_COMMAND: CommandCliAdapter = {
  tokens: [],
  description: 'MOCK CLI ADAPTER'
};
export const MOCK_CLI_ENTRYPOINT_COMMAND_1: CommandCliEntrypoint = {
  tokens: ['mock_cli_entrypoint_1'],
  description: 'MOCK CLI ENTRYPOINT',
  fn: () => {},
  argsSize: 0,
  this: null,
  isFallback: false
};
export const MOCK_CLI_ENTRYPOINT_COMMAND_2: CommandCliEntrypoint = {
  tokens: ['mock_cli_entrypoint_2'],
  description: 'MOCK CLI ENTRYPOINT',
  fn: () => {},
  argsSize: 0,
  this: null,
  isFallback: false
};

export class MockAdapterClass1 {
  field1 = '';
}

export class MockAdapterClass2 {
  field1 = '';
}

export class MockNonExistentAdapterClass {
  field1 = '';
}

export const MOCK_CLI_ADAPTER_INSTANCE = new MockAdapterClass1();
