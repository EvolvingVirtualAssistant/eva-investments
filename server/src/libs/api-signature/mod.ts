import KrakenSignature from './krakenSign';
import Sign from './sign';

type SignaturesMap = {
  [key: string]: (() => Sign) | undefined;
};
const signatures: SignaturesMap = {
  kraken: () => new KrakenSignature()
};

export const getApiSignature = (id: string) => {
  const initSignature = signatures[id];
  return initSignature ? initSignature() : undefined;
};
export type { Sign };
