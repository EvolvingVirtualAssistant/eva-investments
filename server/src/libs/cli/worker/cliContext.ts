import { CliAdapter, CommandCliEntrypoint, CommandCliAdapter, Dictionary, Command } from "../types/cli.types.ts";
import { CliConstants } from "../constants/cliConstants.ts";

class CliContext {
    private cliAdapters: Dictionary<CliAdapter>; // CHANGE THIS CLIADAPTER NAME TO SOMETHING ELSE
    
    // Used as a temp collection.
    // This is only used because the method decorators are registered before the class decorators
    // And I need to associate the entrypoints with a temporary adapter
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

        // REMOVE THIS SHIT FROM HERE
        this.interpretCommand(["-h"]);
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

    interpretCommand(tokens: string[]) {

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

                // CLEAN THIS IF ELSE CONFUSION
                if (command == null) {
                    // TOKEN NOT FOUND
                } else {

                    if (command.argsSize === 0) {
                        // INSTEAD OF THIS WE MAY WANT TO PASS THE FUNCTION DESCRIPTOR AND USE IT HERE, MAYBE????
                        command?.fn?.call(command.this); // NOT SURE IF THIS WORKS HERE. TEST THIS

                        // reset cliAdapter
                        cliAdapter = undefined;
                    } else {
                        if (i + command.argsSize > tokens.length) {
                            // MISSING ARGS
                        } else {
                            // INSTEAD OF THIS WE MAY WANT TO PASS THE FUNCTION DESCRIPTOR AND USE IT HERE, MAYBE????
                            command?.fn?.call(command.this, tokens.slice(i, i + command.argsSize));
                            
                            // reset cliAdapter
                            cliAdapter = undefined;
                            i += command.argsSize;
                        }
                    }
                }
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