import { getApiSignature, pathJoin } from "../../../deps.ts";
import { SwaggerClientWrapper } from "../../../libs/swagger-client-mapper/mod.ts";
import { CentralizedExchangeRestAdapter } from "../../driven/data_sources/centralizedExchangeRestAdapter.ts";
import { CentralizedExchangeRepository } from "../../driven/repositories/centralizedExchangeRepository.ts";
import {
  CentralizedExchange,
  CentralizedExchangeSpec,
} from "../entities/exchange.ts";
import { Market } from "../entities/market.ts";
import { CreateOrder, Order } from "../entities/order.ts";
import { OrderBook } from "../entities/orderbook.ts";
import ExchangeSpecMissingError from "./errors/exchangeSpecMissingError.ts";
import MissingAPIKeyFileError from "./errors/missingAPIKeyFileError.ts";
import SignatureBuilderMissingError from "./errors/signatureBuilderMissingError.ts";

type Dict<T> = {
  [key: string]: T;
};

type APIKeysByExchange = {
  [key: string]: { private?: string; public?: string };
};

export class CentralizedExchangeService {
  private OPEN_API_SCHEMAS_PATH_ENV = "OPEN_API_SCHEMAS";
  private API_KEYS = "API_KEYS";

  private apiKeysByCentralizedExchanges: APIKeysByExchange = {};
  private centralizedExchangesSpecs: Dict<CentralizedExchangeSpec> = {};
  private centralizedExchanges: Dict<CentralizedExchange>;

  private centralizedExchangeRepository: CentralizedExchangeRepository;

  constructor() {
    this.centralizedExchanges = {};
    this.centralizedExchangeRepository = new CentralizedExchangeRestAdapter();
  }

  public async init() {
    this.apiKeysByCentralizedExchanges = await this.loadExchangesRESTApiKeys();
    this.centralizedExchangesSpecs = await this.loadExchangesSpecs();
    return this;
  }

  private async loadExchangesSpecs(): Promise<Dict<CentralizedExchangeSpec>> {
    const exchangesSpecs: Dict<CentralizedExchangeSpec> = {};

    const openApiSchemasFolderPath: string =
      Deno.env.get(this.OPEN_API_SCHEMAS_PATH_ENV) || "";
    let specName = "";
    let dirEntryName = "";
    for await (const dirEntry of Deno.readDir(openApiSchemasFolderPath)) {
      if (dirEntry.isFile) {
        dirEntryName = dirEntry.name;
        specName = dirEntryName.substring(0, dirEntryName.lastIndexOf("."));
        exchangesSpecs[specName] = new CentralizedExchangeSpec(
          pathJoin(openApiSchemasFolderPath, dirEntryName),
          specName,
        );
      }
    }
    return exchangesSpecs;
  }

  private async loadExchangesRESTApiKeys(): Promise<APIKeysByExchange> {
    const keysByExchange: APIKeysByExchange = {};

    const openApiSchemasFolderPath: string = Deno.env.get(this.API_KEYS) || "";
    let exchangeName = "";
    let fileName = "";
    let apiKeysProperty: "public" | "private" = "public";
    for await (const dirEntry of Deno.readDir(openApiSchemasFolderPath)) {
      if (dirEntry.isFile) {
        apiKeysProperty = "public";
        fileName = dirEntry.name;
        if (fileName.endsWith("_api_private_key")) {
          apiKeysProperty = "private";
        }
        exchangeName = fileName.substring(0, fileName.lastIndexOf("_api_"));
        if (!keysByExchange[exchangeName]) {
          keysByExchange[exchangeName] = {};
        }

        keysByExchange[exchangeName][apiKeysProperty] = pathJoin(
          openApiSchemasFolderPath,
          fileName,
        );
      }
    }

    return keysByExchange;
  }

  public async fetchMarkets(
    exchangeId: string,
    refresh = false,
  ): Promise<Market[]> {
    const exchange = await this.getExchange(exchangeId);

    // call repository.fetchMarkets(exchange)
    if (refresh) {
      exchange.markets = await this.centralizedExchangeRepository.fetchMarkets(
        exchange,
      );
    }

    return exchange.markets;
  }

  public async fetchOrderBooks(
    exchangeId: string,
    symbol: string,
    limit = 20,
  ): Promise<OrderBook[]> {
    const exchange = await this.getExchange(exchangeId);

    const orderBooks = await this.centralizedExchangeRepository.fetchOrderBooks(
      exchange,
      symbol,
      limit,
    );

    return orderBooks;
  }

  public async createOrder(
    exchangeId: string,
    order: CreateOrder,
  ): Promise<Order> {
    const exchange = await this.getExchange(exchangeId);

    const resultOrder = await this.centralizedExchangeRepository.createOrder(
      exchange,
      order,
    );

    return resultOrder;
  }

  public async fetchOrders(
    exchangeId: string,
    clientOrderId: string,
    orderId?: string,
  ): Promise<Order[]> {
    const exchange = await this.getExchange(exchangeId);

    const orders = await this.centralizedExchangeRepository.fetchOrders(
      exchange,
      exchange.getNonce(),
      clientOrderId,
      orderId,
    );

    return orders;
  }

  private async getExchange(exchangeId: string): Promise<CentralizedExchange> {
    return this.centralizedExchanges[exchangeId] ||
      await this.initExchange(exchangeId);
  }

  private async initExchange(exchangeId: string): Promise<CentralizedExchange> {
    const exchangeSpec = this.centralizedExchangesSpecs[exchangeId];
    if (!exchangeSpec) {
      throw new ExchangeSpecMissingError(exchangeId);
    }

    const swaggerClient = await new SwaggerClientWrapper().init(
      exchangeSpec.openApiDefinitionFile,
    );

    const sign = getApiSignature(exchangeId);
    if (!sign) {
      throw new SignatureBuilderMissingError(exchangeId);
    }

    const privateKey = await this.readApiKey(
      exchangeId,
      this.apiKeysByCentralizedExchanges[exchangeId]?.private,
    );
    const publicKey = await this.readApiKey(
      exchangeId,
      this.apiKeysByCentralizedExchanges[exchangeId]?.public,
    );

    const exchange = new CentralizedExchange(
      swaggerClient,
      sign,
      privateKey,
      publicKey,
    );

    this.centralizedExchanges[exchangeId] = exchange;

    return exchange;
  }

  private async readApiKey(
    exchangeId: string,
    fileName?: string,
  ): Promise<string> {
    if (!fileName) {
      throw new MissingAPIKeyFileError(exchangeId);
    }

    return await Deno.readTextFile(fileName);
  }
}
