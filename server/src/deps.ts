export { serve } from "https://deno.land/std@0.77.0/http/server.ts";

// config
/*import Module from "https://deno.land/std@0.105.0/node/module.ts";
// deno-lint-ignore no-explicit-any
type Require = (id: string) => any;
// deno-lint-ignore no-explicit-any
type RequireResolve = (request: string, options: any) => string;
interface RequireResolveFunction extends RequireResolve {
  paths: (request: string) => string[] | null;
}
export interface RequireFunction extends Require {
  resolve: RequireResolveFunction;
  // deno-lint-ignore no-explicit-any
  extensions: { [key: string]: (module: Module, filename: string) => any };
  cache: { [key: string]: Module };
}
export const createRequire = Module.createRequire;

// defining require as a global variable
const require = createRequire(import.meta.url);

declare global {
  var require: RequireFunction
  interface Window { require: RequireFunction; }
  interface  globalThis {
    require: RequireFunction;
  }

}
globalThis.require = require;
window.require = require;*/


export type { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";
import { config as dotEnvConfig } from "https://deno.land/x/dotenv/mod.ts";
export { dotEnvConfig };

// libs
import SwaggerClient from "../src/libs/swagger-client.js";//"https://cdn.skypack.dev/swagger-client";
//import { SwaggerClient } from "https://unpkg.com/swagger-client@3.15.0/dist/swagger-client.browser.js";
/*import SwaggerClient from "https://cdn.esm.sh/v45/swagger-client@3.15.0/es2021/swagger-client.js";*/
//import "https://ga.jspm.io/npm:es-module-shims@0.12.4/dist/es-module-shims.min.js";
//import Swagger from "swagger-client";
/*class SwaggerClient {
    constructor(obj: Object) {

    }
}*/
export { SwaggerClient };
