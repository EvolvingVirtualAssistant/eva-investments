import { ParserConstants } from "../constants/cliConstants.ts"
import { CliError } from "../errors/cliError.ts";

export function tokenizer(args: string): string[] {
    if (args.trim() === "") {
        return [];
    }

    // deno-lint-ignore prefer-const
    let tokens = args.split(" ");

    ParserConstants.TOKEN_DELIMITERS.forEach(pairDelimiter => groupTokensByDelimiters(tokens, pairDelimiter.START_DELIMITER, pairDelimiter.END_DELIMITER));

    return tokens;
}

function groupTokensByDelimiters(tokens: string[], startDelimiter: string, endDelimiter: string) {
    const startIndexes = tokens.map((token, i) => [token, i])
        .filter(tuple => (<string>tuple[0]).startsWith(startDelimiter) && !(<string>tuple[0]).endsWith(endDelimiter))
        .map(tuple => <number>tuple[1]);
    const endIndexes = tokens.map((token, i) => [token, i])
        .filter(tuple => !(<string>tuple[0]).startsWith(startDelimiter) && (<string>tuple[0]).endsWith(endDelimiter))
        .map(tuple => <number>tuple[1]);

    if (startIndexes.length !== endIndexes.length) {
        throw new CliError(ParserConstants.UNMATCHING_NUM_DELIMITERS_ERROR(startDelimiter, endDelimiter));
    }

    // At each starting index we join all tokens until the corresponding end index using " "
    // We then remove all the tokens that were added to the start index
    for (let i = 0; i < startIndexes.length; i++) {
        tokens[startIndexes[i]] = tokens.slice(startIndexes[i], endIndexes[i] + 1).join(" ");
        tokens.splice(startIndexes[i] + 1, endIndexes[i] - startIndexes[i]);
    }
}