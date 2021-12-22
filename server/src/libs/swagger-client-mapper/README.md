# swagger-client-mapper

## Description
Swagger client custom mapper

## Instructions
In order to use this lib without errors with missing declaration files for the swagger-client lib (which at this point only supports JavaScript), you must:
1. Run
```
   npm run swagger-client-generate-types 
```
1. Go to node_modules/swagger-client/package.json and at the end of the file add the following:
```json
{
    ...
    "types": "lib/commonjs.d.ts",
    ...
}
```