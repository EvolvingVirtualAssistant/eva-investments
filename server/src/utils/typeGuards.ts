import { logWarn, Unit } from '../deps';

export function isType<T>(
  obj: any,
  requiredProperties: (keyof T)[],
  optionalProperties: (keyof T)[]
): obj is T {
  return (
    obj != null &&
    Object.keys(obj).length >= requiredProperties.length &&
    Object.keys(obj).length <=
      requiredProperties.length + optionalProperties.length &&
    requiredProperties.every((prop) => (obj as T)[prop] !== undefined) &&
    Object.keys(obj).every((prop) => {
      try {
        return (
          optionalProperties.includes(prop as keyof T) ||
          requiredProperties.includes(prop as keyof T)
        );
      } catch (e) {
        logWarn(
          'typeGuards - isType - Error while casting property to keyof T: ' + e
        );
      }

      return false;
    })
  );
}

export function isOfEthereUnitType(value: string): value is Unit {
  return [
    'noether',
    'wei',
    'kwei',
    'Kwei',
    'babbage',
    'femtoether',
    'mwei',
    'Mwei',
    'lovelace',
    'picoether',
    'gwei',
    'Gwei',
    'shannon',
    'nanoether',
    'nano',
    'szabo',
    'microether',
    'micro',
    'finney',
    'milliether',
    'milli',
    'ether',
    'kether',
    'grand',
    'mether',
    'gether',
    'tether'
  ].includes(value);
}
