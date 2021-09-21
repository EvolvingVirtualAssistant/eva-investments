import {
  assertEquals,
  assertArrayIncludes,
} from 'https://deno.land/std/testing/asserts.ts';
import { CliConstants } from '../../../../../src/libs/cli/constants/cliConstants.ts';
import {
  CommandCliAdapter,
  CommandCliEntrypoint,
} from '../../../../../src/libs/cli/types/cli.types.ts';
import { CliContext } from '../../../../../src/libs/cli/worker/cliContext.ts';

// --------------------------------- MOCKS -----------------------------------

const MOCK_CLI_ADAPTER_COMMAND: CommandCliAdapter = {
  tokens: ['mock_cli_adapter'],
  description: 'MOCK CLI ADAPTER',
};
const MOCK_CLI_ADAPTER_NO_TOKENS_COMMAND: CommandCliAdapter = {
  tokens: [],
  description: 'MOCK CLI ADAPTER',
};
const MOCK_CLI_ENTRYPOINT_COMMAND_1: CommandCliEntrypoint = {
  tokens: ['mock_cli_entrypoint_1'],
  description: 'MOCK CLI ENTRYPOINT',
  fn: () => {},
  argsSize: 0,
  this: null,
  isFallback: false,
};
const MOCK_CLI_ENTRYPOINT_COMMAND_2: CommandCliEntrypoint = {
  tokens: ['mock_cli_entrypoint_2'],
  description: 'MOCK CLI ENTRYPOINT',
  fn: () => {},
  argsSize: 0,
  this: null,
  isFallback: false,
};

const MOCK_CLI_ADAPTER_NAME_1 = 'EXISTENT_CLI_ADAPTER_NAME_1';
const MOCK_CLI_ADAPTER_NAME_2 = 'EXISTENT_CLI_ADAPTER_NAME_2';

// --------------------------------- MOCKS -----------------------------------

Deno.test(
  'Should not register cli adapter, if no entrypoint was registered for it',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliAdapter(
      'NON_EXISTENT_CLI_ADAPTER_NAME',
      MOCK_CLI_ADAPTER_COMMAND
    );

    const cliAdapters = cliContext.getAllCliAdapters();
    assertEquals(cliAdapters.length, 0);
  }
);

function assertDefaultCliAdapter(cliContext: CliContext) {
  const cliAdapters = cliContext.getAllCliAdapters();
  assertEquals(cliAdapters.length, 1);
  assertEquals(cliAdapters[0].tokens.length, 1);
  assertEquals(
    cliAdapters[0].tokens[0],
    CliConstants.CLI_ADAPTER_DEFAULT_TOKEN
  );
  assertEquals(cliAdapters[0].description, '');
}

Deno.test(
  'Should register cli adapter as default, when no command is specified',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );

    cliContext.registerCliAdapter(MOCK_CLI_ADAPTER_NAME_1);

    assertDefaultCliAdapter(cliContext);
  }
);

Deno.test(
  'Should register cli adapter as default, when command is specified with empty tokens',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_NO_TOKENS_COMMAND
    );

    assertDefaultCliAdapter(cliContext);
  }
);

Deno.test(
  'Should register cli adapter based on token, grouping all classes with the same token for the cli adapter',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );

    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_2,
      MOCK_CLI_ENTRYPOINT_COMMAND_2
    );

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );
    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_NAME_2,
      MOCK_CLI_ADAPTER_COMMAND
    );

    const cliAdapters = cliContext.getAllCliAdapters();
    const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter(
      MOCK_CLI_ADAPTER_COMMAND.tokens[0]
    );
    assertEquals(cliAdapters.length, 1);
    assertEquals(
      cliAdapters[0].tokens.length,
      MOCK_CLI_ADAPTER_COMMAND.tokens.length
    );
    assertArrayIncludes(cliAdapters[0].tokens, MOCK_CLI_ADAPTER_COMMAND.tokens);
    assertEquals(cliEntrypoints.length, 2);
    assertArrayIncludes(cliEntrypoints, [
      {
        tokens: MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens,
        description: MOCK_CLI_ENTRYPOINT_COMMAND_1.description,
      },
      {
        tokens: MOCK_CLI_ENTRYPOINT_COMMAND_2.tokens,
        description: MOCK_CLI_ENTRYPOINT_COMMAND_2.description,
      },
    ]);
  }
);

Deno.test(
  'Should register cli adapter, containing only unique cli entrypoints',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    const cliAdapters = cliContext.getAllCliAdapters();
    const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter(
      MOCK_CLI_ADAPTER_COMMAND.tokens[0]
    );

    assertEquals(cliAdapters.length, 1);
    assertEquals(cliEntrypoints.length, 1);
  }
);

Deno.test('Should register cli entrypoint', () => {
  const cliContext = new CliContext();
  cliContext.registerCliEntrypoint(
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ENTRYPOINT_COMMAND_1
  );
});

Deno.test('Should interpret commands', () => {
  //cliContext.interpretCommand();
});

Deno.test('Should get all cli entrypoints by cli adapter', () => {
  //cliContext.getAllCliEntrypointsByCliAdapter();
});

Deno.test('Should get all cli adapters', () => {
  //cliContext.getAllCliAdapters();
});
