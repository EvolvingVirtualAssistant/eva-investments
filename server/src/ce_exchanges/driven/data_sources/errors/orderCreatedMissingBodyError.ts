class OrderCreatedMissingBodyError extends Error {
  constructor(clientOrderId?: string) {
    super(
      `Order with clientOrderId "${clientOrderId}" created but no body was provided in the response.`,
    );
  }
}

export default OrderCreatedMissingBodyError;
