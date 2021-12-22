import { Command } from '../../../../../src/libs/cli/types/cli.types';
import { MockClass } from './mockClass';

export const MOCK_CLI_ADAPTER_COMMAND: Command = {
  tokens: ['mock_cli_adapter'],
  description: 'MOCK CLI ADAPTER'
};

export const MOCK_CLI_ENTRYPOINT_COMMAND: Command = {
  tokens: ['mock_cli_entrypoint'],
  description: 'MOCK CLI ENTRYPOINT'
};

export const MOCK_CLASS_ARG_MOCK = 'mockString';

export const MOCK_CLASS_INSTANCE = new MockClass(MOCK_CLASS_ARG_MOCK);

export const MOCK_PROPERTY_DESCRIPTOR: PropertyDescriptor = {
  configurable: true,
  enumerable: false,
  value: MOCK_CLASS_INSTANCE.getField1,
  writable: true
};

export const MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND: Command = {
  tokens: ['help'],
  description: 'MOCK CLI ENTRYPOINT FALLBACK'
};
