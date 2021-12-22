interface Sign {
  buildRESTApiSignature: (
    uriPath: string,
    nonce: number,
    secret: string,
    httpMethod?: string,
    requestBody?: any,
    requestParameters?: any
  ) => string;
}

export default Sign;
