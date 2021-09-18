import { getApiSignature, Sign } from "../../../deps.ts";
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
  sign: Sign;

  constructor(swaggerClient: SwaggerClientWrapper, sign: Sign) {
    this.swaggerClient = swaggerClient;
    this.sign = sign;
  }

  getNonce(): number {
    return Date.now();
  }

  getApiSecret(): string {
    return "secret";
  }

  getApiKey(): string {
    return "key";
  }
}
