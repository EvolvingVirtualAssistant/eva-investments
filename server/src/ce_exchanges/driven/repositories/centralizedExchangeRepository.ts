import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market } from "../../domain/entities/market.ts";
import { OrderBook } from "../../domain/entities/orderbook.ts";

export interface CentralizedExchangeRepository {
  fetchMarkets(
    exchange: CentralizedExchange,
  ): Promise<Market[]>;

  fetchOrderBooks(
    exchange: CentralizedExchange,
    symbol: string,
    count: number,
  ): Promise<OrderBook[]>;
}
