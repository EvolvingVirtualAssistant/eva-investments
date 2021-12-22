export const BINARY = 'binary';
export const BASE64 = 'base64';
export const SHA256 = 'sha256';
export const SHA512 = 'sha512';

export const isUint8Array = (
  array: Uint8Array | string
): array is Uint8Array => {
  return (array as Uint8Array).filter !== undefined;
};
