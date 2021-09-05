import { SwaggerClientWrapper } from "../../../libs/swagger-client-mapper/mod.ts";
import { Market } from "./market.ts";

export class CentralizedExchangeSpec {
  openApiDefinitionFile: string;
  name: string;

  constructor(openApiFile: string, name: string) {
    this.openApiDefinitionFile = openApiFile;
    this.name = name;
  }
}

export class CentralizedExchange {
  readonly swaggerClient: SwaggerClientWrapper;
  markets: Market[] = [];

  constructor(swaggerClient: SwaggerClientWrapper) {
    this.swaggerClient = swaggerClient;
  }
}
