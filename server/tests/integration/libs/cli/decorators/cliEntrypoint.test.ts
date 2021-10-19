import {
  assertArrayIncludes,
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import { CliConstants } from '../../../../../src/libs/cli/constants/cliConstants.ts';
import { cliAdapter } from '../../../../../src/libs/cli/decorators/cliAdapter.ts';
import { cliEntrypoint } from '../../../../../src/libs/cli/decorators/cliEntrypoint.ts';
import { CliError } from '../../../../../src/libs/cli/errors/cliError.ts';
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

const MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND: Command = {
  tokens: ['help'],
  description: 'MOCK CLI ENTRYPOINT FALLBACK',
};

class MockClass {
  private field1: string;
  private parsedArgs: any[];
  private fallbackCalled: boolean;
  private fallbackErrMsg: string;

  constructor(arg1: string) {
    this.field1 = arg1;
    this.parsedArgs = [];
    this.fallbackCalled = false;
    this.fallbackErrMsg = '';
  }

  getField1() {
    return this.field1;
  }

  fallback(errMsg: string) {
    this.fallbackCalled = true;
    this.fallbackErrMsg = errMsg;
  }

  receiveParsedArgs(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any) {
    this.parsedArgs = [arg1, arg2, arg3, arg4, arg5];
  }

  getParsedArgs(): any[] {
    return this.parsedArgs;
  }

  varArgs(...args: any[]) {}

  optionalArgs(arg1: string, arg2?: string) {}

  defaultArgs(arg1: string, arg2 = 'default_value') {}

  getFallbackCalled(): boolean {
    return this.fallbackCalled;
  }

  getFallbackErrMsg(): string {
    return this.fallbackErrMsg;
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

Deno.test('Should get method decorator', () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

  cliAdapter1(MockClass);

  assertEquals(typeof cliEntrypoint1, 'function');
  assertEquals(cliContext.getAllCliAdapters().length, 0);

  clearTestContext();
});

Deno.test(
  'Should throw error while registering cli entrypoint, because no tokens were specified',
  () => {
    const cliEntrypoint1 = cliEntrypoint(
      { ...MOCK_CLI_ENTRYPOINT_COMMAND, tokens: [] },
      false
    );

    assertThrows(
      () =>
        cliEntrypoint1(
          MOCK_CLASS_INSTANCE,
          MOCK_CLASS_INSTANCE.getField1.name,
          {
            ...MOCK_PROPERTY_DESCRIPTOR,
          }
        ),
      CliError,
      CliConstants.NO_TOKENS_SPECIFIED(
        MOCK_CLASS_INSTANCE.getField1.name,
        MOCK_CLASS_INSTANCE.constructor.name
      )
    );

    clearTestContext();
  }
);

Deno.test(
  'Should throw error while registering cli entrypoint as fallback, because method does not contain an error message argument',
  () => {
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, true);

    assertThrows(
      () =>
        cliEntrypoint1(
          MOCK_CLASS_INSTANCE,
          MOCK_CLASS_INSTANCE.getField1.name,
          {
            ...MOCK_PROPERTY_DESCRIPTOR,
          }
        ),
      CliError,
      CliConstants.FALLBACK_MISSING_ARG(
        MOCK_CLASS_INSTANCE.getField1.name,
        MOCK_CLASS_INSTANCE.constructor.name
      )
    );

    clearTestContext();
  }
);

Deno.test('Should register cli entrypoint as fallback', () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = cliEntrypoint(
    MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND,
    true
  );

  cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.fallback.name, {
    ...MOCK_PROPERTY_DESCRIPTOR,
    value: MOCK_CLASS_INSTANCE.fallback,
  });

  cliAdapter1(MockClass);
  const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter(
    MOCK_CLI_ADAPTER_COMMAND.tokens[0]
  );

  assertEquals(cliContext.getAllCliAdapters().length, 1);
  assertEquals(cliEntrypoints.length, 1);
  assertArrayIncludes(
    cliEntrypoints[0].tokens,
    MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND.tokens
  );

  clearTestContext();
});

