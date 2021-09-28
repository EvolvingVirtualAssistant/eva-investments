class CouldNotFetchOrderBookError extends Error {
  constructor(symbol: string, error?: string) {
    super(
      `Could not fetch orderbook for symbol: ${symbol}.` +
        (error ? ` Error message: ${error}.` : ""),
    );
  }
}

export default CouldNotFetchOrderBookError;
