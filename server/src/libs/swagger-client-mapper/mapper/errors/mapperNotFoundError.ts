import { Mappers } from '../swaggerSchemaMapper';

class MapperNotFoundError extends Error {
  constructor(
    operationId: string,
    targetMapperSchemaRef?: string,
    sourceSchemaRef?: string,
    mappers?: Mappers
  ) {
    let errorMsg = `Could not find mapper for operationId: ${operationId}.`;

    if (targetMapperSchemaRef && sourceSchemaRef) {
      errorMsg += ` No corresponding mapper for targetMapperRef: ${targetMapperSchemaRef} and sourceSchemaRef: ${sourceSchemaRef}. Available mappers: ${mappers} .`;
    }

    super(errorMsg);
  }
}

export default MapperNotFoundError;
