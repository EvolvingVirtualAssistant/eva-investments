import { CliContext } from '../worker/cliContext';
import { Command } from '../types/cli.types';
import { CliError } from '../errors/cliError';
import { CliConstants } from '../constants/cliConstants';
import { isAsync } from '../utils/async';

export function cliEntrypoint(
  command: Command,
  isFallback = false
): MethodDecorator {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (command.tokens.length === 0) {
      throw new CliError(
        CliConstants.NO_TOKENS_SPECIFIED(key, target.constructor.name)
      );
    }

    const original = descriptor.value;

    if (isFallback && original.length === 0) {
      throw new CliError(
        CliConstants.FALLBACK_MISSING_ARG(key, target.constructor.name)
      );
    }

    if (isAsync(original)) {
      descriptor.value = async function (...args: any[]) {
        const parsedArgs = args.map((arg) => parseType(arg));
        return await original.call(this, ...parsedArgs);
      };
    } else {
      descriptor.value = function (...args: any[]) {
        const parsedArgs = args.map((arg) => parseType(arg));
        return original.call(this, ...parsedArgs);
      };
    }

    CliContext.getInstance().registerCliEntrypoint(target.constructor, {
      ...command,
      this: target,
      fn: descriptor.value,
      argsSize: original.length,
      isFallback
    });
  };
}

function parseType(arg: any): any {
  // Only strings were written to the cli, so any other type
  // was not inserted through the cli
  const argIsString = isString(arg);

  if (argIsString && isNumber(arg)) {
    return Number(arg).valueOf();
  } else if (argIsString && isBoolean(arg)) {
    return Boolean(arg).valueOf();
  } else if (argIsString && wrappedInStringChars(arg)) {
    return (arg as string).length === 2
      ? ''
      : (arg as string).substring(1, (arg as string).length - 1);
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
  return ['true', 'True', 'false', 'False'].includes(arg);
}

function wrappedInStringChars(arg: string) {
  return ["'", '"'].some(
    (delimiter) => arg.startsWith(delimiter) && arg.endsWith(delimiter)
  );
}
