import { CreateOrder } from "../../../domain/entities/order.ts";

class OrderNotCreatedError extends Error {
  constructor(order: CreateOrder, error?: string) {
    super(
      `Could not create order: ${order} .` +
        (error ? ` Error message: ${error}.` : ""),
    );
  }
}

export default OrderNotCreatedError;
