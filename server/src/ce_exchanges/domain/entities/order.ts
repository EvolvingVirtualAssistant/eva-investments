export enum OrderStatus {
  open = "open",
  closed = "closed",
  canceled = "canceled",
  expired = "expired",
}

export enum OrderType {
  market = "market",
  limit = "limit",
}

export enum OrderSide {
  buy = "buy",
  sell = "sell",
}

export interface Order {
  id: string;
  clientOrderId?: string;
  datetime?: string; // ISO8601 datetime of 'timestamp' with milliseconds
  timestamp: number;
  lastTradeTimestamp: number; // unix timestamp of the most recent trade on this order
  status: OrderStatus;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: number; // float price in quote currency (may be empty for market orders)
  average?: number; // float average filling price
  amount: number; // ordered amount of base currency
  filled: number; // filled amount of base currency
  remaining?: number; // remaining amount to fill
  cost: number; // 'filled' * 'price' (filling price used where available)
  fee?: { // fee info, if available
    currency?: string; // which currency the fee is (usually quote)
    cost: number; // the fee amount in that currency
    rate?: number; // the fee rate (if available)
  };
}

export interface CreateOrder {
  clientOrderId?: string;
  nonce?: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  amount: number;
  price: number;
}

export interface CreateOrderResponse {
  result?: Order;
  error?: string;
}

export interface PartialCreateOrderResponse {
  result?: { id: string };
  error?: string;
}

export interface OrdersResponse {
  result?: Order[];
  error?: string;
}
