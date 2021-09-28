import { OrderSide, OrderType } from "./ce_exchanges/domain/entities/order.ts";
import { CentralizedExchangeService } from "./ce_exchanges/domain/services/centralizedExchangeService.ts";
import { serve } from "./deps.ts";
import { dotEnvConfig } from "./deps.ts";
import "https://deno.land/x/dotenv/load.ts";
import { execute } from "./libs/swagger-client-mapper/swaggerClient.ts";

console.log("Loading env file...");
console.log(
  dotEnvConfig({
    export: true,
    safe: true,
    path: `server/resources/env/.env`,
    example: `server/resources/env/.env.required_keys`,
  }),
);

const ceService = await new CentralizedExchangeService().init();
const order = await ceService.createOrder("kraken", {
  symbol: "ADAUSDT",
  side: OrderSide.buy,
  type: OrderType.limit,
  amount: 5.0000,
  price: 2.246,
});

console.log("order", JSON.stringify(order));

await execute();

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);
const body = new TextEncoder().encode("Hello World\n");

console.log("EVA Investments Server");
console.log(`Server started on port ${PORT}`);
for await (const req of s) {
  req.respond({ body });
}
