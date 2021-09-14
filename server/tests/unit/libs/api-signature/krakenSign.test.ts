import { assertEquals } from "../../../../src/deps.ts";
import KrakenSignature from "../../../../src/libs/api-signature/krakenSign.ts";

Deno.test("Should build Kraken REST API signature", () => {
  const krakenSign = new KrakenSignature();

  const privateKey =
    "kQH5HW/8p1uGOVjbgWA7FunAmGO8lsSUXNsu3eow76sz84Q18fWxnyRzBHCd3pd5nE9qa99HAZtuZuj6F1huXg==";
  const nonce = 1616492376594;
  const data = {
    "nonce": "1616492376594",
    "ordertype": "limit",
    "pair": "XBTUSD",
    "price": 37500,
    "type": "buy",
    "volume": 1.25,
  };
  const uriPath = "/0/private/AddOrder";

  const apiSign = krakenSign.buildRESTApiSignature(
    uriPath,
    nonce,
    privateKey,
    undefined,
    data,
  );
  assertEquals(
    apiSign,
    "4/dpxb3iT4tp/ZCVEwSnEsLxx0bqyhLpdfOpc6fn7OR8+UClSV5n9E6aSS8MPtnRfp32bAb0nmbRn6H8ndwLUQ==",
  );
});
