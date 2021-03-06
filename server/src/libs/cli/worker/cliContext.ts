import {
  CliAdapter,
  CommandCliEntrypoint,
  CommandCliAdapter,
  Dictionary,
  Command
} from '../types/cli.types';
import { CliConstants } from '../constants/cliConstants';
import { isAsync } from '../utils/async';
import { CliError } from '../mod';

type Constructor = new (...args: any[]) => unknown;

export class CliContext {
  private static instance: CliContext;

  private cliAdapters: Dictionary<CliAdapter>; // CHANGE THIS CLIADAPTER NAME TO SOMETHING ELSE

  // Used as a temp collection.
  // This is only used because the method decorators are registered before the class decorators
  // and I need to associate the entrypoints with a temporary adapter
  private cliAdaptersByConstructor: CliAdapter[];
  private cliAdaptersConstructors: Constructor[];

  constructor() {
    this.cliAdapters = {};
    this.cliAdaptersByConstructor = [];
    this.cliAdaptersConstructors = [];
  }

  static getInstance(): CliContext {
    if (!CliContext.instance) {
      CliContext.instance = new CliContext();
    }

    return CliContext.instance;
  }

  private getIndexForConstructor(constructor: Constructor): number {
    return this.cliAdaptersConstructors.findIndex((c) => c === constructor);
  }

  private getCliAdapterByConstructor(
    constructor: Constructor
  ): CliAdapter | null {
    const idx = this.getIndexForConstructor(constructor);
    if (idx >= this.cliAdaptersByConstructor.length) {
      throw new CliError(
        'Error searching for cli adapter (desynced constructors)'
      );
    }

    if (idx < 0) {
      return null;
    }

    return this.cliAdaptersByConstructor[idx];
  }

  clearContext(): void {
    this.cliAdapters = {};
    this.cliAdaptersByConstructor = [];
    this.cliAdaptersConstructors = [];
  }

  registerCliAdapter(
    classInstance: any,
    cliAdapterConstructor: Constructor,
    command?: CommandCliAdapter
  ): void {
    // If it is null then no entrypoint has been registered for this adapter,
    // which basically means this adapter has no point to exist
    if (this.getCliAdapterByConstructor(cliAdapterConstructor) == null) {
      return;
    }

    // If no command was specified or it was but no tokens were specified, meaning we will be using the default one here
    if (command == null || command.tokens.length === 0) {
      this.addTokenToCliAdapter(
        cliAdapterConstructor,
        CliConstants.CLI_ADAPTER_DEFAULT_TOKEN,
        {
          tokens: [CliConstants.CLI_ADAPTER_DEFAULT_TOKEN],
          description: ''
        },
        classInstance
      );
    } else {
      command.tokens.forEach((token) =>
        this.addTokenToCliAdapter(
          cliAdapterConstructor,
          token,
          command,
          classInstance
        )
      );
    }
  }

  private addTokenToCliAdapter(
    cliAdapterConstructor: Constructor,
    token: string,
    command: CommandCliAdapter,
    classInstance: any
  ): void {
    // this.cliAdaptersByName[cliAdapterName] -> at this point should never be null
    // as methods using this one, already validate this (at least they should have)
    const cliAdapter = this.getCliAdapterByConstructor(cliAdapterConstructor);
    if (cliAdapter == null) {
      return;
    }

    // Add instance to each entrypoint
    for (const key in cliAdapter.cliEntrypoints) {
      cliAdapter.cliEntrypoints[key] = {
        ...cliAdapter.cliEntrypoints[key],
        this: classInstance
      };
    }

    if (this.cliAdapters[token] == null) {
      this.cliAdapters[token] = {
        command,
        cliEntrypoints: cliAdapter.cliEntrypoints || {}
      };
    } else {
      for (const key in cliAdapter.cliEntrypoints) {
        if (this.cliAdapters[token].cliEntrypoints[key] == null) {
          this.cliAdapters[token].cliEntrypoints[key] =
            cliAdapter.cliEntrypoints[key];
        }
      }
    }
  }

  registerCliEntrypoint(
    cliAdapterConstructor: Constructor,
    command: CommandCliEntrypoint
  ): void {
    let idx = this.getIndexForConstructor(cliAdapterConstructor);

    if (idx < 0) {
      idx = this.cliAdaptersConstructors.push(cliAdapterConstructor) - 1;
      this.cliAdaptersByConstructor.push({ cliEntrypoints: {} });

      if (idx !== this.cliAdaptersByConstructor.length - 1) {
        throw new CliError(
          'Error registering cli endpoint (desynced constructors)'
        );
      }
    }

    command.tokens
      .filter(
        (token) =>
          this.cliAdaptersByConstructor[idx].cliEntrypoints[token] == null
      )
      .forEach(
        (token) =>
          (this.cliAdaptersByConstructor[idx].cliEntrypoints[token] = command)
      );
  }

  updateCliEntrypointClassInstance(
    originalInstance: any,
    newInstance: any
  ): void {
    for (const cliAdapter in this.cliAdapters) {
      for (const cliEntrypoint in this.cliAdapters[cliAdapter].cliEntrypoints) {
        if (
          this.cliAdapters[cliAdapter].cliEntrypoints[cliEntrypoint].this ===
          originalInstance
        ) {
          this.cliAdapters[cliAdapter].cliEntrypoints[cliEntrypoint].this =
            newInstance;
        }
      }
    }
  }

