class CouldNotFetchMarketsError extends Error {
  constructor(exchangeId: string, error?: string) {
    super(
      `Could not fetch markets for exchange ${exchangeId}.` +
        (error ? ` Error message: ${error}.` : ""),
    );
  }
}

export default CouldNotFetchMarketsError;
