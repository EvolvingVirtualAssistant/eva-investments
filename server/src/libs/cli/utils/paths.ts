import { CliConstants } from "../constants/cliConstants.ts";

export function getCurrentPath() {
    var myError = new Error();
    var trace = myError?.stack?.split('\n');
    var lastLine = trace?.[trace.length - 1] || "";

    return lastLine.substring(lastLine.indexOf("/") + 1, lastLine.search(CliConstants.REGEX_COLON_DIGITS));
}