export class UninitializedError extends Error {
  constructor() {
    super(
      'BlockchainCommunication is not initialized yet. Try calling method init()'
    );
  }
}
