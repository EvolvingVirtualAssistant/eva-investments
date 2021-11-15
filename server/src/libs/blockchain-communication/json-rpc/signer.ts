// This will be specifically for write

import { Web3 } from '../deps.ts';

export class Signer {
  private static instance: Signer;

  private clientLib: typeof Web3;

  constructor() {}

  static getInstance() {
    if (!Signer.instance) {
      Signer.instance = new Signer();
    }

    return Signer.instance;
  }

  setBlockchainClientLib(clientLib: typeof Web3) {
    this.clientLib = clientLib;
  }
}
