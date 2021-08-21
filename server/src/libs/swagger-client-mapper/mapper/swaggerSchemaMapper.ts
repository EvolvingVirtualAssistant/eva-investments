type Mapper = {
    [key: string] : (source: Record<string,any>) => any
};

type Mappers = {
    [key: string] : Mapper
};

type MapperItemSchema = {
    source?: string,
    value?: string,
    target: string,
    "x-mapper"?: XMapperRefSchema 
};

type MapperSchema = {
    "source_schema": { "$ref": string },
    map: MapperItemSchema[]
};

type XMapperRefSchema = {
    "source_schema": { "$$ref": string },
    map: MapperItemSchema[],
    "$$ref": string
}

interface SwaggerSchemaMapperType {
    map<T>(operationId: string, httpStatus: string, source: Record<string, any>): T | undefined
}

class SwaggerSchemaMapper implements SwaggerSchemaMapperType {

    // deno-lint-ignore no-explicit-any
    private specJson: Record<string, any>;
    // mappers structure
    private mappers: Mappers;

    constructor(specJson: Record<string, any>){
        this.specJson = specJson;
        this.mappers = this.buildMappers();
    }

    private buildMappers() {
        const mappersResult = {};
        const xMappers = this.specJson?.components?.["x-mappers"];
        if(!xMappers) {
            return mappersResult;
        }

        const pathPrefixForTopMappers = "#/components/x-mappers/";
        Object.keys(xMappers).forEach(mapperKey => {

            this.buildMapper(pathPrefixForTopMappers+mapperKey, xMappers[mapperKey], mappersResult);
        })
        return mappersResult;
    }

    private buildMapper(mapperId: string, mapperJson: MapperSchema, mappers: Mappers) {
        let sourceMappers: Mapper = mappers[mapperId];
        if(!sourceMappers) {
            sourceMappers = {};
            mappers[mapperId] = sourceMappers;
        }

        const sourceSchemaRef = mapperJson.source_schema["$ref"];
        if(sourceMappers[sourceSchemaRef]) {
            //it already exists, then skip
            return;
        }

        type mapFunctionType = (targetObject: any, sourceObject?: Record<string,any> | Array<any>) => any;

        const mappingFunctions: Record<string,mapFunctionType> = mapperJson.map.map((item: MapperItemSchema) => {
            
            const key = item.target;
            let mapFn;
            if(item["x-mapper"]) {
                mapFn = (targetObject: any, sourceObject: Record<string,any> | Array<any>) => this.resolveXMapperRef(targetObject, item, sourceObject, mappers);
            } else if(item.value) {
                mapFn = (targetObject: any) => this.assignValueToTarget(targetObject, item.target, item.value);
            } else if(item.source) {
                mapFn = (targetObject: any, sourceObject: Record<string,any> | Array<any>) => {
                    const value = this.resolveSourceTargetMap(item, sourceObject);
                    return this.assignValueToTarget(targetObject, item.target, value);
                }
            }

            return { key, mapFn };
        }).reduce((previousValue, currentValue) => {
            return { ...previousValue, [currentValue.key]: currentValue.mapFn };
        }, {});

        sourceMappers[sourceSchemaRef] = (sourceObject: Record<string,any> | Array<any>) => {
            // deno-lint-ignore no-explicit-any
            let targetObject: any = {};
            mapperJson.map.forEach((item: MapperItemSchema) => {

                targetObject = mappingFunctions[item.target] ? mappingFunctions[item.target](targetObject, sourceObject) : targetObject;
                
                /*if(item["x-mapper"]) {
                    targetObject = this.resolveXMapperRef(targetObject, item, sourceObject, mappers);
                    //targetObject[item.target] = this.resolverXMapperRef(item["x-mapper"], mappers)(sourceObject[item.source!]);
                } else if(item.value) {
                    this.assignValueToTarget(targetObject, item.target, item.value);
                } else if(item.source) {
                    const value = this.resolveSourceTargetMap(item, sourceObject);
                    this.assignValueToTarget(targetObject, item.target, value);
                }*/

            });
            return targetObject
        };
    }

    private resolveXMapperRef(targetObject: Record<string,any>, item: MapperItemSchema, sourceObject: Record<string,any> | Array<any>, mappers: Mappers){
        if(item.target === "#idx#" && item.source === "#key#") {
            return this.handleMapObjectIntoArray(item, sourceObject, mappers);
        }

        /*
        if(this.isArray(sourceObject)) {
            const targetObjectArray = sourceObject.map(sourceObjectItem => {
                const targetObjectItem = {};
                const value = this.getMapperFunction(item["x-mapper"]!, mappers)(sourceObjectItem[item.source!]);
                this.assignValueToTarget(targetObjectItem, item.target, value);
            })
            return targetObjectArray;
        }*/ 

        if(this.isArray(sourceObject) && item.target === "#item#" && item.source === "#item#"){
            return this.handleMapArrayToArray(item, sourceObject, mappers);
        } else if(!this.isArray(sourceObject) && !!sourceObject && !!sourceObject[item.source!]){
            const value = this.getMapperFunction(item["x-mapper"]!, mappers)(sourceObject[item.source!]);
            this.assignValueToTarget(targetObject, item.target, value);
        }
        
        return targetObject;
    }

