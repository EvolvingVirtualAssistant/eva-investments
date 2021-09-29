interface Sign {
  buildRESTApiSignature: (
    uriPath: string,
    nonce: number,
    secret: string,
    httpMethod?: string,
    // deno-lint-ignore no-explicit-any
    requestBody?: any,
    // deno-lint-ignore no-explicit-any
    requestParameters?: any,
  ) => string;
}

export default Sign;
