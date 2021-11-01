import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { isAsync } from "../../../../../src/libs/cli/utils/async.ts";

Deno.test("Should be an async function", () => {
    const asyncFunction = async () => {
        return await "This is an async function";
    };

    assertEquals(isAsync(asyncFunction), true);
});

Deno.test("Generator function should not be an async function", () => {
    const generatorFunction = function* fun() {
        yield "This is a generator function";
    };

    assertEquals(isAsync(generatorFunction), false);
});

Deno.test("Should not be an async function", () => {
    const syncFunction = () => {
        return "This is a sync function";
    };

    assertEquals(isAsync(syncFunction), false);
});

Deno.test("An object should not be an async function", () => {
    assertEquals(isAsync({ name: "I'm not really a function" }), false);
});