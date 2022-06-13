class NoAccountsProvidedError extends Error {
  constructor(path: string) {
    super(`No accounts provided in the following file: ${path}.`);
  }
}

export default NoAccountsProvidedError;
