// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
import processModule from 'https://deno.land/std@0.113.0/node/process.ts';
import { Buffer as bufferModule } from 'https://deno.land/std@0.113.0/node/buffer.ts';
import timers from 'https://deno.land/std@0.113.0/node/timers.ts';

type GlobalType = {
  process: typeof processModule;
  Buffer: typeof bufferModule;
  setImmediate: typeof timers.setImmediate;
  clearImmediate: typeof timers.clearImmediate;
};

declare global {
  interface Window {
    global: GlobalType;
  }

  interface globalThis {
    global: GlobalType;
  }

  var global: GlobalType;
  var process: typeof processModule;
  // var Buffer: typeof bufferModule;
  // type Buffer = bufferModule;
  var setImmediate: typeof timers.setImmediate;
  var clearImmediate: typeof timers.clearImmediate;
}

Object.defineProperty(globalThis, 'global', {
  value: globalThis,
  writable: false,
  enumerable: false,
  configurable: true,
});

Object.defineProperty(globalThis, 'process', {
  value: processModule,
  enumerable: false,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'Buffer', {
  value: bufferModule,
  enumerable: false,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'setImmediate', {
  value: timers.setImmediate,
  enumerable: true,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'clearImmediate', {
  value: timers.clearImmediate,
  enumerable: true,
  writable: true,
  configurable: true,
});

export {};
