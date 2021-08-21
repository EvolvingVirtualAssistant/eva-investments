import { SwaggerClientWrapper } from "../../../libs/swagger-client-mapper/mod.ts";
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

    public async fetchMarkets(exchangeId: string) : Promise<Market[]> {

        const exchange = await this.getExchange(exchangeId);

        // call repository.fetchMarkets(exchange)

        return [];
    }

    private async getExchange(exchangeId: string) : Promise<CentralizedExchange> {
        return this.centralizedExchanges[exchangeId] || await this.initExchange(exchangeId);
    }

    private async initExchange(exchangeId: string) : Promise<CentralizedExchange> {
        
        const exchangeSpec = this.centralizedExchangesSpecs[exchangeId];
        if(!exchangeSpec) {
            // create specific error
            throw new Error();
        }

        // create swagger client
        // ...
        // instantiate exchange
        const swaggerClient = await new SwaggerClientWrapper().init(exchangeSpec.openApiDefinitionFile);
        const exchange = new CentralizedExchange(swaggerClient);

        this.centralizedExchanges[exchangeId] = exchange;

        return exchange;
    }
}