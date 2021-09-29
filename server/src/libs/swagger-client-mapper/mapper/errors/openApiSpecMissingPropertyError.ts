
class OpenApiSpecMissingPropertyError extends Error {

    // deno-lint-ignore no-explicit-any
    constructor(spec: Record<string, any>, property: string){
        super(`Missing property "${property}" on Open Api Schema: ${spec} .`);
    }
}

export default OpenApiSpecMissingPropertyError;