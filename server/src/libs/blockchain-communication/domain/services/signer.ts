// This will be specifically for write

import { Web3 } from '../../deps.ts';

export class Signer {
  private static instance: Signer;

  private clientLib: Web3 = new Web3();

  constructor() {}

  static getInstance(): Signer {
    if (!Signer.instance) {
      Signer.instance = new Signer();
    }

    return Signer.instance;
  }

  setBlockchainClientLib(clientLib: Web3) {
    this.clientLib = clientLib;
  }
}
