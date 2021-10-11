class CouldNotFetchOrdersError extends Error {
  constructor(error?: string) {
    super(
      "Could not fetch orders." + (error ? ` Error message: ${error}.` : ""),
    );
  }
}

export default CouldNotFetchOrdersError;
