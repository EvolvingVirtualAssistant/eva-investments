import { RestResponse } from "../../../libs/swagger-client-mapper/mod.ts";
import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market, MarketDataResponse } from "../../domain/entities/market.ts";
import {
  CreateOrder,
  CreateOrderResponse,
  Order,
  PartialCreateOrderResponse,
} from "../../domain/entities/order.ts";
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
    limit: number,
  ): Promise<OrderBook[]> {
    const response: RestResponse<OrderBooksResponse> = await exchange
      .swaggerClient.dispatchRESTRequest("fetchOrderBook", { symbol, limit });

    if (!exchange.swaggerClient.isSuccess(response)) {
      //do something
    }

    return response?.body?.result || [];
  }

  async createOrder(
    exchange: CentralizedExchange,
    order: CreateOrder,
  ): Promise<Order> {
    const preProcessRequest = this.getCreateOrderPreProcessRequestCallback(
      exchange,
      order.nonce,
    );

    const response: RestResponse<
      CreateOrderResponse | PartialCreateOrderResponse
    > = await exchange
      .swaggerClient.dispatchRESTRequest(
        "createOrder",
        undefined,
        order,
        preProcessRequest,
      );

    if (!exchange.swaggerClient.isSuccess(response) && !response.body) {
      //do something
      throw new Error();
    }

    let orderResult: Order;
    if (response.body && this.isPartialCreateOrderResponse(response.body)) {
      //TODO: have to add logic in this method to see if the output of the createOrder is just an Order with an id. In that case I will have to do a GET to fetch the order
    }

    orderResult = (response.body)!.result! as Order;

    return orderResult;
  }

  private getCreateOrderPreProcessRequestCallback = (
    exchange: CentralizedExchange,
    nonce: number,
  ) =>
    (
      uriPath: string,
      httpMethod: string,
      // deno-lint-ignore no-explicit-any
      requestParameters: any,
      // deno-lint-ignore no-explicit-any
      requestBody: any,
    ) => {
      const apiSignature = exchange.sign.buildRESTApiSignature(
        uriPath,
        nonce,
        exchange.getApiSecret(),
        httpMethod,
        requestParameters,
        requestBody,
      );

      requestParameters["API-Sign"] = apiSignature;
      requestParameters["API-Key"] = exchange.getApiKey();
    };

  private isPartialCreateOrderResponse(
    createOrderResponse: CreateOrderResponse | PartialCreateOrderResponse,
  ): createOrderResponse is PartialCreateOrderResponse {
    return (createOrderResponse as CreateOrderResponse).result?.symbol ===
      undefined;
  }
}
