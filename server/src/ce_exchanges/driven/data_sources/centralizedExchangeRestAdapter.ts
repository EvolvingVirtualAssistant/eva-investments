import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { MarketDataResponse, Market } from "../../domain/entities/market.ts";
import { CentralizedExchangeRepository } from "../repositories/centralizedExchangeRepository.ts";

export class CentralizedExchangeRestAdapter implements CentralizedExchangeRepository {

    fetchMarkets(exchange : CentralizedExchange): Market[] {
        throw new Error("Method not implemented.");
    }

}