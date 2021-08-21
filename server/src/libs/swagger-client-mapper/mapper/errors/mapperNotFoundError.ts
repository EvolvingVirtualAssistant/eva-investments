import { Mappers } from "../swaggerSchemaMapper.ts";

class MapperNotFoundError extends Error {

    constructor(operationId: string, httpStatus: number, targetMapperSchemaRef?: string, sourceSchemaRef?: string, mappers?: Mappers){
        let errorMsg = `Could not find mapper for operationId: ${operationId} and http status: ${httpStatus} .`;

        if(targetMapperSchemaRef && sourceSchemaRef) {
            errorMsg += ` No corresponding mapper for targetMapperRef: ${targetMapperSchemaRef} and sourceSchemaRef: ${sourceSchemaRef}. Available mappers: ${mappers} .`
        }

        super(errorMsg);
    }
}

export default MapperNotFoundError;