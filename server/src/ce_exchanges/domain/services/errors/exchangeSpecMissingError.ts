class ExchangeSpecMissingError extends Error {
  constructor(exchangeId: string) {
    super(
      `Missing exchange spec file for exchange with id: "${exchangeId}".`,
    );
  }
}

export default ExchangeSpecMissingError;
