export class ProxyError extends Error {
  constructor(msg: string) {
    super(`There was an error setting up proxy: ${msg}`);
  }
}
