import {
  RestResponse,
  SwaggerClientRequest,
} from "../../../libs/swagger-client-mapper/mod.ts";
import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market, MarketDataResponse } from "../../domain/entities/market.ts";
import {
  CreateOrder,
  CreateOrderResponse,
  Order,
  OrdersResponse,
  PartialCreateOrderResponse,
} from "../../domain/entities/order.ts";
import {
  OrderBook,
  OrderBooksResponse,
} from "../../domain/entities/orderbook.ts";
import { CentralizedExchangeRepository } from "../repositories/centralizedExchangeRepository.ts";
import CouldNotFetchMarketsError from "./errors/couldNotFetchMarketsError.ts";
import CouldNotFetchOrderBookError from "./errors/couldNotFetchOrderBookError.ts";
import CouldNotFetchOrdersError from "./errors/couldNotFetchOrdersError.ts";
import OrderCreatedMissingBodyError from "./errors/orderCreatedMissingBodyError.ts";
import OrderNotAddedMissingIdError from "./errors/orderNotAddedMissingIdError.ts";
import OrderNotCreatedError from "./errors/orderNotCreatedError.ts";
import OrderNotFoundError from "./errors/orderNotFoundError.ts";

export class CentralizedExchangeRestAdapter
  implements CentralizedExchangeRepository {
  async fetchMarkets(
    exchange: CentralizedExchange,
  ): Promise<Market[]> {
    const response: RestResponse<MarketDataResponse> = await exchange
      .swaggerClient.dispatchRESTRequest("fetchMarkets");

    if (!exchange.swaggerClient.isSuccess(response)) {
      throw new CouldNotFetchMarketsError(exchange.exchangeId);
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
      throw new CouldNotFetchOrderBookError(symbol, response.body?.error);
    }

    return response?.body?.result || [];
  }

  async createOrder(
    exchange: CentralizedExchange,
    order: CreateOrder,
  ): Promise<Order> {
    const nonce = order.nonce ? order.nonce : exchange.getNonce();
    order.nonce = nonce;
    const preProcessRequest = this.getPreProcessRequestCallback(
      exchange,
      nonce,
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

    if (!exchange.swaggerClient.isSuccess(response) || !response.body) {
      throw new OrderNotCreatedError(order, response.body?.error);
    }

    if (this.isPartialCreateOrderResponse(response.body)) {
      if (!response.body.result?.id) {
        throw new OrderNotAddedMissingIdError(order);
      }
      const orders = await this.fetchOrders(
        exchange,
        exchange.getNonce(),
        order.clientOrderId,
        response.body.result?.id,
      );
      if (orders.length) {
        return orders[0];
      } else {
        throw new OrderNotFoundError(
          response.body.result?.id,
          order.clientOrderId,
        );
      }
    }

    const createdOrder = (response.body as CreateOrderResponse).result;

    if (createdOrder == null) {
      throw new OrderCreatedMissingBodyError(order.clientOrderId);
    }

    return createdOrder!;
  }

  private getPreProcessRequestCallback = (
    exchange: CentralizedExchange,
    nonce: number,
  ) =>
    (
      request: SwaggerClientRequest,
      // deno-lint-ignore no-explicit-any
      requestParameters: any,
      // deno-lint-ignore no-explicit-any
      requestBody: any,
      requestHeaders: Record<string, string>,
    ) => {
      const apiSignature = exchange.sign.buildRESTApiSignature(
        request.url,
        nonce,
        exchange.getApiSecret(),
        request.method,
        requestBody,
        requestParameters,
      );

      requestHeaders["API-Sign"] = apiSignature;
      requestHeaders["API-Key"] = exchange.getApiKey();
    };

  private isPartialCreateOrderResponse(
    createOrderResponse: CreateOrderResponse | PartialCreateOrderResponse,
  ): createOrderResponse is PartialCreateOrderResponse {
    return (createOrderResponse as CreateOrderResponse).result?.symbol ===
      undefined;
  }

  public async fetchOrders(
    exchange: CentralizedExchange,
    nonce: number,
    clientOrderId?: string,
    orderId?: string,
  ): Promise<Order[]> {
    const preProcessRequest = this.getPreProcessRequestCallback(
      exchange,
      nonce,
    );

    const response: RestResponse<OrdersResponse> = await exchange
      .swaggerClient.dispatchRESTRequest(
        "fetchOrders",
        undefined,
        {
          nonce,
          clientOrderId,
          orderId,
        },
        preProcessRequest,
      );

    if (!exchange.swaggerClient.isSuccess(response) || !response.body) {
      throw new CouldNotFetchOrdersError(response.body?.error);
    }

    return response.body?.result || [];
  }
}
