import KrakenSignature from "./krakenSign.ts";
import Sign from "./sign.ts";

type SignaturesMap = {
  [key: string]: (() => Sign) | undefined;
};
const signatures: SignaturesMap = {
  "kraken": () => new KrakenSignature(),
};

export const getApiSignature = (id: string) => signatures[id];
