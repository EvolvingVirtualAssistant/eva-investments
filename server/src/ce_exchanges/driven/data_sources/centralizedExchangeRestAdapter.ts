import { RestResponse } from "../../../libs/swagger-client-mapper/mod.ts";
import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market, MarketDataResponse } from "../../domain/entities/market.ts";
import {
  OrderBook,
  OrderBooksResponse,
} from "../../domain/entities/orderbook.ts";
import { CentralizedExchangeRepository } from "../repositories/centralizedExchangeRepository.ts";

export class CentralizedExchangeRestAdapter
  implements CentralizedExchangeRepository {
  async fetchMarkets(
    exchange: CentralizedExchange,
  ): Promise<Market[]> {
    const response: RestResponse<MarketDataResponse> = await exchange
      .swaggerClient.dispatchRESTRequest("fetchMarkets");

    if (!exchange.swaggerClient.isSuccess(response)) {
      //do something
    }

    return response?.body?.result || [];
  }

  async fetchOrderBooks(
    exchange: CentralizedExchange,
    symbol: string,
    count: number,
  ): Promise<OrderBook[]> {
    const response: RestResponse<OrderBooksResponse> = await exchange
      .swaggerClient.dispatchRESTRequest("fetchOrderBook");

    if (!exchange.swaggerClient.isSuccess(response)) {
      //do something
    }

    return response?.body?.result || [];
  }
}
