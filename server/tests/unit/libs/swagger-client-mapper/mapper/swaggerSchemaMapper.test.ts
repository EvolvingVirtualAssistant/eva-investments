import { assertEquals, assertThrows } from "../../../../../src/deps.ts";
import { SwaggerClient } from "../../../../../src/deps.ts";
import MapperNotFoundError from "../../../../../src/libs/swagger-client-mapper/mapper/errors/mapperNotFoundError.ts";
import OpenApiSpecMissingPropertyError from "../../../../../src/libs/swagger-client-mapper/mapper/errors/openApiSpecMissingPropertyError.ts";
import SwaggerSchemaMapper from "../../../../../src/libs/swagger-client-mapper/mapper/swaggerSchemaMapper.ts";
import { TypedSwaggerClient } from "../../../../../src/libs/swagger-client-mapper/swaggerClient.ts";

//NOT HAPPY WITH RELATIVE PATHS
const OPEN_API_SCHEMA_EXAMPLE_PATH =
  "server/tests/unit/libs/swagger-client-mapper/mapper/openApiSchemaExample.json";
const GET_OPERATION_ID = "fetchAssets";
const SUCCESS_HTTP_STATUS = 200;

async function readSpecAndParseToJSON(openApiSpecPath: string) {
  const specContentText = await Deno.readTextFile(openApiSpecPath);
  return JSON.parse(specContentText);
}

function createSwaggerClient(
  // deno-lint-ignore no-explicit-any
  spec: Record<string, any>,
): Promise<TypedSwaggerClient> {
  return new SwaggerClient({ spec }) as unknown as Promise<TypedSwaggerClient>;
}

async function initSwaggerSchemaMapper() {
  const specJson = await readSpecAndParseToJSON(OPEN_API_SCHEMA_EXAMPLE_PATH);
  return initSwaggerSchemaMapperWithSpecifiedSpecJson(specJson);
}

function initSwaggerSchemaMapperWithSpecifiedSpecJson(
  // deno-lint-ignore no-explicit-any
  specJson: Record<string, any>,
) {
  const swaggerSchemaMapper = new SwaggerSchemaMapper(specJson);
  //needed because it alters the specJson slightly
  // deno-lint-ignore no-unused-vars
  const swaggerClient = createSwaggerClient(specJson);
  return swaggerSchemaMapper;
}

Deno.test("Should map array to object and fixed value to target", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {},
    },
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock,
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: "assetA",
        active: true,
      },
    ],
  });
});

Deno.test("Should map source to nested property target", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        orderMin: 4,
        orderMax: 20,
      },
    },
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock,
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: "assetA",
        active: true,
        limits: {
          amount: {
            min: 4,
            max: 20,
          },
        },
      },
    ],
  });
});

Deno.test("Should map source array to object target", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        fees: [
          [1000, 0.24],
          [5000, 0.18],
          [10000, 0.16],
        ],
      },
    },
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock,
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: "assetA",
        active: true,
        marketFees: [
          {
            volume: 1000,
            fee: 0.24,
          },
          {
            volume: 5000,
            fee: 0.18,
          },
          {
            volume: 10000,
            fee: 0.16,
          },
        ],
      },
    ],
  });
});

Deno.test("Should map source null value to target null value", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: null,
      },
    },
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock,
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: "assetA",
        active: true,
        baseId: null,
      },
    ],
  });
});

Deno.test("Should not map source undefined value to target", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: undefined,
      },
    },
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock,
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: "assetA",
        active: true,
      },
    ],
  });
});

Deno.test("Should receive OpenApiSpecMissingPropertyError when spec is missing 'paths' property", () => {
  const specJson = {
    "openapi": "3.0.0",
    "info": {
      "title": "REST API",
      "version": "1.0.0",
      "description": "Open Api Example",
    },
  };
  const swaggerSchemaMapper = initSwaggerSchemaMapperWithSpecifiedSpecJson(
    specJson,
  );

  const sourceMock = {
    result: {
      assetA: {
        baseName: "ASSET_A",
      },
    },
  };

  assertThrows(
    () =>
      swaggerSchemaMapper.mapResponse(
        GET_OPERATION_ID,
        SUCCESS_HTTP_STATUS,
        sourceMock,
      ),
    OpenApiSpecMissingPropertyError,
    `Missing property "paths" on Open Api Schema: ${specJson} .`,
  );
});

Deno.test("Should receive MapperNotFoundError when operationId is not correct", async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: "ASSET_A",
      },
    },
  };

  const operationId = "wrong operation id";

  assertThrows(
    () =>
      swaggerSchemaMapper.mapResponse(
        operationId,
        SUCCESS_HTTP_STATUS,
        sourceMock,
      ),
    MapperNotFoundError,
    `Could not find mapper for operationId: ${operationId}.`,
  );
});
