import { SwaggerClient } from '../../deps.ts';
import SwaggerSchemaMapper from "./mapper/swaggerSchemaMapper.ts";

interface OperationsCallableMap {
    // deno-lint-ignore no-explicit-any
    [key: string]: (parameters?: unknown, ...args: unknown[]) => Promise<any>
}

export interface TypedSwaggerClient extends SwaggerClient {
    apis: { default: OperationsCallableMap }
}

type SwaggerClientRequest = {
    credentials?: string,
    headers?: Record<string,string>,
    method: string,
    operationId: string,
    requestInterceptor?(req: SwaggerClientRequest): SwaggerClientRequest,
    responseInterceptor?(res: SwaggerClientResponse): SwaggerClientResponse,
    url: string
};

type SwaggerClientResponse = {
    body?: Record<string,unknown> | Array<unknown>
    data: string,
    headers?: Record<string,string>,
    obj?: Record<string,unknown> | Array<unknown>,
    ok: boolean,
    operationId: string,
    status: number,
    statusText: string,
    text?: string,
    url: string
};

export interface RestResponse<T> {
    headers?: Record<string,string>,
    status: number,
    operationId: string,
    body?: T
}

export class SwaggerClientWrapper {

    private swaggerClient!: Promise<TypedSwaggerClient>;
    private swaggerSchemaMapper!: SwaggerSchemaMapper;
    private openApiSpecPath!: string;

    constructor() {}

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

    // deno-lint-ignore ban-types
    private createSwaggerClient(spec: {}) : Promise<TypedSwaggerClient> {
        return new SwaggerClient({ spec, responseInterceptor: this.topLevelResponseInterceptor }) as unknown as Promise<TypedSwaggerClient>;
    }
    
    public async dispatchRESTRequest<T>(operationId: string): Promise<RestResponse<T> | undefined> {
        if(!this.openApiSpecPath) {
            throw new Error("SwaggerClientWrapper.init must be called before calling unknown other method in this object");
        }

        return await this.swaggerClient.then(async client => {
            const operationSignature = client.apis.default[operationId];
            const request = operationSignature({}, {
                requestInterceptor: (req: SwaggerClientRequest) => this.interfaceLevelRequesInterceptor(req, operationId)
            });
            const response = await request.then((res: SwaggerClientResponse) => {
                const payload = res.body || res.obj;
                const mappedPayload: T | undefined = payload ? this.swaggerSchemaMapper.map(res.operationId, res.status, payload) : undefined;
                return this.prepareRestResponse(res, mappedPayload);
            });
            return response;
        });
    }

    public isSuccess(response: SwaggerClientResponse): boolean {
        return response.status.toString().startsWith("2");
    }

    private prepareRestResponse<T>(response: SwaggerClientResponse, payload?: T): RestResponse<T> {
        return {
            operationId: response.operationId,
            status: response.status,
            headers: response.headers,
            body: payload,
        };
    }

    private interfaceLevelRequesInterceptor(request: SwaggerClientRequest, operationId: string) {
        request.operationId = operationId;
        //TODO: Need to add proper logging
        console.log(`Interface level request interceptor, request: ${request}`);
        return request;
      }
    
    private topLevelResponseInterceptor(this: SwaggerClientRequest, response: SwaggerClientResponse) {
        response.operationId = this.operationId;
        //TODO: Need to add proper logging
        console.log(`Top level response interceptor interceptor, response: ${response}`);
        return response;
      }
}



export async function execute() {
    for await (const dirEntry of Deno.readDir(".")) {
        console.log(dirEntry);
    }
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
            requestInterceptor: (req: unknown) => interfaceLevelRequesInterceptor(req, "fetchMarkets")
        });
        request.then(res => {
            console.log(res);
        })
        
    });
    const i = 0;
}
*/