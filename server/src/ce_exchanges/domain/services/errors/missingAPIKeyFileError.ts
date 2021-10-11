class MissingAPIKeyFileError extends Error {
  constructor(exchangeId: string) {
    super(
      `Missing API Key file for exchange with id: ${exchangeId}.`,
    );
  }
}

export default MissingAPIKeyFileError;
