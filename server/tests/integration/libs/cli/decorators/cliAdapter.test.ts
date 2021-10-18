import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { cliAdapter } from '../../../../../src/libs/cli/decorators/cliAdapter.ts';
import { cliEntrypoint } from '../../../../../src/libs/cli/decorators/cliEntrypoint.ts';
import { Command } from '../../../../../src/libs/cli/types/cli.types.ts';
import { cliContext } from '../../../../../src/libs/cli/worker/cliContext.ts';
import { terminateCliWorker } from '../../../../../src/libs/cli/worker/cliWorker.ts';

// --------------------------------- MOCKS -----------------------------------

const MOCK_CLI_ADAPTER_COMMAND: Command = {
  tokens: ['mock_cli_adapter'],
  description: 'MOCK CLI ADAPTER',
};

const MOCK_CLI_ENTRYPOINT_COMMAND: Command = {
  tokens: ['mock_cli_entrypoint'],
  description: 'MOCK CLI ENTRYPOINT',
};

class MockClass {
  private field1: string;

  constructor(arg1: string) {
    this.field1 = arg1;
  }

  getField1() {
    return this.field1;
  }
}

const MOCK_CLASS_ARG_MOCK = 'mockString';

const MOCK_CLASS_INSTANCE = new MockClass(MOCK_CLASS_ARG_MOCK);

const MOCK_PROPERTY_DESCRIPTOR: PropertyDescriptor = {
  configurable: true,
  enumerable: false,
  value: MOCK_CLASS_INSTANCE.getField1,
  writable: true,
};

// --------------------------------- MOCKS -----------------------------------

function clearTestContext(): void {
  cliContext.clearContext();
  terminateCliWorker();
}

Deno.test('Should get class decorator without Command', () => {
  const cliAdapter1 = cliAdapter();

  assertEquals(typeof cliAdapter1, 'function');
  assertEquals(cliContext.getAllCliAdapters().length, 0);

  clearTestContext();
});

Deno.test('Should get class decorator with Command', () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);

  assertEquals(typeof cliAdapter1, 'function');
  assertEquals(cliContext.getAllCliAdapters().length, 0);

  clearTestContext();
});

Deno.test(
  'Should register cli adapter without Command, as default adapter when calling class decorator',
  () => {
    const cliAdapter1 = cliAdapter();
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.getField1.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
    });
    const newMockClass = cliAdapter1(MockClass);

    const cliAdapters = cliContext.getAllCliAdapters();

    assertEquals(newMockClass !== MockClass, true);
    assertEquals(cliAdapters.length, 1);
    assertEquals(cliAdapters[0].tokens[0], '');

    clearTestContext();
  }
);

Deno.test(
  'Should register cli adapter with Command, when calling class decorator',
  () => {
    const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.getField1.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
    });
    const newMockClass = cliAdapter1(MockClass);

    const cliAdapters = cliContext.getAllCliAdapters();

    assertEquals(newMockClass !== MockClass, true);
    assertEquals(cliContext.getAllCliAdapters().length, 1);
    assertEquals(cliAdapters[0].tokens[0], MOCK_CLI_ADAPTER_COMMAND.tokens[0]);

    clearTestContext();
  }
);

Deno.test(
  'Should return singleton of class with cli adapter, regardless of multiple instantiations',
  () => {
    const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.getField1.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
    });
    const newMockClass = cliAdapter1(MockClass) as typeof MockClass;

    const instance1 = new newMockClass(MOCK_CLASS_ARG_MOCK);
    assertEquals(instance1.getField1(), MOCK_CLASS_ARG_MOCK);

    const instance2 = new newMockClass('Some other arg');
    assertEquals(instance2.getField1(), MOCK_CLASS_ARG_MOCK);

    clearTestContext();
  }
);
