import {
  test,
  assertArrayIncludes,
  assertEquals,
  assertThrows
} from '../../../../wrap/testWrapper';
import { CliConstants } from '../../../../../src/libs/cli/constants/cliConstants';
import { cliAdapter } from '../../../../../src/libs/cli/decorators/cliAdapter';
import { cliEntrypoint } from '../../../../../src/libs/cli/decorators/cliEntrypoint';
import { CliError } from '../../../../../src/libs/cli/errors/cliError';
import { CliContext } from '../../../../../src/libs/cli/worker/cliContext';
import { terminateCliWorker } from '../../../../../src/libs/cli/worker/cliWorker';
import {
  MOCK_CLI_ADAPTER_COMMAND,
  MOCK_CLI_ENTRYPOINT_COMMAND,
  MOCK_CLASS_ARG_MOCK,
  MOCK_CLASS_INSTANCE,
  MOCK_PROPERTY_DESCRIPTOR,
  MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND
} from '../mocks/command';
import { MockClass } from '../mocks/mockClass';

function clearTestContext(): void {
  CliContext.getInstance().clearContext();
  terminateCliWorker();
}

test('Should get method decorator', () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, false);

  cliAdapter1(MockClass);

  assertEquals(typeof cliEntrypoint1, 'function');
  assertEquals(CliContext.getInstance().getAllCliAdapters().length, 0);

  clearTestContext();
});

test('Should throw error while registering cli entrypoint, because no tokens were specified', () => {
  const cliEntrypoint1 = callDecoratorFactory({
    ...MOCK_CLI_ENTRYPOINT_COMMAND,
    tokens: []
  });

  assertThrows(
    () => callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.getField1),
    CliError,
    CliConstants.NO_TOKENS_SPECIFIED(
      MOCK_CLASS_INSTANCE.getField1.name,
      MOCK_CLASS_INSTANCE.constructor.name
    )
  );

  clearTestContext();
});

test('Should throw error while registering cli entrypoint as fallback, because method does not contain an error message argument', () => {
  const cliEntrypoint1 = cliEntrypoint(MOCK_CLI_ENTRYPOINT_COMMAND, true);

  assertThrows(
    () => callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.getField1),
    CliError,
    CliConstants.FALLBACK_MISSING_ARG(
      MOCK_CLASS_INSTANCE.getField1.name,
      MOCK_CLASS_INSTANCE.constructor.name
    )
  );

  clearTestContext();
});

test('Should register cli entrypoint as fallback', () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = callDecoratorFactoryFallback();

  callCliEntrypoint(cliEntrypoint1);

  cliAdapter1(MockClass);
  const cliEntrypoints =
    CliContext.getInstance().getAllCliEntrypointsByCliAdapter(
      MOCK_CLI_ADAPTER_COMMAND.tokens[0]
    );

  assertEquals(CliContext.getInstance().getAllCliAdapters().length, 1);
  assertEquals(cliEntrypoints.length, 1);
  assertArrayIncludes(
    cliEntrypoints[0].tokens,
    MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND.tokens
  );

  clearTestContext();
});

