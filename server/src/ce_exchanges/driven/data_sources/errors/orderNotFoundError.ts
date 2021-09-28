class OrderNotFoundError extends Error {
  constructor(orderId: string, clientOrderId?: string) {
    super(
      `Could not find order with orderId: "${orderId}" and clientOrderId: "${clientOrderId}".`,
    );
  }
}

export default OrderNotFoundError;
