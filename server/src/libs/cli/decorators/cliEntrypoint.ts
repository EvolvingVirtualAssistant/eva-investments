import { initCliWorker } from "../worker/cliWorker.ts";
import { cliContext } from "../worker/cliContext.ts";
import { Command } from "../types/cli.types.ts";
import { CliError } from "../errors/cliError.ts";
import { CliConstants } from "../constants/cliConstants.ts";
import { getCurrentPath } from "../utils/paths.ts";

export function cliEntrypoint(command: Command): MethodDecorator {
    initCliWorker();

    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {

		if (command.tokens.length === 0) {
			throw new CliError(CliConstants.NO_TOKENS_SPECIFIED(key, target.constructor.name));
		}

        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const parsedArgs = args.map((arg) => parseType(arg));
            return original.call(this, parsedArgs);
        }

        cliContext.registerCliEntrypoint(
            CliConstants.CLI_ADAPTER_PATH_AND_CLASS(getCurrentPath(), target.constructor.name),
            {
                ...command,
                this: target,
                fn: descriptor.value,
                argsSize: original.length
            }
		);
    }
}

function parseType(arg: any): any {
	// Only strings were written to the cli, so any other type
    // was not inserted through the cli
    const argIsString = isString(arg);

    if (argIsString && isNumber(arg)) {
        return Number(arg).valueOf();
    } else if (argIsString && isBoolean(arg)) {
        return Boolean(arg).valueOf();
    }

    return arg;
}

function isString(arg: any): boolean {
    return typeof arg === 'string' || arg instanceof String;
}

function isNumber(arg: any): boolean {
    return !isNaN(Number(arg));
}

function isBoolean(arg: any): boolean {
    return arg in ['true', 'True', 'false', 'False'];
}
