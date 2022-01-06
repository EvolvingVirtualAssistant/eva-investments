import { pathJoin, ROOT_PATH } from '../../../../../src/deps';
import { test, assertEquals, assertThrows } from '../../../../wrap/testWrapper';
import MapperNotFoundError from '../../../../../src/libs/swagger-client-mapper/mapper/errors/mapperNotFoundError';
import OpenApiSpecMissingPropertyError from '../../../../../src/libs/swagger-client-mapper/mapper/errors/openApiSpecMissingPropertyError';
import SwaggerSchemaMapper from '../../../../../src/libs/swagger-client-mapper/mapper/swaggerSchemaMapper';
import { TypedSwaggerClient } from '../../../../../src/libs/swagger-client-mapper/swaggerClient';
import {
  readFile,
  SwaggerClient
} from '../../../../../src/libs/swagger-client-mapper/deps';

//NOT HAPPY WITH RELATIVE PATHS
const OPEN_API_SCHEMA_EXAMPLE_PATH = pathJoin(
  ROOT_PATH,
  '/tests/unit/libs/swagger-client-mapper/mapper/openApiSchemaExample.json'
);
const GET_OPERATION_ID = 'fetchAssets';
const SUCCESS_HTTP_STATUS = 200;

async function readSpecAndParseToJSON(openApiSpecPath: string) {
  const specContentText = await readFile(openApiSpecPath);
  return JSON.parse(specContentText.toString());
}

function createSwaggerClient(
  spec: Record<string, any>
): Promise<TypedSwaggerClient> {
  return new SwaggerClient({ spec }) as unknown as Promise<TypedSwaggerClient>;
}

async function initSwaggerSchemaMapper() {
  const specJson = await readSpecAndParseToJSON(OPEN_API_SCHEMA_EXAMPLE_PATH);
  return initSwaggerSchemaMapperWithSpecifiedSpecJson(specJson);
}

function initSwaggerSchemaMapperWithSpecifiedSpecJson(
  specJson: Record<string, any>
) {
  const swaggerSchemaMapper = new SwaggerSchemaMapper(specJson);
  //needed because it alters the specJson slightly

  const swaggerClient = createSwaggerClient(specJson);
  return swaggerSchemaMapper;
}

test('Should map array to object and fixed value to target', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {}
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true
      }
    ]
  });
});

test('Should map source to nested property target', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        orderMin: 4,
        orderMax: 20
      }
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true,
        limits: {
          amount: {
            min: 4,
            max: 20
          }
        }
      }
    ]
  });
});

test('Should map source array to object target', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        fees: [
          [1000, 0.24],
          [5000, 0.18],
          [10000, 0.16]
        ]
      }
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true,
        marketFees: [
          {
            volume: 1000,
            fee: 0.24
          },
          {
            volume: 5000,
            fee: 0.18
          },
          {
            volume: 10000,
            fee: 0.16
          }
        ]
      }
    ]
  });
});

test('Should map source array value to value in object', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        txid: ['txid1']
      }
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true,
        txid: 'txid1'
      }
    ]
  });
});

test('Should map source null value to target null value', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: null
      }
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true,
        baseId: null
      }
    ]
  });
});

test('Should not map source undefined value to target', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: undefined
      }
    }
  };

  const mappedResult = swaggerSchemaMapper.mapResponse(
    GET_OPERATION_ID,
    SUCCESS_HTTP_STATUS,
    sourceMock
  );

  assertEquals(mappedResult, {
    result: [
      {
        id: 'assetA',
        active: true
      }
    ]
  });
});

test("Should receive OpenApiSpecMissingPropertyError when spec is missing 'paths' property", () => {
  const specJson = {
    openapi: '3.0.0',
    info: {
      title: 'REST API',
      version: '1.0.0',
      description: 'Open Api Example'
    }
  };
  const swaggerSchemaMapper =
    initSwaggerSchemaMapperWithSpecifiedSpecJson(specJson);

  const sourceMock = {
    result: {
      assetA: {
        baseName: 'ASSET_A'
      }
    }
  };

  assertThrows(
    () =>
      swaggerSchemaMapper.mapResponse(
        GET_OPERATION_ID,
        SUCCESS_HTTP_STATUS,
        sourceMock
      ),
    OpenApiSpecMissingPropertyError,
    `Missing property "paths" on Open Api Schema: ${specJson} .`
  );
});

test('Should receive MapperNotFoundError when operationId is not correct', async () => {
  const swaggerSchemaMapper = await initSwaggerSchemaMapper();

  const sourceMock = {
    result: {
      assetA: {
        baseName: 'ASSET_A'
      }
    }
  };

  const operationId = 'wrong operation id';

  assertThrows(
    () =>
      swaggerSchemaMapper.mapResponse(
        operationId,
        SUCCESS_HTTP_STATUS,
        sourceMock
      ),
    MapperNotFoundError,
    `Could not find mapper for operationId: ${operationId}.`
  );
});
