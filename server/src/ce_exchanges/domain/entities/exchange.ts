
export class CentralizedExchangeSpec {

    openApiDefinitionFile: string;
    name: string;

    constructor(openApiFile: string, name: string) {
        this.openApiDefinitionFile = openApiFile;
        this.name = name;
    }
    
}

export class CentralizedExchange {

    readonly swaggerClient: any/*SwaggerClient*/;
    
    constructor() {

    }
}