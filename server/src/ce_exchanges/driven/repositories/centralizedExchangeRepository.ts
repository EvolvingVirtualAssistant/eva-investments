import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market } from "../../domain/entities/market.ts";
import { CreateOrder, Order } from "../../domain/entities/order.ts";
import { OrderBook } from "../../domain/entities/orderbook.ts";

export interface CentralizedExchangeRepository {
  fetchMarkets(
    exchange: CentralizedExchange,
  ): Promise<Market[]>;

  fetchOrderBooks(
    exchange: CentralizedExchange,
    symbol: string,
    limit: number,
  ): Promise<OrderBook[]>;

  createOrder(
    exchange: CentralizedExchange,
    order: CreateOrder,
  ): Promise<Order>;
}