  async interpretCommand(tokens: string[]) {
    let cliAdapter: CliAdapter | undefined = undefined;
    let isTokenEntrypoint = false;
    for (let i = 0; i < tokens.length; i++) {
      isTokenEntrypoint = true;

      if (cliAdapter == null) {
        cliAdapter = this.cliAdapters[tokens[i]];

        if (cliAdapter == null) {
          cliAdapter = this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN];
          isTokenEntrypoint = true;
        } else {
          isTokenEntrypoint = false;
        }
      }

      if (isTokenEntrypoint) {
        const command = cliAdapter?.cliEntrypoints[tokens[i]];

        if (command == null) {
          // Token not found
          // Attempt to call fallback entrypoint
          const fallbackEntrypoint = this.getFallbackEntrypoint(cliAdapter);
          const errMsg = CliConstants.CLI_TOKEN_NOT_FOUND(tokens[i]);
          isAsync(fallbackEntrypoint?.fn)
            ? await fallbackEntrypoint?.fn?.call(
                fallbackEntrypoint.this,
                errMsg
              )
            : fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);

          return;
        } else {
          // if it is a fallback then it only receives 1 arg which is never inserted via cli
          // only through this code in this method
          const argsSize = command.isFallback
            ? command.argsSize - 1
            : command.argsSize;

          if (argsSize === 0) {
            isAsync(command?.fn)
              ? await command?.fn?.call(command.this)
              : command?.fn?.call(command.this);

            // reset cliAdapter
            cliAdapter = undefined;
          } else {
            if (i + argsSize >= tokens.length) {
              // Missing args
              // Attempt to call fallback entrypoint
              const fallbackEntrypoint = this.getFallbackEntrypoint(cliAdapter);
              const errMsg = CliConstants.CLI_MISSING_ARGS(
                tokens[i],
                '' + argsSize,
                '' + (tokens.length - 1 - i)
              );
              isAsync(fallbackEntrypoint?.fn)
                ? await fallbackEntrypoint?.fn?.call(
                    fallbackEntrypoint.this,
                    errMsg
                  )
                : fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);

              return;
            } else {
              isAsync(command?.fn)
                ? await command?.fn?.call(
                    command.this,
                    ...tokens.slice(i + 1, i + 1 + argsSize)
                  )
                : command?.fn?.call(
                    command.this,
                    ...tokens.slice(i + 1, i + 1 + argsSize)
                  );

              // reset cliAdapter
              cliAdapter = undefined;
              i += argsSize;
            }
          }
        }
      }
    }

    if (
      tokens.length > 0 &&
      (cliAdapter = this.cliAdapters[tokens[tokens.length - 1]]) != null
    ) {
      // No options specified for the command
      // Attempt to call fallback entrypoint
      const fallbackEntrypoint = this.getFallbackEntrypoint(cliAdapter);
      const errMsg = CliConstants.CLI_COMMAND_NEEDS_OPTIONS(
        tokens[tokens.length - 1]
      );
      isAsync(fallbackEntrypoint?.fn)
        ? await fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg)
        : fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);
    }
  }

  private getFallbackEntrypoint(
    adapter?: CliAdapter
  ): CommandCliEntrypoint | undefined {
    if (adapter == null) {
      return undefined;
    }

    for (const key in adapter.cliEntrypoints) {
      if (adapter.cliEntrypoints[key].isFallback === true) {
        return adapter.cliEntrypoints[key];
      }
    }

    // In case the adapter does not contain a fallback method
    // we try to search in the default adapter for a fallback method
    for (const key in this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]
      ?.cliEntrypoints) {
      if (
        this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]
          ?.cliEntrypoints[key].isFallback === true
      ) {
        return this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]
          ?.cliEntrypoints[key];
      }
    }
  }

  getAllCliEntrypointsByCliAdapter(token?: string): Command[] {
    const entrypoints: Command[] = [];
    const cliAdapter: CliAdapter | undefined =
      this.cliAdapters[token || CliConstants.CLI_ADAPTER_DEFAULT_TOKEN];

    if (cliAdapter == null) {
      return entrypoints;
    }

    const uniqueCliEntrypoints = this.excludeEqualValuesEntrypoints(
      cliAdapter.cliEntrypoints
    );

    for (const key in uniqueCliEntrypoints) {
      entrypoints.push({
        tokens: uniqueCliEntrypoints[key].tokens,
        description: uniqueCliEntrypoints[key].description
      });
    }

    return entrypoints;
  }

  private excludeEqualValuesEntrypoints(
    cliEntrypoints: Dictionary<CommandCliEntrypoint>
  ) {
    const res: Dictionary<CommandCliEntrypoint> = {};
    let val: CommandCliEntrypoint;
    let duplicated: boolean;
    for (const keyOuter in cliEntrypoints) {
      val = cliEntrypoints[keyOuter];
      duplicated = false;
      for (const keyInner in res) {
        if (keyOuter !== keyInner && res[keyInner] === val) {
          duplicated = true;
        }
      }

      if (!duplicated) {
        res[keyOuter] = val;
      }
    }

    return res;
  }

  getAllCliAdapters(): Command[] {
    const adapters: Command[] = [];
    for (const key in this.cliAdapters) {
      adapters.push({
        tokens: this.cliAdapters[key].command?.tokens || [],
        description: this.cliAdapters[key].command?.description || ''
      });
    }

    return adapters;
  }
}

export function getAllCliEntrypointsByCliAdapter(token?: string) {
  return CliContext.getInstance().getAllCliEntrypointsByCliAdapter(token);
}

export function getAllCliAdapters() {
  return CliContext.getInstance().getAllCliAdapters();
}
