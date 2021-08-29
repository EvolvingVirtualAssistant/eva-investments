import { CliAdapter, CommandCliEntrypoint, CommandCliAdapter, Dictionary, Command } from "../types/cli.types.ts";
import { CliConstants } from "../constants/cliConstants.ts";
import { isAsync } from "../utils/async.ts";

class CliContext {
    private cliAdapters: Dictionary<CliAdapter>; // CHANGE THIS CLIADAPTER NAME TO SOMETHING ELSE
    
    // Used as a temp collection.
    // This is only used because the method decorators are registered before the class decorators
    // and I need to associate the entrypoints with a temporary adapter
    private cliAdaptersByName: Dictionary<CliAdapter>;

    constructor() {
        this.cliAdapters = {};
        this.cliAdaptersByName = {};
    }

    registerCliAdapter(cliAdapterName: string, command?: CommandCliAdapter) {
        // If it is null then no entrypoint has been registered for this adapter,
        // which basically means this adapter has no point to exist
        if (this.cliAdaptersByName[cliAdapterName] == null) {
            return;
        }

        // If no command was specified or it was but no tokens were specified, meaning we will be using the default one here
        if (command == null || command.tokens.length === 0) {
            this.addTokenToCliAdapter(cliAdapterName, CliConstants.CLI_ADAPTER_DEFAULT_TOKEN, {
                tokens: [CliConstants.CLI_ADAPTER_DEFAULT_TOKEN],
                description: ""
            });
        } else {
            command.tokens.forEach(token => this.addTokenToCliAdapter(cliAdapterName, token, command));
        }
    }
    
    private addTokenToCliAdapter(cliAdapterName: string, token: string, command: CommandCliAdapter) {
        if (this.cliAdapters[token] == null) {
            this.cliAdapters[token] = {
                command,
                cliEntrypoints: (this.cliAdaptersByName[cliAdapterName]?.cliEntrypoints || {})
            };
        } else {
            // TEST WHAT HAPPENS IF THIS cliAdaptersByName[cliAdapterName]? IS NULL 
            for (const key in this.cliAdaptersByName[cliAdapterName]?.cliEntrypoints) {
                if (this.cliAdapters[token].cliEntrypoints[key] == null) {
                    this.cliAdapters[token].cliEntrypoints[key] = this.cliAdaptersByName[cliAdapterName].cliEntrypoints[key];
                }
            }
        }
    }

    registerCliEntrypoint(cliAdapterName: string, command: CommandCliEntrypoint) {
        if (this.cliAdaptersByName[cliAdapterName] == null) {
            this.cliAdaptersByName[cliAdapterName] = { cliEntrypoints: {} };
        }

        command.tokens.filter(token => this.cliAdaptersByName[cliAdapterName].cliEntrypoints[token] == null)
            .forEach(token => this.cliAdaptersByName[cliAdapterName].cliEntrypoints[token] = command);
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
                    isAsync(fallbackEntrypoint?.fn) ? 
                        await fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg) : 
                        fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);

                    return;
                } else {
                    // if it is a fallback then it only receives 1 arg which is never inserted via cli
                    // only through this code in this method
                    const argsSize = command.isFallback ? command.argsSize - 1 : command.argsSize;
                    
                    if (argsSize === 0) {
                        isAsync(command?.fn) ? await command?.fn?.call(command.this) : command?.fn?.call(command.this);

                        // reset cliAdapter
                        cliAdapter = undefined;
                    } else {
                        
                        if (i + argsSize >= tokens.length) {
                            // Missing args
                            // Attempt to call fallback entrypoint
                            const fallbackEntrypoint = this.getFallbackEntrypoint(cliAdapter);
                            const errMsg = CliConstants.CLI_MISSING_ARGS(tokens[i], "" + argsSize, "" + (tokens.length - 1 - i));
                            isAsync(fallbackEntrypoint?.fn) ? 
                                await fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg) : 
                                fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);
                            
                            return;
                        } else {
                            
                            isAsync(command?.fn) ? 
                                await command?.fn?.call(command.this, tokens.slice(i, i + argsSize)) : 
                                command?.fn?.call(command.this, tokens.slice(i, i + argsSize));
                            
                            // reset cliAdapter
                            cliAdapter = undefined;
                            i += argsSize;
                        }
                    }
                }
            }
        }

        if (tokens.length > 0 && (cliAdapter = this.cliAdapters[tokens[tokens.length - 1]]) != null) {
            // No options specified for the command
            // Attempt to call fallback entrypoint
            const fallbackEntrypoint = this.getFallbackEntrypoint(cliAdapter);
            const errMsg = CliConstants.CLI_COMMAND_NEEDS_OPTIONS(tokens[tokens.length - 1]);
            isAsync(fallbackEntrypoint?.fn) ? 
                await fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg) : 
                fallbackEntrypoint?.fn?.call(fallbackEntrypoint.this, errMsg);
        }
    }

    private getFallbackEntrypoint(adapter?: CliAdapter): CommandCliEntrypoint | undefined {
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
        for (const key in this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]?.cliEntrypoints) {
            if (this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]?.cliEntrypoints[key].isFallback === true) {
                return this.cliAdapters[CliConstants.CLI_ADAPTER_DEFAULT_TOKEN]?.cliEntrypoints[key];
            }
        }
    }

    getAllCliEntrypointsByCliAdapter(token?: string): Command[] {
        var entrypoints: Command[] = [];
        const cliAdapter: CliAdapter | undefined = this.cliAdapters[token || CliConstants.CLI_ADAPTER_DEFAULT_TOKEN];

        if (cliAdapter == null) {
            return entrypoints;
        }

        const uniqueCliEntrypoints = this.excludeEqualValuesEntrypoints(cliAdapter.cliEntrypoints);
        
        for (const key in uniqueCliEntrypoints) {
            entrypoints.push({
                tokens: uniqueCliEntrypoints[key].tokens,
                description: uniqueCliEntrypoints[key].description
            });
        }

        return entrypoints;
    }

    private excludeEqualValuesEntrypoints(cliEntrypoints: Dictionary<CommandCliEntrypoint>) {
        const res: Dictionary<CommandCliEntrypoint> = {};
        var val: CommandCliEntrypoint;
        var duplicated: boolean;
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
        var adapters: Command[] = [];
        for (const key in this.cliAdapters) {
            if (key !== CliConstants.CLI_ADAPTER_DEFAULT_TOKEN) {
                adapters.push({
                    tokens: this.cliAdapters[key].command?.tokens || [],
                    description: this.cliAdapters[key].command?.description || ""
                });
            }
        }

        return adapters;
    }
}

export const cliContext: CliContext = new CliContext();

export function getAllCliEntrypointsByCliAdapter(token?: string) {
    return cliContext.getAllCliEntrypointsByCliAdapter(token);
}

export function getAllCliAdapters() {
    return cliContext.getAllCliAdapters();
}