test('Should parse specific types when interpreting command', async () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = callDecoratorFactory();

  callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.receiveParsedArgs);

  const newMockClass = cliAdapter1(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  await CliContext.getInstance().interpretCommand([
    MOCK_CLI_ADAPTER_COMMAND.tokens[0],
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    'true',
    '2',
    'arg3',
    '["array_not_parsed_as_array]',
    '{"fiel1":"object_not_parsed_as_object}'
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

test('Should trim string types, enclosed in special characters (", \') when interpreting command', async () => {
  const cliAdapter1 = cliAdapter(MOCK_CLI_ADAPTER_COMMAND);
  const cliEntrypoint1 = callDecoratorFactory();

  callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.receiveTrimmedArgs);

  const newMockClass = cliAdapter1(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  await CliContext.getInstance().interpretCommand([
    MOCK_CLI_ADAPTER_COMMAND.tokens[0],
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    '"string1"',
    "'string2'",
    '""string3""',
    '\'"string4"\'',
    '"\'string5\'"',
    "''string6''"
  ]);

  const parsedArgs = mockClassInstance.getTrimmedArgs();

  assertEquals(parsedArgs.length, 6);
  assertEquals(parsedArgs[0], 'string1');
  assertEquals(parsedArgs[1], 'string2');
  assertEquals(parsedArgs[2], '"string3"');
  assertEquals(parsedArgs[3], '"string4"');
  assertEquals(parsedArgs[4], "'string5'");
  assertEquals(parsedArgs[5], "'string6'");

  clearTestContext();
});

test('Should register cli entrypoint with varargs, as not having any arguments', async () => {
  const defaultCliAdapter = cliAdapter();
  const cliEntrypoint1 = callDecoratorFactory();
  const cliEntrypoint2 = callDecoratorFactoryFallback();

  callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.varArgs);
  callCliEntrypoint(cliEntrypoint2);

  const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  assertEquals(mockClassInstance.getFallbackCalled(), false);

  const invalidToken =
    'argument_that_will_cause_fallback_fn_to_be_called_afterwards';
  await CliContext.getInstance().interpretCommand([
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    invalidToken
  ]);

  assertEquals(mockClassInstance.getFallbackCalled(), true);
  assertEquals(
    mockClassInstance.getFallbackErrMsg(),
    CliConstants.CLI_TOKEN_NOT_FOUND(invalidToken)
  );

  clearTestContext();
});

test('Should register cli entrypoint with default argument, as having one less arg per default arg', async () => {
  const defaultCliAdapter = cliAdapter();
  const cliEntrypoint1 = callDecoratorFactory();
  const cliEntrypoint2 = callDecoratorFactoryFallback();

  callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.defaultArgs);
  callCliEntrypoint(cliEntrypoint2);

  const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  assertEquals(mockClassInstance.getFallbackCalled(), false);

  const notArg2 =
    'argument_that_will_cause_fallback_fn_to_be_called_afterwards';
  await CliContext.getInstance().interpretCommand([
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    'arg1',
    notArg2
  ]);

  assertEquals(mockClassInstance.getFallbackCalled(), true);
  assertEquals(
    mockClassInstance.getFallbackErrMsg(),
    CliConstants.CLI_TOKEN_NOT_FOUND(notArg2)
  );

  clearTestContext();
});

test('Should register cli entrypoint with optional argument, as requiring all args to be specified', async () => {
  const defaultCliAdapter = cliAdapter();
  const cliEntrypoint1 = callDecoratorFactory();
  const cliEntrypoint2 = callDecoratorFactoryFallback();

  callCliEntrypoint(cliEntrypoint1, MOCK_CLASS_INSTANCE.optionalArgs);
  callCliEntrypoint(cliEntrypoint2);

  const newMockClass = defaultCliAdapter(MockClass) as typeof MockClass;

  const mockClassInstance = new newMockClass(MOCK_CLASS_ARG_MOCK);

  assertEquals(mockClassInstance.getFallbackCalled(), false);

  await CliContext.getInstance().interpretCommand([
    MOCK_CLI_ENTRYPOINT_COMMAND.tokens[0],
    'arg1'
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
});

function callDecoratorFactory(
  command = MOCK_CLI_ENTRYPOINT_COMMAND,
  isFallback = false
): MethodDecorator {
  return cliEntrypoint(command, isFallback);
}

function callDecoratorFactoryFallback(
  command = MOCK_CLI_ENTRYPOINT_FALLBACK_COMMAND,
  isFallback = true
): MethodDecorator {
  return cliEntrypoint(command, isFallback);
}

function callCliEntrypoint(
  cliEntrypoint = (
    _target: any,
    _key: string | symbol,
    _descriptor: PropertyDescriptor
  ) => {},
  mockClassEntrypoint: (...args: any[]) => void = MOCK_CLASS_INSTANCE.fallback,
  mockClassInstance = MOCK_CLASS_INSTANCE
) {
  cliEntrypoint(mockClassInstance, mockClassEntrypoint.name, {
    ...MOCK_PROPERTY_DESCRIPTOR,
    value: mockClassEntrypoint
  });
}
