import { CreateOrder } from "../../../domain/entities/order.ts";

class OrderNotAddedMissingIdError extends Error {
  constructor(order: CreateOrder) {
    super(
      `Order: ${order} , was not added successfully: missing order id.`,
    );
  }
}

export default OrderNotAddedMissingIdError;
