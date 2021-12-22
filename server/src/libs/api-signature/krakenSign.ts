import { CryptoJS, stringify } from './deps';
import Sign from './sign';
import { BASE64, BINARY, SHA256, SHA512 } from './constants';

class KrakenSignature implements Sign {
  buildRESTApiSignature(
    uriPath: string,
    nonce: number,
    secret: string,
    httpMethod?: string | undefined,
    requestBody?: any,
    requestParameters?: any
  ): string {
    const toStartSubsIdx = uriPath.indexOf('.com');
    let url = uriPath;
    if (toStartSubsIdx !== -1) {
      url = uriPath.substring(toStartSubsIdx + 4);
    }
    const msg = requestBody ? stringify(requestBody) : '';
    const hashDigest = this.hash(nonce + msg, SHA256, BINARY);
    const uriBinary = this.stringToBinary(url);
    const hmacData = this.binaryConcat(uriBinary, hashDigest);
    const secretBase64 = this.stringToBase64(secret);

    const hmacDigest = this.hmac(hmacData, secretBase64, SHA512, BASE64);

    return hmacDigest;
  }

  stringToBinary = (value: string) => CryptoJS.enc.Latin1.parse(value);

  binaryConcat = (...args: string[]) => args.reduce((a, b) => a.concat(b));

  stringToBase64 = (value: string) => CryptoJS.enc.Base64.parse(value);

  hash = (request: string, hash = 'md5', digest = 'hex') => {
    const options: any = {};
    if (hash === 'keccak') {
      hash = 'SHA3';
      options['outputLength'] = 256;
    }
    const result = CryptoJS[hash.toUpperCase()](request, options);
    return digest === 'binary'
      ? result
      : result.toString(CryptoJS.enc[this.capitalize(digest)]);
  };

  hmac = (request: any, secret: string, hash = 'sha256', digest = 'hex') => {
    const result = CryptoJS['Hmac' + hash.toUpperCase()](request, secret);
    if (digest) {
      const encoding = digest === 'binary' ? 'Latin1' : this.capitalize(digest);
      return result.toString(CryptoJS.enc[this.capitalize(encoding)]);
    }
    return result;
  };

  capitalize = (s: string) =>
    s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default KrakenSignature;
