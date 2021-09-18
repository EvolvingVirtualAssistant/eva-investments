import { getApiSignature } from "../../../deps.ts";
import { SwaggerClientWrapper } from "../../../libs/swagger-client-mapper/mod.ts";
import { CentralizedExchangeRestAdapter } from "../../driven/data_sources/centralizedExchangeRestAdapter.ts";
import { CentralizedExchangeRepository } from "../../driven/repositories/centralizedExchangeRepository.ts";
import {
  CentralizedExchange,
  CentralizedExchangeSpec,
} from "../entities/exchange.ts";
import { Market } from "../entities/market.ts";
import SignatureBuilderMissingError from "./errors/signatureBuilderMissingError.ts";

type Dict<T> = {
  [key: string]: T;
};

export class CentralizedExchangeService {
  private OPEN_API_SCHEMAS_PATH_ENV = "OPEN_API_SCHEMAS";

  private centralizedExchangesSpecs: Dict<CentralizedExchangeSpec>;
  private centralizedExchanges: Dict<CentralizedExchange>;

  private centralizedExchangeRepository: CentralizedExchangeRepository;

  constructor() {
    this.centralizedExchangesSpecs = this.loadExchangesSpecs();
    this.centralizedExchanges = {};
    this.centralizedExchangeRepository = new CentralizedExchangeRestAdapter();
  }

  private loadExchangesSpecs(): Dict<CentralizedExchangeSpec> {
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
          dirEntryName,
          specName,
        );
      }
    }
    return exchangesSpecs;
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

  private async getExchange(exchangeId: string): Promise<CentralizedExchange> {
    return this.centralizedExchanges[exchangeId] ||
      await this.initExchange(exchangeId);
  }

  private async initExchange(exchangeId: string): Promise<CentralizedExchange> {
    const exchangeSpec = this.centralizedExchangesSpecs[exchangeId];
    if (!exchangeSpec) {
      // create specific error
      throw new Error();
    }

    const swaggerClient = await new SwaggerClientWrapper().init(
      exchangeSpec.openApiDefinitionFile,
    );

    const sign = getApiSignature(exchangeId);
    if (!sign) {
      throw new SignatureBuilderMissingError(exchangeId);
    }
    const exchange = new CentralizedExchange(swaggerClient, sign);

    this.centralizedExchanges[exchangeId] = exchange;

    return exchange;
  }
}
