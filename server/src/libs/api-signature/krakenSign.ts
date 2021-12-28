import { CryptoJS, stringify } from './deps';
import Sign from './sign';
import { BASE64, BINARY, SHA256, SHA512 } from './constants';
import { MissingHasherHelperError } from './missingHasherHelperError';
import { MissingHmacHasherHelperError } from './missingHmacHasherHelperError';

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
    const hashDigest = this.hash(nonce + msg, SHA256, BINARY).toString(
      CryptoJS.enc.Latin1
    );
    const uriBinary = this.stringToBinary(url).toString(CryptoJS.enc.Latin1);
    const hmacData = this.binaryConcat(uriBinary, hashDigest);
    const secretBase64 = this.stringToBase64(secret).toString(
      CryptoJS.enc.Base64
    );

    const hmacDigest = this.hmac(
      hmacData,
      secretBase64,
      SHA512,
      BASE64
    ) as string;

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

    const result = this.callCryptoJSHasherHelper(
      hash.toUpperCase(),
      request,
      options
    );
    return digest === 'binary'
      ? result
      : result.toString(
          CryptoJS.enc[this.capitalize(digest) as keyof typeof CryptoJS.enc]
        );
  };

  hmac = (request: any, secret: string, hash = 'sha256', digest = 'hex') => {
    const result = this.callCryptoJSHmacHasherHelper(
      'Hmac' + hash.toUpperCase(),
      request,
      secret
    );
    if (digest) {
      const encoding = digest === 'binary' ? 'Latin1' : this.capitalize(digest);
      return result.toString(
        CryptoJS.enc[this.capitalize(encoding) as keyof typeof CryptoJS.enc]
      );
    }
    return result;
  };

  capitalize = (s: string) =>
    s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  private callCryptoJSHasherHelper(
    hash: string,
    request: string,
    options: any
  ): CryptoJS.lib.WordArray {
    switch (hash) {
      case 'MD5':
        return CryptoJS.MD5(request, options);
      case 'SHA1':
        return CryptoJS.SHA1(request, options);
      case 'SHA256':
        return CryptoJS.SHA256(request, options);
      case 'SHA224':
        return CryptoJS.SHA224(request, options);
      case 'SHA512':
        return CryptoJS.SHA512(request, options);
      case 'SHA384':
        return CryptoJS.SHA384(request, options);
      case 'SHA3':
        return CryptoJS.SHA3(request, options);
      case 'RIPEMD160':
        return CryptoJS.RIPEMD160(request, options);
    }

    throw new MissingHasherHelperError(
      `Provided hash method ${hash} not available on CryptoJs`
    );
  }

  private callCryptoJSHmacHasherHelper(
    hash: string,
    request: string,
    key: string
  ): CryptoJS.lib.WordArray {
    switch (hash) {
      case 'HmacMD5':
        return CryptoJS.HmacMD5(request, key);
      case 'HmacSHA1':
        return CryptoJS.HmacSHA1(request, key);
      case 'HmacSHA256':
        return CryptoJS.HmacSHA256(request, key);
      case 'HmacSHA224':
        return CryptoJS.HmacSHA224(request, key);
      case 'HmacSHA512':
        return CryptoJS.HmacSHA512(request, key);
      case 'HmacSHA384':
        return CryptoJS.HmacSHA384(request, key);
      case 'HmacSHA3':
        return CryptoJS.HmacSHA3(request, key);
      case 'HmacRIPEMD160':
        return CryptoJS.HmacRIPEMD160(request, key);
    }

    throw new MissingHmacHasherHelperError(
      `Provided hash method ${hash} not available on CryptoJs`
    );
  }
}

export default KrakenSignature;
