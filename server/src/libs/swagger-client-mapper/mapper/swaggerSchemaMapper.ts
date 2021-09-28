import MapperNotFoundError from "./errors/mapperNotFoundError.ts";
import OpenApiSpecMissingPropertyError from "./errors/openApiSpecMissingPropertyError.ts";

type Mapper = {
  // deno-lint-ignore no-explicit-any
  [key: string]: (source: Record<string, any>) => any;
};

export type Mappers = {
  [key: string]: Mapper;
};

type MapperItemSchema = {
  source?: string;
  value?: string;
  target: string;
  "x-mapper"?: XMapperRefSchema;
};

type MapperSchema = {
  "source_schema": { "$ref": string };
  map: MapperItemSchema[];
};

type XMapperRefSchema = {
  "source_schema": { "$$ref": string };
  map: MapperItemSchema[];
  "$$ref": string;
};

interface SwaggerSchemaMapperType {
  mapResponse<T>(
    operationId: string,
    httpStatus: number,
    source: Record<string, unknown>,
  ): T | undefined;
  mapRequestBody<T>(
    operationId: string,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any> | Array<any>,
  ): T | undefined;
  mapRequestParameter(
    operationId: string,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any>,
    // deno-lint-ignore no-explicit-any
    filterByParameterType: (parameter: Record<string, any>) => boolean,
    // deno-lint-ignore no-explicit-any
  ): Record<string, any>;
  // deno-lint-ignore no-explicit-any
  getParameterInHeaderFilter(): (parameter: Record<string, any>) => boolean;
}

class SwaggerSchemaMapper implements SwaggerSchemaMapperType {
  // deno-lint-ignore no-explicit-any
  private specJson: Record<string, any>;
  // mappers structure
  private mappers: Mappers;

  constructor(specJson: Record<string, unknown>) {
    this.specJson = specJson;
    this.mappers = this.buildMappers();
  }

  private buildMappers() {
    const mappersResult = {};
    const xMappers = this.specJson?.components?.["x-mappers"];
    if (!xMappers) {
      return mappersResult;
    }

    const pathPrefixForTopMappers = "#/components/x-mappers/";
    Object.keys(xMappers).forEach((mapperKey) => {
      this.buildMapper(
        pathPrefixForTopMappers + mapperKey,
        xMappers[mapperKey],
        mappersResult,
      );
    });
    return mappersResult;
  }

  private buildMapper(
    mapperId: string,
    mapperJson: MapperSchema,
    mappers: Mappers,
  ) {
    let sourceMappers: Mapper = mappers[mapperId];
    if (!sourceMappers) {
      sourceMappers = {};
      mappers[mapperId] = sourceMappers;
    }

    const sourceSchemaRef = mapperJson.source_schema["$ref"];
    if (sourceMappers[sourceSchemaRef]) {
      //it already exists, then skip
      return;
    }

    type mapFunctionType = (
      targetObject: unknown,
      sourceObject?: Record<string, unknown> | Array<unknown>,
    ) => unknown;

    const mappingFunctions: Record<string, mapFunctionType> = mapperJson.map
      .map((item: MapperItemSchema) => {
        const key = item.target;
        let mapFn;
        if (item["x-mapper"]) {
          mapFn = (
            // deno-lint-ignore no-explicit-any
            targetObject: any,
            sourceObject: Record<string, unknown> | Array<unknown>,
          ) =>
            this.resolveXMapperRef(targetObject, item, sourceObject, mappers);
        } else if (item.value) {
          // deno-lint-ignore no-explicit-any
          mapFn = (targetObject: any) =>
            this.assignValueToTarget(targetObject, item.target, item.value);
        } else if (item.source) {
          mapFn = (
            // deno-lint-ignore no-explicit-any
            targetObject: any,
            sourceObject: Record<string, unknown> | Array<unknown>,
          ) => {
            const value = this.resolveSourceTargetMap(item, sourceObject);
            return this.assignValueToTarget(targetObject, item.target, value);
          };
        }

        return { key, mapFn };
      }).reduce((previousValue, currentValue) => {
        return { ...previousValue, [currentValue.key]: currentValue.mapFn };
      }, {});

    sourceMappers[sourceSchemaRef] = (
      sourceObject: Record<string, unknown> | Array<unknown>,
    ) => {
      let targetObject: unknown = {};
      mapperJson.map.forEach((item: MapperItemSchema) => {
        targetObject = mappingFunctions[item.target]
          ? mappingFunctions[item.target](targetObject, sourceObject)
          : targetObject;
      });
      return targetObject;
    };
  }

