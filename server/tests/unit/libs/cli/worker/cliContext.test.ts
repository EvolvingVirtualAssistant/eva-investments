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

const MOCK_CLI_ADAPTER_INSTANCE = {};

// --------------------------------- MOCKS -----------------------------------

Deno.test(
  'Should not register cli adapter, if no entrypoint was registered for it',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
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

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1
    );

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
      MOCK_CLI_ADAPTER_INSTANCE,
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
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );
    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
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
      MOCK_CLI_ADAPTER_INSTANCE,
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

  cliContext.registerCliAdapter(
    MOCK_CLI_ADAPTER_INSTANCE,
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ADAPTER_COMMAND
  );

  const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter(
    MOCK_CLI_ADAPTER_COMMAND.tokens[0]
  );

  assertEquals(cliEntrypoints.length, 1);
  assertEquals(
    cliEntrypoints[0].tokens.length,
    MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens.length
  );
  assertEquals(
    cliEntrypoints[0].tokens.every((t1) =>
      MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens.includes(t1)
    ),
    true
  );
});

Deno.test('Should update cli entrypoint class instance', () => {
  const cliContext = new CliContext();
  cliContext.updateCliEntrypointClassInstance(MOCK_CLI_ADAPTER_INSTANCE, {});
});

Deno.test(
  'Should interpret commands using registered adapter and entrypoints',
  () => {
    let mockFnFallbackCalled = false;
    let mockFnCalled = false;

    // Mock function
    const mockFnFallback = function () {
      mockFnFallbackCalled = true;
    };
    const mockFn = function (_arg1: string, _arg2: string) {
      mockFnCalled = true;
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFnFallback,
      isFallback: true,
    });

    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_2,
      fn: mockFn,
      isFallback: false,
      argsSize: 2,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      MOCK_CLI_ADAPTER_COMMAND.tokens[0],
      MOCK_CLI_ENTRYPOINT_COMMAND_2.tokens[0],
      'arg1',
      'arg2',
    ]);

    assertEquals(mockFnFallbackCalled, false);
    assertEquals(mockFnCalled, true);
  }
);

Deno.test(
  'Should not interpret commands if no cli adapter was registered',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function () {
      mockFnCalled = true;
    };

    // Register default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.interpretCommand(MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens);

    assertEquals(mockFnCalled, false);
  }
);

Deno.test(
  'Should not interpret commands if no cli entrypoint was registered',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand(MOCK_CLI_ADAPTER_COMMAND.tokens);
    // There's nothing to assert has there is no function being called
    // The only thing we can ensure is that no exception is thrown
  }
);

Deno.test(
  'Should not interpret commands if no default cli adapter was registered',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function () {
      mockFnCalled = true;
    };

    // Register default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      'some_other_cli_adapter_token_diff_from_the_one_registered',
      MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens[0],
    ]);

    assertEquals(mockFnCalled, false);
  }
);

Deno.test(
  'Should not interpret commands if no fallback cli entrypoint was registered',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function () {
      mockFnCalled = true;
    };

    // Register default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: false,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      MOCK_CLI_ADAPTER_COMMAND.tokens[0],
      'some_other_cli_entrypoint_token_diff_from_the_one_registered',
    ]);

    assertEquals(mockFnCalled, false);
  }
);

Deno.test(
  'Should interpret commands, calling fallback entrypoint of default adapter on invalid token',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function (errMsg?: string) {
      mockFnCalled = true;
      assertEquals(errMsg, CliConstants.CLI_TOKEN_NOT_FOUND('invalid_token'));
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1
    );

    cliContext.interpretCommand(['invalid_token']);

    assertEquals(mockFnCalled, true);
  }
);

Deno.test(
  'Should interpret commands, calling fallback entrypoint of default adapter on missing entrypoint token for default adapter',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function (errMsg?: string) {
      mockFnCalled = true;
      assertEquals(errMsg, CliConstants.CLI_TOKEN_NOT_FOUND('missing_token'));
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1
    );

    cliContext.interpretCommand(['', 'missing_token']);

    assertEquals(mockFnCalled, true);
  }
);

Deno.test(
  'Should interpret commands, calling fallback entrypoint of adapter on missing entrypoint token',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function (errMsg?: string) {
      mockFnCalled = true;
      assertEquals(errMsg, CliConstants.CLI_TOKEN_NOT_FOUND('missing_token'));
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      MOCK_CLI_ADAPTER_COMMAND.tokens[0],
      'missing_token',
    ]);

    assertEquals(mockFnCalled, true);
  }
);