Deno.test('Should parse specific types when interpreting command', async () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

  cliEntrypoint1(
    MOCK_CLASS_INSTANCE,
    MOCK_CLASS_INSTANCE.receiveParsedArgs.name,
    {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.receiveParsedArgs,
    }
  );

  const newMockClass = cliAdapter1(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  await cliContext.interpretCommand([
    MOCK_CLI_ADAPTER_COMMAND.tokens[0],
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    'true',
    '2',
    'arg3',
    '["array_not_parsed_as_array]',
    '{"fiel1":"object_not_parsed_as_object}',
  ]);

  const parsedArgs = mockClassInstance.getParsedArgs();

  assertEquals(parsedArgs.length, 5);
  assertEquals(typeof parsedArgs[0], 'boolean');
  assertEquals(typeof parsedArgs[1], 'number');
  assertEquals(typeof parsedArgs[2], 'string');
  assertEquals(typeof parsedArgs[3], 'string');
  assertEquals(typeof parsedArgs[4], 'string');

  clearTestContext();
});

Deno.test(
  'Should register cli entrypoint with varargs, as not having any arguments',
  async () => {
    const defaultCliAdapter = cliAdapter();
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);
    const cliEntrypoint2 = cliEntrypoint(
      MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND,
      true
    );

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.varArgs.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.varArgs,
    });

    cliEntrypoint2(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.fallback.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.fallback,
    });

    const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

    const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

    assertEquals(mockClassInstance.getFallbackCalled(), false);

    const invalidToken =
      'argument_that_will_cause_fallback_fn_to_be_called_afterwards';
    await cliContext.interpretCommand([
      MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
      invalidToken,
    ]);

    assertEquals(mockClassInstance.getFallbackCalled(), true);
    assertEquals(
      mockClassInstance.getFallbackErrMsg(),
      CliConstants.CLI_TOKEN_NOT_FOUND(invalidToken)
    );

    clearTestContext();
  }
);

Deno.test(
  'Should register cli entrypoint with default argument, as having one less arg per default arg',
  async () => {
    const defaultCliAdapter = cliAdapter();
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);
    const cliEntrypoint2 = cliEntrypoint(
      MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND,
      true
    );

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.defaultArgs.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.defaultArgs,
    });

    cliEntrypoint2(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.fallback.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.fallback,
    });

    const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

    const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

    assertEquals(mockClassInstance.getFallbackCalled(), false);

    const notArg2 =
      'argument_that_will_cause_fallback_fn_to_be_called_afterwards';
    await cliContext.interpretCommand([
      MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
      'arg1',
      notArg2,
    ]);

    assertEquals(mockClassInstance.getFallbackCalled(), true);
    assertEquals(
      mockClassInstance.getFallbackErrMsg(),
      CliConstants.CLI_TOKEN_NOT_FOUND(notArg2)
    );

    clearTestContext();
  }
);

Deno.test(
  'Should register cli entrypoint with optional argument, as requiring all args to be specified',
  async () => {
    const defaultCliAdapter = cliAdapter();
    const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);
    const cliEntrypoint2 = cliEntrypoint(
      MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND,
      true
    );

    cliEntrypoint1(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.optionalArgs.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.optionalArgs,
    });

    cliEntrypoint2(MOCK_CLASS_INSTANCE, MOCK_CLASS_INSTANCE.fallback.name, {
      ...MOCK_PROPERTY_DESCRIPTOR,
      value: MOCK_CLASS_INSTANCE.fallback,
    });

    const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

    const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

    assertEquals(mockClassInstance.getFallbackCalled(), false);

    await cliContext.interpretCommand([
      MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
      'arg1',
    ]);

    assertEquals(mockClassInstance.getFallbackCalled(), true);
    assertEquals(
      mockClassInstance.getFallbackErrMsg(),
      CliConstants.CLI_MISSING_ARGS(
        MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
        '2',
        '1'
      )
    );

    clearTestContext();
  }
);