  private resolveXMapperRef(
    targetObject: Record<string, unknown>,
    item: MapperItemSchema,
    // deno-lint-ignore no-explicit-any
    sourceObject: Record<string, any> | Array<unknown>,
    mappers: Mappers,
  ) {
    if (item.target === "#idx#" && item.source === "#key#") {
      return this.handleMapObjectIntoArray(item, sourceObject, mappers);
    }

    if (
      this.isArray(sourceObject) && item.target === "#item#" &&
      item.source === "#item#"
    ) {
      return this.handleMapArrayToArray(item, sourceObject, mappers);
    } else if (
      !this.isArray(sourceObject) && !!sourceObject &&
      !!sourceObject[item.source!]
    ) {
      const value = this.getMapperFunction(item["x-mapper"]!, mappers)(
        sourceObject[item.source!],
      );
      this.assignValueToTarget(targetObject, item.target, value);
    }

    return targetObject;
  }

  private handleMapObjectIntoArray(
    item: MapperItemSchema,
    // deno-lint-ignore no-explicit-any
    sourceObject: Record<string, any>,
    mappers: Mappers,
  ) {
    return Object.keys(sourceObject).map((key) => {
      sourceObject[key]["#key#"] = key;
      return this.getMapperFunction(item["x-mapper"]!, mappers)(
        sourceObject[key],
      );
    });
  }

  private handleMapArrayToArray(
    item: MapperItemSchema,
    // deno-lint-ignore no-explicit-any
    sourceObject: Array<any>,
    mappers: Mappers,
  ) {
    return sourceObject.map((sourceObjectItem) =>
      this.getMapperFunction(item["x-mapper"]!, mappers)(sourceObjectItem)
    );
  }

  private getMapperFunction(
    item: XMapperRefSchema,
    mappers: Mappers,
  ): (source: Record<string, unknown> | Array<unknown>) => unknown {
    // deno-lint-ignore no-explicit-any
    return (sourceObject: Record<string, any>) =>
      mappers[item.$$ref]?.[item.source_schema.$$ref]?.(sourceObject);
  }

  private isArray(
    array: Array<unknown> | Record<string, unknown>,
  ): array is Array<unknown> {
    return (array as Array<unknown>).filter !== undefined;
  }

  private resolveSourceTargetMap(
    item: MapperItemSchema,
    sourceObject: Record<string, unknown> | Array<unknown>,
  ) {
    if (item.source?.startsWith("#array[") && this.isArray(sourceObject)) {
      return this.handleMapArrayIntoObject(item, sourceObject);
    }

    const idxArrayFirstSqrBracket = item.source?.indexOf("[");
    if (idxArrayFirstSqrBracket !== -1 && !this.isArray(sourceObject)) {
      const arrayName = (item.source)!.substr(0, idxArrayFirstSqrBracket);
      const items =
        sourceObject[arrayName] as (Array<unknown> | Record<string, unknown>);
      if (items && this.isArray(items)) {
        return this.handleMapArrayIntoObject(item, items);
      }
    }
    return !this.isArray(sourceObject) ? sourceObject[item.source!] : undefined;
  }

  private handleMapArrayIntoObject(
    item: MapperItemSchema,
    sourceObject: Array<unknown>,
  ) {
    if (item.source?.startsWith("#array[") || item.source?.indexOf("[")) {
      const idx: number = parseInt(item.source?.match(/\d+/)?.[0] || "-1");
      if (idx < 0) {
        return;
      }

      return sourceObject[idx];
    }
    return undefined;
  }

  private assignValueToTarget(
    targetObject: Record<string, unknown>,
    targetKey: string,
    value: unknown,
  ) {
    if (value === undefined) {
      return targetObject;
    }
    //warn: still not supporting arrays, i.e: limits.amounts[2].min
    const targetKeys = targetKey.split(".");
    this.assignValueToTargetRecursive(targetObject, targetKeys, value);
    return targetObject;
  }

  private assignValueToTargetRecursive(
    // deno-lint-ignore no-explicit-any
    targetObject: Record<string, any>,
    targetKeys: string[],
    value: unknown,
  ) {
    const targetKey = targetKeys[0];
    if (targetKeys.length === 1) {
      targetObject[targetKey] = value;
      return;
    }

    if (!targetObject[targetKey]) {
      targetObject[targetKey] = {};
    }

    targetKeys.splice(0, 1);
    this.assignValueToTargetRecursive(
      targetObject[targetKey],
      targetKeys,
      value,
    );
  }

  public mapResponse<T>(
    operationId: string,
    httpStatus: number,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any> | Array<any>,
  ): T | undefined {
    return this.map(
      operationId,
      source,
      this.mapOperationToResponsePayloadDefinition(httpStatus),
    );
  }

