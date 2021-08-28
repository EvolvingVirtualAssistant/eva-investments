export type CliAdapter = {
    command?: CommandCliAdapter,
    cliEntrypoints: Dictionary<CommandCliEntrypoint>
}

export type Command = {
    tokens: string[],
    description: string
}

export type CommandCliEntrypoint = Command & { fn?: (...args: any[]) => void, argsSize: number, this?: any }

export type CommandCliAdapter = Command

export interface Dictionary<T> {
    [key: string]: T;
}