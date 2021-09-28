import { Sign } from "../../../deps.ts";
import { SwaggerClientWrapper } from "../../../libs/swagger-client-mapper/mod.ts";
import { Market } from "./market.ts";

export class CentralizedExchangeSpec {
  openApiDefinitionFile: string;
  name: string;

  constructor(
    openApiFile: string,
    name: string,
  ) {
    this.openApiDefinitionFile = openApiFile;
    this.name = name;
  }
}

export class CentralizedExchange {
  readonly swaggerClient: SwaggerClientWrapper;
  markets: Market[] = [];
  sign: Sign;
  restAPIPrivateKeyFile: string;
  restAPIPublicKeyFile: string;

  constructor(
    swaggerClient: SwaggerClientWrapper,
    sign: Sign,
    restAPIPrivateKeyFile: string,
    restAPIPublicKeyFile: string,
  ) {
    this.swaggerClient = swaggerClient;
    this.sign = sign;
    this.restAPIPrivateKeyFile = restAPIPrivateKeyFile;
    this.restAPIPublicKeyFile = restAPIPublicKeyFile;
  }

  getNonce(): number {
    return Date.now();
  }

  getApiSecret(): string {
    return this.restAPIPrivateKeyFile;
  }

  getApiKey(): string {
    return this.restAPIPublicKeyFile;
  }
}