  private mapOperationToResponsePayloadDefinition = (httpStatus: number) => {
    // deno-lint-ignore no-explicit-any
    return (operation: any) =>
      Object.keys(operation.responses || {})
        .filter((status) => status === (httpStatus + ""))
        .map((httpStatusKey) => operation.responses[httpStatusKey])
        .map((response) => response?.content?.["application/json"]);
  };

  public mapRequestBody<T>(
    operationId: string,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any> | Array<any> = {},
  ): T | undefined {
    //TODO
    return this.map(
      operationId,
      source,
      this.mapOperationToRequestPayloadDefinition(),
    );
  }

  private mapOperationToRequestPayloadDefinition = () => {
    // deno-lint-ignore no-explicit-any
    return (operation: any) =>
      Object.keys(operation?.requestBody?.content || {})
        .map((produceFormat) =>
          operation?.requestBody?.content?.[produceFormat]
        );
  };

  public mapRequestParameter(
    operationId: string,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any>,
    // deno-lint-ignore no-explicit-any
    filterByParameterType: (parameter: Record<string, any>) => boolean = () =>
      true,
  ): Record<string, any> {
    if (!this.specJson.paths) {
      throw new OpenApiSpecMissingPropertyError(this.specJson, "paths");
    }

    // deno-lint-ignore no-explicit-any
    const target: Record<string, any> = {};

    if (Object.keys(source).length === 0) {
      return target;
    }

    Object.keys(this.specJson.paths)
      .map((path) => this.specJson.paths[path])
      .flatMap((operations) =>
        Object.keys(operations).map((operationKey) => operations[operationKey])
      )
      .filter((operation) =>
        operation.operationId === operationId && operation.parameters
      )
      .flatMap((operation) => operation.parameters)
      .filter(filterByParameterType)
      .filter((parameter) => {
        const xName = parameter["x-name"]
          ? parameter["x-name"] as unknown as string
          : undefined;
        // deno-lint-ignore no-explicit-any
        const sourceTyped = source as Record<string, any>;
        return xName && sourceTyped[xName];
      })
      .forEach((parameter) => {
        // deno-lint-ignore no-explicit-any
        const sourceTyped = source as Record<string, any>;
        const xName = parameter["x-name"];
        target[parameter.name] = sourceTyped[xName];
      });

    return target;
  }

  public getParameterInHeaderFilter() {
    // deno-lint-ignore no-explicit-any
    return (parameter: Record<string, any>) => parameter.in === "header";
  }

  private map<T>(
    operationId: string,
    // deno-lint-ignore no-explicit-any
    source: Record<string, any> | Array<any>,
    // deno-lint-ignore no-explicit-any
    mapOperationToPayloadDefinitionFn: (operation: any) => any[],
  ): T | undefined {
    //based on the operationid, identify the operation
    //search for responses key -> success http code -> content -> application/json
    //search for x-mapper ; extract source_schema.$$ref to obtain source type ; extract $$ref to obtain target type
    if (!this.specJson.paths) {
      throw new OpenApiSpecMissingPropertyError(this.specJson, "paths");
    }

    const sourceTargetRefs = Object.keys(this.specJson.paths)
      .map((path) => this.specJson.paths[path])
      .flatMap((operations) =>
        Object.keys(operations).map((operationKey) => operations[operationKey])
      )
      .filter((operation) => operation.operationId === operationId)
      .flatMap(mapOperationToPayloadDefinitionFn)
      .filter((payloadDefinition) => !!payloadDefinition)
      .map((payloadDefinition) => ({
        sourceSchemaRef: payloadDefinition["schema"]?.["$$ref"],
        targetMapperSchemaRef: payloadDefinition["x-mapper"]?.["$$ref"],
      }))
      .filter((sourceTargetSchemaRef) =>
        !!sourceTargetSchemaRef.sourceSchemaRef &&
        !!sourceTargetSchemaRef.targetMapperSchemaRef
      )?.[0];

    if (!sourceTargetRefs) {
      throw new MapperNotFoundError(operationId);
    }

    //with target type search mappers structure, it will return an object with all the supported sources as keys
    //then use source type to fetch the value of that object { [key: string]: { [key:string]: (source: Record<string, never>) => unknown } }

    const mapper = this.mappers[sourceTargetRefs.targetMapperSchemaRef]
      ?.[sourceTargetRefs.sourceSchemaRef];

    if (!mapper) {
      throw new MapperNotFoundError(
        operationId,
        sourceTargetRefs.targetMapperSchemaRef,
        sourceTargetRefs.sourceSchemaRef,
        this.mappers,
      );
    }

    return mapper(source) as T;
  }
}

export default SwaggerSchemaMapper;