    private handleMapObjectIntoArray(item: MapperItemSchema, sourceObject: Record<string,any>, mappers: Mappers) {
        return Object.keys(sourceObject).map(key => {
            sourceObject[key]["#key#"] = key;
            return this.getMapperFunction(item["x-mapper"]!, mappers)(sourceObject[key])
        });
    }

    private handleMapArrayToArray(item: MapperItemSchema, sourceObject: Array<any>, mappers: Mappers) {
        return sourceObject.map(sourceObjectItem => this.getMapperFunction(item["x-mapper"]!, mappers)(sourceObjectItem));
    }

    private getMapperFunction(item: XMapperRefSchema, mappers: Mappers):  (source: Record<string,any> | Array<any>) => any {
        return (sourceObject: Record<string,any>) => mappers[item.$$ref]?.[item.source_schema.$$ref]?.(sourceObject);
    }

    private isArray(array: Array<any> | Record<string,any>): array is Array<any> {
        return (array as Array<any>).filter !== undefined;
    }

    private resolveSourceTargetMap(item: MapperItemSchema, sourceObject: Record<string,any> | Array<any>) {
        if(item.source?.startsWith("#array[") && this.isArray(sourceObject)) {
            return this.handleMapArrayIntoObject(item, sourceObject);
        }

        return !this.isArray(sourceObject) ? sourceObject[item.source!] : undefined;
    }

    private handleMapArrayIntoObject(item: MapperItemSchema, sourceObject: Array<any>) {
        if(item.source?.startsWith("#array[")) {
            const idx: number = parseInt(item.source?.match(/\d+/)?.[0] || "-1");
            if(idx < 0) {
                return;
            }

            return sourceObject[idx];
        }
        return undefined;
    }

    private assignValueToTarget(targetObject: any, targetKey: string, value: any){
        //warn: still not supporting arrays, i.e: limits.amounts[2].min 
        const targetKeys = targetKey.split(".");
        this.assignValueToTargetRecursive(targetObject, targetKeys, value);
        return targetObject;
    }

    private assignValueToTargetRecursive(targetObject: any, targetKeys: string[], value: any){
        const targetKey = targetKeys[0];
        if(targetKeys.length === 1){
            targetObject[targetKey] = value;
            return;
        }

        if(!targetObject[targetKey]) {
            targetObject[targetKey] = {};
        }

        targetKeys.splice(0,1);
        this.assignValueToTargetRecursive(targetObject[targetKey], targetKeys, value);
    }

    
    public map<T>(operationId: string, httpStatus: string, source: Record<string, any>): T | undefined {

        //based on the operationid, identify the operation
        //search for responses key -> success http code -> content -> application/json
        //search for x-mapper ; extract source_schema.$$ref to obtain source type ; extract $$ref to obtain target type
        if(!this.specJson.paths) {
            //should throw an error maybe
            return undefined;
        }
        
        const sourceTargetRefs = Object.keys(this.specJson.paths)
            .map(path => this.specJson.paths[path])
            .flatMap(operations => Object.keys(operations).map(operationKey => operations[operationKey]))
            .filter(operation => operation.operationId === operationId && operation.responses)
            .flatMap(operation => Object.keys(operation.responses)
                                        .filter(status => status === (httpStatus+""))
                                        .map(httpStatusKey => operation.responses[httpStatusKey]))
            .map(response => response?.content?.["application/json"])
            .filter(payloadDefinition => !!payloadDefinition)
            .map(payloadDefinition => ({ sourceSchemaRef: payloadDefinition["schema"]?.["$$ref"], targetMapperSchemaRef: payloadDefinition["x-mapper"]?.["$$ref"]}))
            .filter(sourceTargetSchemaRef => !!sourceTargetSchemaRef.sourceSchemaRef && !!sourceTargetSchemaRef.targetMapperSchemaRef)?.[0];
        
        if(!sourceTargetRefs) {
            return undefined;
        }

        //with target type search mappers structure, it will return an object with all the supported sources as keys
        //then use source type to fetch the value of that object { [key: string]: { [key:string]: (source: Record<string, never>) => any } }

        const mapper = this.mappers[sourceTargetRefs.targetMapperSchemaRef]?.[sourceTargetRefs.sourceSchemaRef];

        if(!mapper){
            return undefined;
        }

        return mapper(source) as T;
    }
}

export default SwaggerSchemaMapper;