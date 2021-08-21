import { CentralizedExchange } from "../../domain/entities/exchange.ts";
import { Market } from "../../domain/entities/market.ts";

export interface CentralizedExchangeRepository {
    fetchMarkets(exchange : CentralizedExchange): Market[];
}