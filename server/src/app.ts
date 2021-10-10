import { pathJoin, ROOT_PATH, serve } from "./deps.ts";
import { dotEnvConfig } from "./deps.ts";
import "https://deno.land/x/dotenv/load.ts";
import { execute } from "./libs/swagger-client-mapper/swaggerClient.ts";

console.log("Loading env file...");
console.log(
  dotEnvConfig({
    export: true,
    safe: true,
    path: pathJoin(ROOT_PATH, "/resources/env/.env"),
    example: pathJoin(ROOT_PATH, "/resources/env/.env.required_keys"),
  }),
);

await execute();

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);
const body = new TextEncoder().encode("Hello World\n");

console.log("EVA Investments Server");
console.log(`Server started on port ${PORT}`);
for await (const req of s) {
  req.respond({ body });
}
