import { CentralizedExchangeSpec, CentralizedExchange } from '../entities/exchange.ts'
import { Market } from "../entities/market.ts";

type Dict<T> = {
    [key: string]: T;
}

export class CentralizedExchangeService {

    private OPEN_API_SCHEMAS_PATH_ENV = 'OPEN_API_SCHEMAS';

    private centralizedExchangesSpecs : Dict<CentralizedExchangeSpec>;
    private centralizedExchanges : Dict<CentralizedExchange>;

    constructor() {
        this.centralizedExchangesSpecs = this.loadExchangesSpecs();
        this.centralizedExchanges = {};
    }

    private loadExchangesSpecs() : Dict<CentralizedExchangeSpec> {
        const exchangesSpecs : Dict<CentralizedExchangeSpec> = {};

        const openApiSchemasFolderPath : string = Deno.env.get(this.OPEN_API_SCHEMAS_PATH_ENV) || '';
        let specName = '';
        let dirEntryName = '';
        for await (const dirEntry of Deno.readDir(openApiSchemasFolderPath)) {
            if(dirEntry.isFile) {
                dirEntryName = dirEntry.name;
                specName = dirEntryName.substring(0, dirEntryName.lastIndexOf('.'))
                exchangesSpecs[specName] = new CentralizedExchangeSpec(dirEntryName, specName);
            }
        }
        return exchangesSpecs;
    }

    fetchMarkets(exchangeId: string) : Market[] {

        const exchange = this.getExchange(exchangeId);

        // call repository.fetchMarkets(exchange)

        return [];
    }

    private getExchange(exchangeId: string) : CentralizedExchange {
        return this.centralizedExchanges[exchangeId] || this.initExchange(exchangeId);
    }

    private initExchange(exchangeId: string) : CentralizedExchange {
        
        const exchangeSpec = this.centralizedExchangesSpecs[exchangeId];
        if(!exchangeSpec) {
            // create specific error
            throw new Error();
        }

        // create swagger client
        // ...
        // instantiate exchange
        const exchange = new CentralizedExchange();

        this.centralizedExchanges[exchangeId] = exchange;

        return exchange;
    }
}