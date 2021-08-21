import { SwaggerClient } from '../../deps.ts';
import SwaggerSchemaMapper from "./mapper/swaggerSchemaMapper.ts";

interface OperationsCallableMap {
    [key: string]: (parameters?: any, ...args: any[]) => Promise<any>
}

interface TypedSwaggerClient extends SwaggerClient {
    apis: { default: OperationsCallableMap }
}

class SwaggerClientWrapper {

    private swaggerClient!: Promise<TypedSwaggerClient>;
    private swaggerSchemaMapper!: SwaggerSchemaMapper;
    private openApiSpecPath!: string;

    public async init(openApiSpecPath: string) {
        this.openApiSpecPath = openApiSpecPath;
        const jsonSpec = await this.readSpecAndParseToJSON(openApiSpecPath);
        this.swaggerSchemaMapper = new SwaggerSchemaMapper(jsonSpec);
        this.swaggerClient = this.createSwaggerClient(jsonSpec);
        return this;
    }

    private async readSpecAndParseToJSON(openApiSpecPath: string){
        const specContentText = await Deno.readTextFile(openApiSpecPath);
        return JSON.parse(specContentText);
    }

    private createSwaggerClient(spec: {}) : Promise<TypedSwaggerClient> {
        return new SwaggerClient({ spec, responseInterceptor: topLevelResponseInterceptor }) as unknown as Promise<TypedSwaggerClient>;
    }
    
    public async dispatchRESTRequest(operationId: string) {
        if(!this.openApiSpecPath) {
            throw new Error("SwaggerClientWrapper.init must be called before calling any other method in this object");
        }

        return await this.swaggerClient.then(async client => {
            const operationSignature = client.apis.default[operationId];
            const request = operationSignature({}, {
                requestInterceptor: (req: any) => interfaceLevelRequesInterceptor(req, operationId)
            });
            const response = await request.then(res => {
                console.log(res);
                //map it
                const result = this.swaggerSchemaMapper.map(res.operationId, res.status, res.body);
                return result;
            });
            return response;
        });
    }
}

function interfaceLevelRequesInterceptor(request: any, operationId: string) {
    console.log('executing interface level request interceptor');
    //const a = arguments;
    request.operationId = operationId;
    console.log(request);
    return request;
  }

function topLevelResponseInterceptor(this: any, response: any) {
    console.log('executing top level response interceptor');
    //const a = arguments;
    response.operationId = this.operationId;
    console.log(response);
    return response;
  }

export async function execute() {
    const specPath = 'server/resources/exchanges/open_api_schemas/kraken.json';
    const swaggerClientWrapper = await new SwaggerClientWrapper().init(specPath);
    const response = await swaggerClientWrapper.dispatchRESTRequest("fetchMarkets");
    console.log(response);
}

/*export async function execute() {

    const specPath = 'server/resources/exchanges/open_api_schemas/kraken.json';
    const specContentText = await Deno.readTextFile(specPath);
    const spec = JSON.parse(specContentText);
    const swaggerClient : Promise<TypedSwaggerClient> = new SwaggerClient({ spec, responseInterceptor: topLevelResponseInterceptor }) as unknown as Promise<TypedSwaggerClient>;
    await swaggerClient.then(client => {
        const reqSignature = client.apis.default["fetchMarkets"];
        const request = reqSignature({}, {
            requestInterceptor: (req: any) => interfaceLevelRequesInterceptor(req, "fetchMarkets")
        });
        request.then(res => {
            console.log(res);
        })
        
    });
    const i = 0;
}
*/