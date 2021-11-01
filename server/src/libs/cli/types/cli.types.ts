export type CliAdapter = {
  command?: CommandCliAdapter;
  cliEntrypoints: Dictionary<CommandCliEntrypoint>;
  this?: any;
};

export type Command = {
  tokens: string[];
  description: string;
};

export type CommandCliEntrypoint = Command & {
  fn?: (...args: any[]) => void;
  argsSize: number;
  this?: any;
  isFallback: boolean; // In case this is true, the method should only receive ONE arg
  // TODO: Re-work this fallback mechanism to be more flexible to use
};

export type CommandCliAdapter = Command;

export interface Dictionary<T> {
  [key: string]: T;
}