Deno.test(
  'Should interpret commands, calling fallback entrypoint of adapter by specifying fallback token',
  () => {
    let mockFnCalled = false;

    // Mock function
    const mockFn = function (errMsg?: string) {
      mockFnCalled = true;
      assertEquals(errMsg, undefined);
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFn,
      isFallback: true,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      MOCK_CLI_ADAPTER_COMMAND.tokens[0],
      MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens[0],
    ]);

    assertEquals(mockFnCalled, true);
  }
);

Deno.test(
  'Should interpret commands, calling fallback entrypoint of adapter on missing entrypoint args',
  () => {
    let mockFnFallbackCalled = false;
    let mockFnCalled = false;

    // Mock function
    const mockFnFallback = function (errMsg?: string) {
      mockFnFallbackCalled = true;
      assertEquals(
        errMsg,
        CliConstants.CLI_MISSING_ARGS(
          MOCK_CLI_ENTRYPOINT_COMMAND_2.tokens[0],
          '2',
          '1'
        )
      );
    };
    const mockFn = function (_arg1: string, _arg2: string) {
      mockFnCalled = true;
    };

    // Register default adapter and default entrypoint
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_1,
      fn: mockFnFallback,
      isFallback: true,
    });

    cliContext.registerCliEntrypoint(MOCK_CLI_ADAPTER_NAME_1, {
      ...MOCK_CLI_ENTRYPOINT_COMMAND_2,
      fn: mockFn,
      isFallback: false,
      argsSize: 2,
    });

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ADAPTER_COMMAND
    );

    cliContext.interpretCommand([
      MOCK_CLI_ADAPTER_COMMAND.tokens[0],
      MOCK_CLI_ENTRYPOINT_COMMAND_2.tokens[0],
      'arg1',
    ]);

    assertEquals(mockFnFallbackCalled, true);
    assertEquals(mockFnCalled, false);
  }
);

Deno.test('Should get no cli entrypoints on wrong token', () => {
  const cliContext = new CliContext();
  cliContext.registerCliEntrypoint(
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ENTRYPOINT_COMMAND_1
  );

  cliContext.registerCliAdapter(
    MOCK_CLI_ADAPTER_INSTANCE,
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ADAPTER_COMMAND
  );

  const cliEntrypoints =
    cliContext.getAllCliEntrypointsByCliAdapter('WRONG_TOKEN');

  assertEquals(cliEntrypoints.length, 0);
});

Deno.test(
  'Should get cli entrypoints from default adapter when not specifying token',
  () => {
    const cliContext = new CliContext();
    cliContext.registerCliEntrypoint(
      MOCK_CLI_ADAPTER_NAME_1,
      MOCK_CLI_ENTRYPOINT_COMMAND_1
    );

    cliContext.registerCliAdapter(
      MOCK_CLI_ADAPTER_INSTANCE,
      MOCK_CLI_ADAPTER_NAME_1
    );

    const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter();

    assertEquals(cliEntrypoints.length, 1);
    assertArrayIncludes(
      cliEntrypoints[0].tokens,
      MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens
    );
  }
);

Deno.test('Should get all cli entrypoints by cli adapter', () => {
  const cliContext = new CliContext();
  cliContext.registerCliEntrypoint(
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ENTRYPOINT_COMMAND_1
  );

  cliContext.registerCliAdapter(
    MOCK_CLI_ADAPTER_INSTANCE,
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ADAPTER_COMMAND
  );

  const cliEntrypoints = cliContext.getAllCliEntrypointsByCliAdapter(
    MOCK_CLI_ADAPTER_COMMAND.tokens[0]
  );

  assertEquals(cliEntrypoints.length, 1);
  assertEquals(
    cliEntrypoints[0].description,
    MOCK_CLI_ENTRYPOINT_COMMAND_1.description
  );
  assertArrayIncludes(
    cliEntrypoints[0].tokens,
    MOCK_CLI_ENTRYPOINT_COMMAND_1.tokens
  );
});

Deno.test('Should get all cli adapters', () => {
  const cliContext = new CliContext();
  cliContext.registerCliEntrypoint(
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ENTRYPOINT_COMMAND_1
  );

  cliContext.registerCliAdapter(
    MOCK_CLI_ADAPTER_INSTANCE,
    MOCK_CLI_ADAPTER_NAME_1,
    MOCK_CLI_ADAPTER_COMMAND
  );

  const cliAdapters = cliContext.getAllCliAdapters();

  assertEquals(cliAdapters.length, 1);
  assertEquals(
    cliAdapters[0].description,
    MOCK_CLI_ADAPTER_COMMAND.description
  );
  assertArrayIncludes(cliAdapters[0].tokens, MOCK_CLI_ADAPTER_COMMAND.tokens);
});
