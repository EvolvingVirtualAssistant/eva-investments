interface Sign {
  buildRESTApiSignature: (
    uriPath: string,
    nonce: number,
    secret: string,
    httpMethod?: string,
    // deno-lint-ignore no-explicit-any
    data?: any,
  ) => string;
}

export default Sign;
