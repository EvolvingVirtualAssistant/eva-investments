// deno-lint-ignore-file
import url2 from 'https://cdn.skypack.dev/-/url@v0.11.0-UOyhvzpSRF855VFpSAKm/dist=es2020,mode=imports/optimized/url.js';
import 'https://cdn.skypack.dev/-/cross-fetch@v3.1.4-QRrT2D9K40kk7VVb31Pb/dist=es2020,mode=imports/unoptimized/dist/node-polyfill.js';
import qs2 from 'https://cdn.skypack.dev/-/qs@v6.10.1-OJTYw74K0TVnjoTCQ0K6/dist=es2020,mode=imports/optimized/qs.js';
import jsYaml from 'https://cdn.skypack.dev/-/js-yaml@v4.1.0-cGRdBIJyPJe0TZHdCL6I/dist=es2020,mode=imports/optimized/js-yaml.js';
import __commonjs_module0 from 'https://cdn.skypack.dev/-/buffer@v6.0.3-9TXtXoOPyENPVOx2wqZk/dist=es2020,mode=imports/optimized/buffer.js';
const { Buffer: Buffer$1 } = __commonjs_module0;
import { FormData } from 'https://cdn.skypack.dev/new/formdata-node@v3.7.0/dist=es2020,mode=imports?from=formdata-node';
import {
  applyPatch as applyPatch$1,
  getValueByPointer,
} from 'https://cdn.skypack.dev/new/fast-json-patch@v3.1.0/dist=es2020,mode=imports?from=fast-json-patch';
import deepExtend from 'https://cdn.skypack.dev/-/deep-extend@v0.6.0-bK3HiHqGzz0nZyfI0icb/dist=es2020,mode=imports/optimized/deep-extend.js';
import qs$1 from 'https://cdn.skypack.dev/-/querystring-browser@v1.0.4-NFecIqvuijUSIWzCxQHl/dist=es2020,mode=imports/optimized/querystring-browser.js';
import traverse2 from 'https://cdn.skypack.dev/-/traverse@v0.6.6-5aHdVE8ENWQL3tmsYVgb/dist=es2020,mode=imports/optimized/traverse.js';
import cookie$1 from 'https://cdn.skypack.dev/-/cookie@v0.4.1-guhSEbcHMyyU68A3z2sB/dist=es2020,mode=imports/optimized/cookie.js';
import btoa2 from 'https://cdn.skypack.dev/-/btoa@v1.2.1-930RUPSBFKhPTZba1rDG/dist=es2020,mode=imports/optimized/btoa.js';
import Module from 'https://deno.land/std@0.105.0/node/module.ts';
const createRequire = Module.createRequire;
// defining require as a global variable
const require = createRequire(import.meta.url);
var commonjsGlobal =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
    ? self
    : {};
function createCommonjsModule(fn, basedir, module) {
  return (
    (module = {
      path: basedir,
      exports: {},
      require: function (path2, base) {
        return commonjsRequire(
          path2,
          base === void 0 || base === null ? module.path : base
        );
      },
    }),
    fn(module, module.exports),
    module.exports
  );
}
function commonjsRequire() {
  throw new Error(
    'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
  );
}
var check = function (it) {
  return it && it.Math == Math && it;
};
var global_1 =
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  (function () {
    return this;
  })() ||
  Function('return this')();
var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};
var descriptors = !fails(function () {
  return (
    Object.defineProperty({}, 1, {
      get: function () {
        return 7;
      },
    })[1] != 7
  );
});
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var NASHORN_BUG =
  getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
var f = NASHORN_BUG
  ? function propertyIsEnumerable(V) {
      var descriptor = getOwnPropertyDescriptor(this, V);
      return !!descriptor && descriptor.enumerable;
    }
  : nativePropertyIsEnumerable;
var objectPropertyIsEnumerable = {
  f,
};
var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value,
  };
};
var toString = {}.toString;
var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};
var split = ''.split;
var indexedObject = fails(function () {
  return !Object('z').propertyIsEnumerable(0);
})
  ? function (it) {
      return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
    }
  : Object;
var requireObjectCoercible = function (it) {
  if (it == void 0) throw TypeError("Can't call method on " + it);
  return it;
};
var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};
var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (
    PREFERRED_STRING &&
    typeof (fn = input.toString) == 'function' &&
    !isObject((val = fn.call(input)))
  )
    return val;
  if (
    typeof (fn = input.valueOf) == 'function' &&
    !isObject((val = fn.call(input)))
  )
    return val;
  if (
    !PREFERRED_STRING &&
    typeof (fn = input.toString) == 'function' &&
    !isObject((val = fn.call(input)))
  )
    return val;
  throw TypeError("Can't convert object to primitive value");
};
var hasOwnProperty = {}.hasOwnProperty;
var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};
var document$1 = global_1.document;
var EXISTS = isObject(document$1) && isObject(document$1.createElement);
var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};
var ie8DomDefine =
  !descriptors &&
  !fails(function () {
    return (
      Object.defineProperty(documentCreateElement('div'), 'a', {
        get: function () {
          return 7;
        },
      }).a != 7
    );
  });
var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var f$1 = descriptors
  ? nativeGetOwnPropertyDescriptor
  : function getOwnPropertyDescriptor2(O, P) {
      O = toIndexedObject(O);
      P = toPrimitive(P, true);
      if (ie8DomDefine)
        try {
          return nativeGetOwnPropertyDescriptor(O, P);
        } catch (error) {}
      if (has(O, P))
        return createPropertyDescriptor(
          !objectPropertyIsEnumerable.f.call(O, P),
          O[P]
        );
    };
var objectGetOwnPropertyDescriptor = {
  f: f$1,
};
var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL
    ? true
    : value == NATIVE
    ? false
    : typeof detection == 'function'
    ? fails(detection)
    : !!detection;
};
var normalize = (isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
});
var data = (isForced.data = {});
var NATIVE = (isForced.NATIVE = 'N');
var POLYFILL = (isForced.POLYFILL = 'P');
var isForced_1 = isForced;
var path = {};
var aFunction = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  }
  return it;
};
var functionBindContext = function (fn, that, length) {
  aFunction(fn);
  if (that === void 0) return fn;
  switch (length) {
    case 0:
      return function () {
        return fn.call(that);
      };
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () {
    return fn.apply(that, arguments);
  };
};
var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  }
  return it;
};
var nativeDefineProperty = Object.defineProperty;
var f$2 = descriptors
  ? nativeDefineProperty
  : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if (ie8DomDefine)
        try {
          return nativeDefineProperty(O, P, Attributes);
        } catch (error) {}
      if ('get' in Attributes || 'set' in Attributes)
        throw TypeError('Accessors not supported');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };
var objectDefineProperty = {
  f: f$2,
};
var createNonEnumerableProperty = descriptors
  ? function (object, key, value) {
      return objectDefineProperty.f(
        object,
        key,
        createPropertyDescriptor(1, value)
      );
    }
  : function (object, key, value) {
      object[key] = value;
      return object;
    };
var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof NativeConstructor) {
      switch (arguments.length) {
        case 0:
          return new NativeConstructor();
        case 1:
          return new NativeConstructor(a);
        case 2:
          return new NativeConstructor(a, b);
      }
      return new NativeConstructor(a, b, c);
    }
    return NativeConstructor.apply(this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;
  var nativeSource = GLOBAL
    ? global_1
    : STATIC
    ? global_1[TARGET]
    : (global_1[TARGET] || {}).prototype;
  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
  var targetPrototype = target.prototype;
  var FORCED2, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key,
    sourceProperty,
    targetProperty,
    nativeProperty,
    resultProperty,
    descriptor;
  for (key in source) {
    FORCED2 = isForced_1(
      GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key,
      options.forced
    );
    USE_NATIVE = !FORCED2 && nativeSource && has(nativeSource, key);
    targetProperty = target[key];
    if (USE_NATIVE)
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
        nativeProperty = descriptor && descriptor.value;
      } else nativeProperty = nativeSource[key];
    sourceProperty =
      USE_NATIVE && nativeProperty ? nativeProperty : source[key];
    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;
    if (options.bind && USE_NATIVE)
      resultProperty = functionBindContext(sourceProperty, global_1);
    else if (options.wrap && USE_NATIVE)
      resultProperty = wrapConstructor(sourceProperty);
    else if (PROTO && typeof sourceProperty == 'function')
      resultProperty = functionBindContext(Function.call, sourceProperty);
    else resultProperty = sourceProperty;
    if (
      options.sham ||
      (sourceProperty && sourceProperty.sham) ||
      (targetProperty && targetProperty.sham)
    ) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }
    target[key] = resultProperty;
    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!has(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
      if (options.real && targetPrototype && !targetPrototype[key]) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};
_export(
  { target: 'Object', stat: true, forced: !descriptors, sham: !descriptors },
  {
    defineProperty: objectDefineProperty.f,
  }
);
var defineProperty_1 = createCommonjsModule(function (module) {
  var Object2 = path.Object;
  var defineProperty4 = (module.exports = function defineProperty5(
    it,
    key,
    desc
  ) {
    return Object2.defineProperty(it, key, desc);
  });
  if (Object2.defineProperty.sham) defineProperty4.sham = true;
});
var defineProperty2 = defineProperty_1;
var defineProperty$1 = defineProperty2;
var ceil = Math.ceil;
var floor = Math.floor;
var toInteger = function (argument) {
  return isNaN((argument = +argument))
    ? 0
    : (argument > 0 ? floor : ceil)(argument);
};
var min = Math.min;
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
};
var max = Math.max;
var min$1 = Math.min;
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    if (IS_INCLUDES && el != el)
      while (length > index) {
        value = O[index++];
        if (value != value) return true;
      }
    else
      for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el)
          return IS_INCLUDES || index || 0;
      }
    return !IS_INCLUDES && -1;
  };
};
var arrayIncludes = {
  includes: createMethod(true),
  indexOf: createMethod(false),
};
var hiddenKeys = {};
var indexOf = arrayIncludes.indexOf;
var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  while (names.length > i)
    if (has(O, (key = names[i++]))) {
      ~indexOf(result, key) || result.push(key);
    }
  return result;
};
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf',
];
var objectKeys =
  Object.keys ||
  function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };
var objectDefineProperties = descriptors
  ? Object.defineProperties
  : function defineProperties(O, Properties) {
      anObject(O);
      var keys4 = objectKeys(Properties);
      var length = keys4.length;
      var index = 0;
      var key;
      while (length > index)
        objectDefineProperty.f(O, (key = keys4[index++]), Properties[key]);
      return O;
    };
_export(
  { target: 'Object', stat: true, forced: !descriptors, sham: !descriptors },
  {
    defineProperties: objectDefineProperties,
  }
);
var defineProperties_1 = createCommonjsModule(function (module) {
  var Object2 = path.Object;
  var defineProperties4 = (module.exports = function defineProperties5(T, D) {
    return Object2.defineProperties(T, D);
  });
  if (Object2.defineProperties.sham) defineProperties4.sham = true;
});
var defineProperties2 = defineProperties_1;
var defineProperties$1 = defineProperties2;
var aFunction$1 = function (variable) {
  return typeof variable == 'function' ? variable : void 0;
};
var getBuiltIn = function (namespace, method) {
  return arguments.length < 2
    ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
    : (path[namespace] && path[namespace][method]) ||
        (global_1[namespace] && global_1[namespace][method]);
};
var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');
var f$3 =
  Object.getOwnPropertyNames ||
  function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };
var objectGetOwnPropertyNames = {
  f: f$3,
};
var f$4 = Object.getOwnPropertySymbols;
var objectGetOwnPropertySymbols = {
  f: f$4,
};
var ownKeys =
  getBuiltIn('Reflect', 'ownKeys') ||
  function ownKeys2(it) {
    var keys4 = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols4 = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols4
      ? keys4.concat(getOwnPropertySymbols4(it))
      : keys4;
  };
var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object)
    objectDefineProperty.f(
      object,
      propertyKey,
      createPropertyDescriptor(0, value)
    );
  else object[propertyKey] = value;
};
_export(
  { target: 'Object', stat: true, sham: !descriptors },
  {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIndexedObject(object);
      var getOwnPropertyDescriptor5 = objectGetOwnPropertyDescriptor.f;
      var keys4 = ownKeys(O);
      var result = {};
      var index = 0;
      var key, descriptor;
      while (keys4.length > index) {
        descriptor = getOwnPropertyDescriptor5(O, (key = keys4[index++]));
        if (descriptor !== void 0) createProperty(result, key, descriptor);
      }
      return result;
    },
  }
);
var getOwnPropertyDescriptors2 = path.Object.getOwnPropertyDescriptors;
var getOwnPropertyDescriptors$1 = getOwnPropertyDescriptors2;
var getOwnPropertyDescriptors$2 = getOwnPropertyDescriptors$1;
var iterators = {};
var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  }
  return value;
};
var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});
var sharedStore = store;
var functionToString = Function.toString;
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}
var inspectSource = sharedStore.inspectSource;
var WeakMap = global_1.WeakMap;
var nativeWeakMap =
  typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));
var isPure = true;
var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return (
      sharedStore[key] || (sharedStore[key] = value !== void 0 ? value : {})
    );
  })('versions', []).push({
    version: '3.8.2',
    mode: 'pure',
    copyright: '\xA9 2021 Denis Pushkarev (zloirock.ru)',
  });
});
var id = 0;
var postfix = Math.random();
var uid = function (key) {
  return (
    'Symbol(' +
    String(key === void 0 ? '' : key) +
    ')_' +
    (++id + postfix).toString(36)
  );
};
var keys2 = shared('keys');
var sharedKey = function (key) {
  return keys2[key] || (keys2[key] = uid(key));
};
var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;
var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};
var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }
    return state;
  };
};
if (nativeWeakMap) {
  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}
var internalState = {
  set,
  get,
  has: has$1,
  enforce,
  getterFor,
};
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};
var correctPrototypeGetter = !fails(function () {
  function F() {}
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});
var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;
var objectGetPrototypeOf = correctPrototypeGetter
  ? Object.getPrototypeOf
  : function (O) {
      O = toObject(O);
      if (has(O, IE_PROTO)) return O[IE_PROTO];
      if (typeof O.constructor == 'function' && O instanceof O.constructor) {
        return O.constructor.prototype;
      }
      return O instanceof Object ? ObjectPrototype : null;
    };
var nativeSymbol =
  !!Object.getOwnPropertySymbols &&
  !fails(function () {
    return !String(Symbol());
  });
var useSymbolAsUid =
  nativeSymbol && !Symbol.sham && typeof Symbol.iterator == 'symbol';
var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid
  ? Symbol$1
  : (Symbol$1 && Symbol$1.withoutSetter) || uid;
var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name))
      WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  }
  return WellKnownSymbolsStore[name];
};
var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
if ([].keys) {
  arrayIterator = [].keys();
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(
      objectGetPrototypeOf(arrayIterator)
    );
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
      IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}
if (IteratorPrototype == void 0) IteratorPrototype = {};
var iteratorsCore = {
  IteratorPrototype,
  BUGGY_SAFARI_ITERATORS,
};
var html = getBuiltIn('document', 'documentElement');
var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');
var EmptyConstructor = function () {};
var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};
var NullProtoObjectViaActiveX = function (activeXDocument2) {
  activeXDocument2.write(scriptTag(''));
  activeXDocument2.close();
  var temp = activeXDocument2.parentWindow.Object;
  activeXDocument2 = null;
  return temp;
};
var NullProtoObjectViaIFrame = function () {
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) {}
  NullProtoObject = activeXDocument
    ? NullProtoObjectViaActiveX(activeXDocument)
    : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};
hiddenKeys[IE_PROTO$1] = true;
var objectCreate =
  Object.create ||
  function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === void 0
      ? result
      : objectDefineProperties(result, Properties);
  };
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
var toStringTagSupport = String(test) === '[object z]';
var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var CORRECT_ARGUMENTS =
  classofRaw(
    (function () {
      return arguments;
    })()
  ) == 'Arguments';
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) {}
};
var classof = toStringTagSupport
  ? classofRaw
  : function (it) {
      var O, tag, result;
      return it === void 0
        ? 'Undefined'
        : it === null
        ? 'Null'
        : typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG$1)) == 'string'
        ? tag
        : CORRECT_ARGUMENTS
        ? classofRaw(O)
        : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function'
        ? 'Arguments'
        : result;
    };
var objectToString = toStringTagSupport
  ? {}.toString
  : function toString2() {
      return '[object ' + classof(this) + ']';
    };
var defineProperty$2 = objectDefineProperty.f;
var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!has(target, TO_STRING_TAG$2)) {
      defineProperty$2(target, TO_STRING_TAG$2, {
        configurable: true,
        value: TAG,
      });
    }
    if (SET_METHOD && !toStringTagSupport) {
      createNonEnumerableProperty(target, 'toString', objectToString);
    }
  }
};
var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var returnThis = function () {
  return this;
};
var createIteratorConstructor = function (IteratorConstructor, NAME, next2) {
  var TO_STRING_TAG2 = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
    next: createPropertyDescriptor(1, next2),
  });
  setToStringTag(IteratorConstructor, TO_STRING_TAG2, false, true);
  iterators[TO_STRING_TAG2] = returnThis;
  return IteratorConstructor;
};
var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  }
  return it;
};
var objectSetPrototypeOf =
  Object.setPrototypeOf ||
  ('__proto__' in {}
    ? (function () {
        var CORRECT_SETTER = false;
        var test2 = {};
        var setter;
        try {
          setter = Object.getOwnPropertyDescriptor(
            Object.prototype,
            '__proto__'
          ).set;
          setter.call(test2, []);
          CORRECT_SETTER = test2 instanceof Array;
        } catch (error) {}
        return function setPrototypeOf(O, proto) {
          anObject(O);
          aPossiblePrototype(proto);
          if (CORRECT_SETTER) setter.call(O, proto);
          else O.__proto__ = proto;
          return O;
        };
      })()
    : void 0);
var redefine = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};
var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis$1 = function () {
  return this;
};
var defineIterator = function (
  Iterable,
  NAME,
  IteratorConstructor,
  next2,
  DEFAULT,
  IS_SET,
  FORCED2
) {
  createIteratorConstructor(IteratorConstructor, NAME, next2);
  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype)
      return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS:
        return function keys4() {
          return new IteratorConstructor(this, KIND);
        };
      case VALUES:
        return function values() {
          return new IteratorConstructor(this, KIND);
        };
      case ENTRIES:
        return function entries3() {
          return new IteratorConstructor(this, KIND);
        };
    }
    return function () {
      return new IteratorConstructor(this);
    };
  };
  var TO_STRING_TAG2 = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator =
    IterablePrototype[ITERATOR$1] ||
    IterablePrototype['@@iterator'] ||
    (DEFAULT && IterablePrototype[DEFAULT]);
  var defaultIterator =
    (!BUGGY_SAFARI_ITERATORS$1 && nativeIterator) ||
    getIterationMethod(DEFAULT);
  var anyNativeIterator =
    NAME == 'Array'
      ? IterablePrototype.entries || nativeIterator
      : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(
      anyNativeIterator.call(new Iterable())
    );
    if (
      IteratorPrototype$2 !== Object.prototype &&
      CurrentIteratorPrototype.next
    ) {
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG2, true, true);
      iterators[TO_STRING_TAG2] = returnThis$1;
    }
  }
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() {
      return nativeIterator.call(this);
    };
  }
  if (FORCED2 && IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES),
    };
    if (FORCED2)
      for (KEY in methods) {
        if (
          BUGGY_SAFARI_ITERATORS$1 ||
          INCORRECT_VALUES_NAME ||
          !(KEY in IterablePrototype)
        ) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      }
    else
      _export(
        {
          target: NAME,
          proto: true,
          forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME,
        },
        methods
      );
  }
  return methods;
};
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);
var es_array_iterator = defineIterator(
  Array,
  'Array',
  function (iterated, kind) {
    setInternalState(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated),
      index: 0,
      kind,
    });
  },
  function () {
    var state = getInternalState(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = void 0;
      return { value: void 0, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  },
  'values'
);
iterators.Arguments = iterators.Array;
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0,
};
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
    createNonEnumerableProperty(
      CollectionPrototype,
      TO_STRING_TAG$3,
      COLLECTION_NAME
    );
  }
  iterators[COLLECTION_NAME] = iterators.Array;
}
var isArray =
  Array.isArray ||
  function isArray2(arg) {
    return classofRaw(arg) == 'Array';
  };
var SPECIES = wellKnownSymbol('species');
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    if (typeof C == 'function' && (C === Array || isArray(C.prototype)))
      C = void 0;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = void 0;
    }
  }
  return new (C === void 0 ? Array : C)(length === 0 ? 0 : length);
};
var push = [].push;
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self2 = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self2.length);
    var index = 0;
    var create3 = specificCreate || arraySpeciesCreate;
    var target = IS_MAP
      ? create3($this, length)
      : IS_FILTER || IS_FILTER_OUT
      ? create3($this, 0)
      : void 0;
    var value, result;
    for (; length > index; index++)
      if (NO_HOLES || index in self2) {
        value = self2[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result;
          else if (result)
            switch (TYPE) {
              case 3:
                return true;
              case 5:
                return value;
              case 6:
                return index;
              case 2:
                push.call(target, value);
            }
          else
            switch (TYPE) {
              case 4:
                return false;
              case 7:
                push.call(target, value);
            }
        }
      }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};
var arrayIteration = {
  forEach: createMethod$1(0),
  map: createMethod$1(1),
  filter: createMethod$1(2),
  some: createMethod$1(3),
  every: createMethod$1(4),
  find: createMethod$1(5),
  findIndex: createMethod$1(6),
  filterOut: createMethod$1(7),
};
var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return (
    !!method &&
    fails(function () {
      method.call(
        null,
        argument ||
          function () {
            throw 1;
          },
        1
      );
    })
  );
};
var defineProperty$3 = Object.defineProperty;
var cache = {};
var thrower = function (it) {
  throw it;
};
var arrayMethodUsesToLength = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : void 0;
  return (cache[METHOD_NAME] =
    !!method &&
    !fails(function () {
      if (ACCESSORS && !descriptors) return true;
      var O = { length: -1 };
      if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
      else O[1] = 1;
      method.call(O, argument0, argument1);
    }));
};
var $forEach = arrayIteration.forEach;
var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');
var arrayForEach =
  !STRICT_METHOD || !USES_TO_LENGTH
    ? function forEach(callbackfn) {
        return $forEach(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : void 0
        );
      }
    : [].forEach;
_export(
  { target: 'Array', proto: true, forced: [].forEach != arrayForEach },
  {
    forEach: arrayForEach,
  }
);
var entryVirtual = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};
var forEach2 = entryVirtual('Array').forEach;
var forEach$1 = forEach2;
var ArrayPrototype = Array.prototype;
var DOMIterables = {
  DOMTokenList: true,
  NodeList: true,
};
var forEach_1 = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype ||
    (it instanceof Array && own === ArrayPrototype.forEach) ||
    DOMIterables.hasOwnProperty(classof(it))
    ? forEach$1
    : own;
};
var forEach$2 = forEach_1;
var forEach$3 = forEach$2;
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeGetOwnPropertyDescriptor$1(1);
});
var FORCED = !descriptors || FAILS_ON_PRIMITIVES;
_export(
  { target: 'Object', stat: true, forced: FORCED, sham: !descriptors },
  {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor3(it, key) {
      return nativeGetOwnPropertyDescriptor$1(toIndexedObject(it), key);
    },
  }
);
var getOwnPropertyDescriptor_1 = createCommonjsModule(function (module) {
  var Object2 = path.Object;
  var getOwnPropertyDescriptor5 = (module.exports =
    function getOwnPropertyDescriptor6(it, key) {
      return Object2.getOwnPropertyDescriptor(it, key);
    });
  if (Object2.getOwnPropertyDescriptor.sham)
    getOwnPropertyDescriptor5.sham = true;
});
var getOwnPropertyDescriptor$2 = getOwnPropertyDescriptor_1;
var getOwnPropertyDescriptor$3 = getOwnPropertyDescriptor$2;
var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';
var process = global_1.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}
var engineV8Version = version && +version;
var SPECIES$1 = wellKnownSymbol('species');
var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  return (
    engineV8Version >= 51 ||
    !fails(function () {
      var array = [];
      var constructor = (array.constructor = {});
      constructor[SPECIES$1] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    })
  );
};
var $filter = arrayIteration.filter;
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter');
_export(
  {
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1,
  },
  {
    filter: function filter(callbackfn) {
      return $filter(
        this,
        callbackfn,
        arguments.length > 1 ? arguments[1] : void 0
      );
    },
  }
);
var filter2 = entryVirtual('Array').filter;
var ArrayPrototype$1 = Array.prototype;
var filter_1 = function (it) {
  var own = it.filter;
  return it === ArrayPrototype$1 ||
    (it instanceof Array && own === ArrayPrototype$1.filter)
    ? filter2
    : own;
};
var filter$1 = filter_1;
var filter$2 = filter$1;
var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;
var toString$1 = {}.toString;
var windowNames =
  typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window)
    : [];
var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};
var f$5 = function getOwnPropertyNames2(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};
var objectGetOwnPropertyNamesExternal = {
  f: f$5,
};
var f$6 = wellKnownSymbol;
var wellKnownSymbolWrapped = {
  f: f$6,
};
var defineProperty$4 = objectDefineProperty.f;
var defineWellKnownSymbol = function (NAME) {
  var Symbol2 = path.Symbol || (path.Symbol = {});
  if (!has(Symbol2, NAME))
    defineProperty$4(Symbol2, NAME, {
      value: wellKnownSymbolWrapped.f(NAME),
    });
};
var $forEach$1 = arrayIteration.forEach;
var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$1 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
var USE_SETTER =
  !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;
var setSymbolDescriptor =
  descriptors &&
  fails(function () {
    return (
      objectCreate(
        nativeDefineProperty$1({}, 'a', {
          get: function () {
            return nativeDefineProperty$1(this, 'a', { value: 7 }).a;
          },
        })
      ).a != 7
    );
  })
    ? function (O, P, Attributes) {
        var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(
          ObjectPrototype$1,
          P
        );
        if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
        nativeDefineProperty$1(O, P, Attributes);
        if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
          nativeDefineProperty$1(
            ObjectPrototype$1,
            P,
            ObjectPrototypeDescriptor
          );
        }
      }
    : nativeDefineProperty$1;
var wrap = function (tag, description) {
  var symbol2 = (AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]));
  setInternalState$1(symbol2, {
    type: SYMBOL,
    tag,
    description,
  });
  if (!descriptors) symbol2.description = description;
  return symbol2;
};
var isSymbol = useSymbolAsUid
  ? function (it) {
      return typeof it == 'symbol';
    }
  : function (it) {
      return Object(it) instanceof $Symbol;
    };
var $defineProperty = function defineProperty3(O, P, Attributes) {
  if (O === ObjectPrototype$1)
    $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN))
        nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, {
        enumerable: createPropertyDescriptor(0, false),
      });
    }
    return setSymbolDescriptor(O, key, Attributes);
  }
  return nativeDefineProperty$1(O, key, Attributes);
};
var $defineProperties = function defineProperties3(O, Properties) {
  anObject(O);
  var properties2 = toIndexedObject(Properties);
  var keys4 = objectKeys(properties2).concat(
    $getOwnPropertySymbols(properties2)
  );
  $forEach$1(keys4, function (key) {
    if (!descriptors || $propertyIsEnumerable.call(properties2, key))
      $defineProperty(O, key, properties2[key]);
  });
  return O;
};
var $create = function create2(O, Properties) {
  return Properties === void 0
    ? objectCreate(O)
    : $defineProperties(objectCreate(O), Properties);
};
var $propertyIsEnumerable = function propertyIsEnumerable2(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
  if (
    this === ObjectPrototype$1 &&
    has(AllSymbols, P) &&
    !has(ObjectPrototypeSymbols, P)
  )
    return false;
  return enumerable ||
    !has(this, P) ||
    !has(AllSymbols, P) ||
    (has(this, HIDDEN) && this[HIDDEN][P])
    ? enumerable
    : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor4(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (
    it === ObjectPrototype$1 &&
    has(AllSymbols, key) &&
    !has(ObjectPrototypeSymbols, key)
  )
    return;
  var descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
  if (
    descriptor &&
    has(AllSymbols, key) &&
    !(has(it, HIDDEN) && it[HIDDEN][key])
  ) {
    descriptor.enumerable = true;
  }
  return descriptor;
};
var $getOwnPropertyNames = function getOwnPropertyNames3(O) {
  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
  var result = [];
  $forEach$1(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames$1(
    IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O)
  );
  var result = [];
  $forEach$1(names, function (key) {
    if (
      has(AllSymbols, key) &&
      (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))
    ) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};
if (!nativeSymbol) {
  $Symbol = function Symbol2() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description =
      !arguments.length || arguments[0] === void 0
        ? void 0
        : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype$1)
        setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag))
        this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER)
      setSymbolDescriptor(ObjectPrototype$1, tag, {
        configurable: true,
        set: setter,
      });
    return wrap(tag, description);
  };
  redefine($Symbol[PROTOTYPE$1], 'toString', function toString3() {
    return getInternalState$1(this).tag;
  });
  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });
  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f =
    $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;
  wellKnownSymbolWrapped.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
  if (descriptors) {
    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$1(this).description;
      },
    });
  }
}
_export(
  { global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol },
  {
    Symbol: $Symbol,
  }
);
$forEach$1(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});
_export(
  { target: SYMBOL, stat: true, forced: !nativeSymbol },
  {
    for: function (key) {
      var string = String(key);
      if (has(StringToSymbolRegistry, string))
        return StringToSymbolRegistry[string];
      var symbol2 = $Symbol(string);
      StringToSymbolRegistry[string] = symbol2;
      SymbolToStringRegistry[symbol2] = string;
      return symbol2;
    },
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () {
      USE_SETTER = true;
    },
    useSimple: function () {
      USE_SETTER = false;
    },
  }
);
_export(
  { target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors },
  {
    create: $create,
    defineProperty: $defineProperty,
    defineProperties: $defineProperties,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  }
);
_export(
  { target: 'Object', stat: true, forced: !nativeSymbol },
  {
    getOwnPropertyNames: $getOwnPropertyNames,
    getOwnPropertySymbols: $getOwnPropertySymbols,
  }
);
_export(
  {
    target: 'Object',
    stat: true,
    forced: fails(function () {
      objectGetOwnPropertySymbols.f(1);
    }),
  },
  {
    getOwnPropertySymbols: function getOwnPropertySymbols2(it) {
      return objectGetOwnPropertySymbols.f(toObject(it));
    },
  }
);
if ($stringify) {
  var FORCED_JSON_STRINGIFY =
    !nativeSymbol ||
    fails(function () {
      var symbol2 = $Symbol();
      return (
        $stringify([symbol2]) != '[null]' ||
        $stringify({ a: symbol2 }) != '{}' ||
        $stringify(Object(symbol2)) != '{}'
      );
    });
  _export(
    { target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY },
    {
      stringify: function stringify3(it, replacer, space) {
        var args = [it];
        var index = 1;
        var $replacer;
        while (arguments.length > index) args.push(arguments[index++]);
        $replacer = replacer;
        if ((!isObject(replacer) && it === void 0) || isSymbol(it)) return;
        if (!isArray(replacer))
          replacer = function (key, value) {
            if (typeof $replacer == 'function')
              value = $replacer.call(this, key, value);
            if (!isSymbol(value)) return value;
          };
        args[1] = replacer;
        return $stringify.apply(null, args);
      },
    }
  );
}
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
  createNonEnumerableProperty(
    $Symbol[PROTOTYPE$1],
    TO_PRIMITIVE,
    $Symbol[PROTOTYPE$1].valueOf
  );
}
setToStringTag($Symbol, SYMBOL);
hiddenKeys[HIDDEN] = true;
var getOwnPropertySymbols3 = path.Object.getOwnPropertySymbols;
var getOwnPropertySymbols$1 = getOwnPropertySymbols3;
var getOwnPropertySymbols$2 = getOwnPropertySymbols$1;
var FAILS_ON_PRIMITIVES$1 = fails(function () {
  objectKeys(1);
});
_export(
  { target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 },
  {
    keys: function keys3(it) {
      return objectKeys(toObject(it));
    },
  }
);
var keys$1 = path.Object.keys;
var keys$2 = keys$1;
var keys$3 = keys$2;
function _defineProperty(obj, key, value) {
  if (key in obj) {
    defineProperty$1(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var defineProperty$5 = _defineProperty;
function ownKeys$1(object, enumerableOnly) {
  var keys4 = keys$3(object);
  if (getOwnPropertySymbols$2) {
    var symbols = getOwnPropertySymbols$2(object);
    if (enumerableOnly)
      symbols = filter$2(symbols).call(symbols, function (sym) {
        return getOwnPropertyDescriptor$3(object, sym).enumerable;
      });
    keys4.push.apply(keys4, symbols);
  }
  return keys4;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      var _context;
      forEach$3((_context = ownKeys$1(Object(source), true))).call(
        _context,
        function (key) {
          defineProperty$5(target, key, source[key]);
        }
      );
    } else if (getOwnPropertyDescriptors$2) {
      defineProperties$1(target, getOwnPropertyDescriptors$2(source));
    } else {
      var _context2;
      forEach$3((_context2 = ownKeys$1(Object(source)))).call(
        _context2,
        function (key) {
          defineProperty$1(
            target,
            key,
            getOwnPropertyDescriptor$3(source, key)
          );
        }
      );
    }
  }
  return target;
}
var objectSpread2 = _objectSpread2;
var freeGlobal =
  typeof commonjsGlobal == 'object' &&
  commonjsGlobal &&
  commonjsGlobal.Object === Object &&
  commonjsGlobal;
var _freeGlobal = freeGlobal;
var freeSelf =
  typeof self == 'object' && self && self.Object === Object && self;
var root = _freeGlobal || freeSelf || Function('return this')();
var _root = root;
var Symbol$2 = _root.Symbol;
var _Symbol = Symbol$2;
var objectProto = Object.prototype;
var hasOwnProperty$1 = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
    tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var _getRawTag = getRawTag;
var objectProto$1 = Object.prototype;
var nativeObjectToString$1 = objectProto$1.toString;
function objectToString$1(value) {
  return nativeObjectToString$1.call(value);
}
var _objectToString = objectToString$1;
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag$1 && symToStringTag$1 in Object(value)
    ? _getRawTag(value)
    : _objectToString(value);
}
var _baseGetTag = baseGetTag;
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
var isObject_1 = isObject$1;
var asyncTag = '[object AsyncFunction]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction;
var coreJsData = _root['__core-js_shared__'];
var _coreJsData = coreJsData;
var maskSrcKey = (function () {
  var uid2 = /[^.]+$/.exec(
    (_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO) || ''
  );
  return uid2 ? 'Symbol(src)_1.' + uid2 : '';
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked;
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}
var _toSource = toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype,
  objectProto$2 = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp(
  '^' +
    funcToString$1
      .call(hasOwnProperty$2)
      .replace(reRegExpChar, '\\$&')
      .replace(
        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
        '$1.*?'
      ) +
    '$'
);
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}
var _baseIsNative = baseIsNative;
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue;
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : void 0;
}
var _getNative = getNative;
var defineProperty$6 = (function () {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
})();
var _defineProperty$1 = defineProperty$6;
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    object[key] = value;
  }
}
var _baseAssignValue = baseAssignValue;
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}
var eq_1 = eq;
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (
    !(hasOwnProperty$3.call(object, key) && eq_1(objValue, value)) ||
    (value === void 0 && !(key in object))
  ) {
    _baseAssignValue(object, key, value);
  }
}
var _assignValue = assignValue;
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
    length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}
var _copyObject = copyObject;
function identity(value) {
  return value;
}
var identity_1 = identity;
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply = apply;
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
      index = -1,
      length = nativeMax(args.length - start, 0),
      array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}
var _overRest = overRest;
function constant(value) {
  return function () {
    return value;
  };
}
var constant_1 = constant;
var baseSetToString = !_defineProperty$1
  ? identity_1
  : function (func, string) {
      return _defineProperty$1(func, 'toString', {
        configurable: true,
        enumerable: false,
        value: constant_1(string),
        writable: true,
      });
    };
var _baseSetToString = baseSetToString;
var HOT_COUNT = 800,
  HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0,
    lastCalled = 0;
  return function () {
    var stamp = nativeNow(),
      remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var _shortOut = shortOut;
var setToString = _shortOut(_baseSetToString);
var _setToString = setToString;
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}
var _baseRest = baseRest;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return (
    typeof value == 'number' &&
    value > -1 &&
    value % 1 == 0 &&
    value <= MAX_SAFE_INTEGER
  );
}
var isLength_1 = isLength;
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}
var isArrayLike_1 = isArrayLike;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return (
    !!length &&
    (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}
var _isIndex = isIndex;
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (
    type == 'number'
      ? isArrayLike_1(object) && _isIndex(index, object.length)
      : type == 'string' && index in object
  ) {
    return eq_1(object[index], value);
  }
  return false;
}
var _isIterateeCall = isIterateeCall;
function createAssigner(assigner) {
  return _baseRest(function (object, sources) {
    var index = -1,
      length = sources.length,
      customizer = length > 1 ? sources[length - 1] : void 0,
      guard = length > 2 ? sources[2] : void 0;
    customizer =
      assigner.length > 3 && typeof customizer == 'function'
        ? (length--, customizer)
        : void 0;
    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var _createAssigner = createAssigner;
var objectProto$4 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;
  return value === proto;
}
var _isPrototype = isPrototype;
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var _baseTimes = baseTimes;
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}
var isObjectLike_1 = isObjectLike;
var argsTag = '[object Arguments]';
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}
var _baseIsArguments = baseIsArguments;
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
var propertyIsEnumerable3 = objectProto$5.propertyIsEnumerable;
var isArguments = _baseIsArguments(
  (function () {
    return arguments;
  })()
)
  ? _baseIsArguments
  : function (value) {
      return (
        isObjectLike_1(value) &&
        hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable3.call(value, 'callee')
      );
    };
var isArguments_1 = isArguments;
var isArray$1 = Array.isArray;
var isArray_1 = isArray$1;
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
var isBuffer_1 = createCommonjsModule(function (module, exports) {
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? _root.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse_1;
  module.exports = isBuffer;
});
var argsTag$1 = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag$1 = '[object Function]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    true;
typedArrayTags[argsTag$1] =
  typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] =
  typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] =
  typedArrayTags[dateTag] =
  typedArrayTags[errorTag] =
  typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] =
  typedArrayTags[numberTag] =
  typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] =
  typedArrayTags[setTag] =
  typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] =
    false;
function baseIsTypedArray(value) {
  return (
    isObjectLike_1(value) &&
    isLength_1(value.length) &&
    !!typedArrayTags[_baseGetTag(value)]
  );
}
var _baseIsTypedArray = baseIsTypedArray;
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}
var _baseUnary = baseUnary;
var _nodeUtil = createCommonjsModule(function (module, exports) {
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && _freeGlobal.process;
  var nodeUtil = (function () {
    try {
      var types =
        freeModule && freeModule.require && freeModule.require('util').types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  })();
  module.exports = nodeUtil;
});
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray
  ? _baseUnary(nodeIsTypedArray)
  : _baseIsTypedArray;
var isTypedArray_1 = isTypedArray;
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
    isArg = !isArr && isArguments_1(value),
    isBuff = !isArr && !isArg && isBuffer_1(value),
    isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? _baseTimes(value.length, String) : [],
    length = result.length;
  for (var key in value) {
    if (
      (inherited || hasOwnProperty$5.call(value, key)) &&
      !(
        skipIndexes &&
        (key == 'length' ||
          (isBuff && (key == 'offset' || key == 'parent')) ||
          (isType &&
            (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
          _isIndex(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}
var _arrayLikeKeys = arrayLikeKeys;
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg;
var nativeKeys = _overArg(Object.keys, Object);
var _nativeKeys = nativeKeys;
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys;
function keys$4(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}
var keys_1 = keys$4;
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
var assign = _createAssigner(function (object, source) {
  if (_isPrototype(source) || isArrayLike_1(source)) {
    _copyObject(source, keys_1(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty$7.call(source, key)) {
      _assignValue(object, key, source[key]);
    }
  }
});
var assign_1 = assign;
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
var _baseClamp = baseClamp;
function arrayMap(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length,
    result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var _arrayMap = arrayMap;
var symbolTag = '[object Symbol]';
function isSymbol$1(value) {
  return (
    typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag)
  );
}
var isSymbol_1 = isSymbol$1;
var INFINITY = 1 / 0;
var symbolProto = _Symbol ? _Symbol.prototype : void 0,
  symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
var _baseToString = baseToString;
var NAN = 0 / 0;
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value)
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : reIsBadHex.test(value)
    ? NAN
    : +value;
}
var toNumber_1 = toNumber;
var INFINITY$1 = 1 / 0,
  MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_1 = toFinite;
function toInteger$1(value) {
  var result = toFinite_1(value),
    remainder = result % 1;
  return result === result ? (remainder ? result - remainder : result) : 0;
}
var toInteger_1 = toInteger$1;
function toString$2(value) {
  return value == null ? '' : _baseToString(value);
}
var toString_1 = toString$2;
function startsWith(string, target, position) {
  string = toString_1(string);
  position =
    position == null ? 0 : _baseClamp(toInteger_1(position), 0, string.length);
  target = _baseToString(target);
  return string.slice(position, position + target.length) == target;
}
var startsWith_1 = startsWith;
var createMethod$2 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size)
      return CONVERT_TO_STRING ? '' : void 0;
    first = S.charCodeAt(position);
    return first < 55296 ||
      first > 56319 ||
      position + 1 === size ||
      (second = S.charCodeAt(position + 1)) < 56320 ||
      second > 57343
      ? CONVERT_TO_STRING
        ? S.charAt(position)
        : first
      : CONVERT_TO_STRING
      ? S.slice(position, position + 2)
      : ((first - 55296) << 10) + (second - 56320) + 65536;
  };
};
var stringMultibyte = {
  codeAt: createMethod$2(false),
  charAt: createMethod$2(true),
};
var charAt = stringMultibyte.charAt;
var STRING_ITERATOR = 'String Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);
defineIterator(
  String,
  'String',
  function (iterated) {
    setInternalState$2(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0,
    });
  },
  function next() {
    var state = getInternalState$2(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: void 0, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  }
);
var ITERATOR$2 = wellKnownSymbol('iterator');
var getIteratorMethod = function (it) {
  if (it != void 0)
    return it[ITERATOR$2] || it['@@iterator'] || iterators[classof(it)];
};
var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  }
  return anObject(iteratorMethod.call(it));
};
var getIterator_1 = getIterator;
var getIterator$1 = getIterator_1;
_export(
  { target: 'Array', stat: true },
  {
    isArray,
  }
);
var isArray$2 = path.Array.isArray;
var isArray$3 = isArray$2;
var isArray$4 = isArray$3;
var getIteratorMethod_1 = getIteratorMethod;
var getIteratorMethod$1 = getIteratorMethod_1;
var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER$2 = 9007199254740991;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
var IS_CONCAT_SPREADABLE_SUPPORT =
  engineV8Version >= 51 ||
  !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });
var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');
var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== void 0 ? !!spreadable : isArray(O);
};
var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
_export(
  { target: 'Array', proto: true, forced: FORCED$1 },
  {
    concat: function concat(arg) {
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER$2)
            throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER$2)
            throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    },
  }
);
defineWellKnownSymbol('asyncIterator');
defineWellKnownSymbol('hasInstance');
defineWellKnownSymbol('isConcatSpreadable');
defineWellKnownSymbol('iterator');
defineWellKnownSymbol('match');
defineWellKnownSymbol('matchAll');
defineWellKnownSymbol('replace');
defineWellKnownSymbol('search');
defineWellKnownSymbol('species');
defineWellKnownSymbol('split');
defineWellKnownSymbol('toPrimitive');
defineWellKnownSymbol('toStringTag');
defineWellKnownSymbol('unscopables');
setToStringTag(global_1.JSON, 'JSON', true);
var symbol = path.Symbol;
defineWellKnownSymbol('asyncDispose');
defineWellKnownSymbol('dispose');
defineWellKnownSymbol('observable');
defineWellKnownSymbol('patternMatch');
defineWellKnownSymbol('replaceAll');
var symbol$1 = symbol;
var symbol$2 = symbol$1;
var iteratorClose = function (iterator2) {
  var returnMethod = iterator2['return'];
  if (returnMethod !== void 0) {
    return anObject(returnMethod.call(iterator2)).value;
  }
};
var callWithSafeIterationClosing = function (iterator2, fn, value, ENTRIES2) {
  try {
    return ENTRIES2 ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator2);
    throw error;
  }
};
var ITERATOR$3 = wellKnownSymbol('iterator');
var ArrayPrototype$2 = Array.prototype;
var isArrayIteratorMethod = function (it) {
  return (
    it !== void 0 &&
    (iterators.Array === it || ArrayPrototype$2[ITERATOR$3] === it)
  );
};
var arrayFrom = function from(arrayLike) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
  var mapping = mapfn !== void 0;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator2, next2, value;
  if (mapping)
    mapfn = functionBindContext(
      mapfn,
      argumentsLength > 2 ? arguments[2] : void 0,
      2
    );
  if (
    iteratorMethod != void 0 &&
    !(C == Array && isArrayIteratorMethod(iteratorMethod))
  ) {
    iterator2 = iteratorMethod.call(O);
    next2 = iterator2.next;
    result = new C();
    for (; !(step = next2.call(iterator2)).done; index++) {
      value = mapping
        ? callWithSafeIterationClosing(
            iterator2,
            mapfn,
            [step.value, index],
            true
          )
        : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (; length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};
var ITERATOR$4 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;
try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    return: function () {
      SAFE_CLOSING = true;
    },
  };
  iteratorWithReturn[ITERATOR$4] = function () {
    return this;
  };
  Array.from(iteratorWithReturn, function () {
    throw 2;
  });
} catch (error) {}
var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$4] = function () {
      return {
        next: function () {
          return { done: (ITERATION_SUPPORT = true) };
        },
      };
    };
    exec(object);
  } catch (error) {}
  return ITERATION_SUPPORT;
};
var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});
_export(
  { target: 'Array', stat: true, forced: INCORRECT_ITERATION },
  {
    from: arrayFrom,
  }
);
var from_1 = path.Array.from;
var from_1$1 = from_1;
var from_1$2 = from_1$1;
var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH$2 = arrayMethodUsesToLength('slice', {
  ACCESSORS: true,
  0: 0,
  1: 2,
});
var SPECIES$2 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;
_export(
  {
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2,
  },
  {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
      var Constructor, result, n;
      if (isArray(O)) {
        Constructor = O.constructor;
        if (
          typeof Constructor == 'function' &&
          (Constructor === Array || isArray(Constructor.prototype))
        ) {
          Constructor = void 0;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES$2];
          if (Constructor === null) Constructor = void 0;
        }
        if (Constructor === Array || Constructor === void 0) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === void 0 ? Array : Constructor)(
        max$1(fin - k, 0)
      );
      for (n = 0; k < fin; k++, n++)
        if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    },
  }
);
var slice2 = entryVirtual('Array').slice;
var ArrayPrototype$3 = Array.prototype;
var slice_1 = function (it) {
  var own = it.slice;
  return it === ArrayPrototype$3 ||
    (it instanceof Array && own === ArrayPrototype$3.slice)
    ? slice2
    : own;
};
var slice$1 = slice_1;
var slice$2 = slice$1;
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var arrayLikeToArray = _arrayLikeToArray;
function _unsupportedIterableToArray(o, minLen) {
  var _context;
  if (!o) return;
  if (typeof o === 'string') return arrayLikeToArray(o, minLen);
  var n = slice$2((_context = Object.prototype.toString.call(o))).call(
    _context,
    8,
    -1
  );
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return from_1$2(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return arrayLikeToArray(o, minLen);
}
var unsupportedIterableToArray = _unsupportedIterableToArray;
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof symbol$2 === 'undefined' || getIteratorMethod$1(o) == null) {
    if (
      isArray$4(o) ||
      (it = unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === 'number')
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F2() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length)
            return {
              done: true,
            };
          return {
            done: false,
            value: o[i++],
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = getIterator$1(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f2() {
      try {
        if (!normalCompletion && it['return'] != null) it['return']();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}
var createForOfIteratorHelper = _createForOfIteratorHelper;
var iterator = wellKnownSymbolWrapped.f('iterator');
var iterator$1 = iterator;
var iterator$2 = iterator$1;
var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    '@babel/helpers - typeof';
    if (typeof symbol$2 === 'function' && typeof iterator$2 === 'symbol') {
      module.exports = _typeof = function _typeof2(obj2) {
        return typeof obj2;
      };
    } else {
      module.exports = _typeof = function _typeof2(obj2) {
        return obj2 &&
          typeof symbol$2 === 'function' &&
          obj2.constructor === symbol$2 &&
          obj2 !== symbol$2.prototype
          ? 'symbol'
          : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  module.exports = _typeof;
});
function _arrayWithHoles(arr) {
  if (isArray$4(arr)) return arr;
}
var arrayWithHoles = _arrayWithHoles;
var ITERATOR$5 = wellKnownSymbol('iterator');
var isIterable = function (it) {
  var O = Object(it);
  return (
    O[ITERATOR$5] !== void 0 ||
    '@@iterator' in O ||
    iterators.hasOwnProperty(classof(O))
  );
};
var isIterable_1 = isIterable;
var isIterable$1 = isIterable_1;
function _iterableToArrayLimit(arr, i) {
  if (typeof symbol$2 === 'undefined' || !isIterable$1(Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (
      var _i = getIterator$1(arr), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
var iterableToArrayLimit = _iterableToArrayLimit;
function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
var nonIterableRest = _nonIterableRest;
function _slicedToArray(arr, i) {
  return (
    arrayWithHoles(arr) ||
    iterableToArrayLimit(arr, i) ||
    unsupportedIterableToArray(arr, i) ||
    nonIterableRest()
  );
}
var slicedToArray = _slicedToArray;
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(
    unboundFunction,
    that,
    1 + AS_ENTRIES + INTERRUPTED
  );
  var iterator2, iterFn, index, length, result, next2, step;
  var stop = function (condition) {
    if (iterator2) iteratorClose(iterator2);
    return new Result(true, condition);
  };
  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED
        ? fn(value[0], value[1], stop)
        : fn(value[0], value[1]);
    }
    return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_ITERATOR) {
    iterator2 = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    if (isArrayIteratorMethod(iterFn)) {
      for (
        index = 0, length = toLength(iterable.length);
        length > index;
        index++
      ) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      }
      return new Result(false);
    }
    iterator2 = iterFn.call(iterable);
  }
  next2 = iterator2.next;
  while (!(step = next2.call(iterator2)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator2);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result)
      return result;
  }
  return new Result(false);
};
var $AggregateError = function AggregateError(errors, message) {
  var that = this;
  if (!(that instanceof $AggregateError))
    return new $AggregateError(errors, message);
  if (objectSetPrototypeOf) {
    that = objectSetPrototypeOf(new Error(void 0), objectGetPrototypeOf(that));
  }
  if (message !== void 0)
    createNonEnumerableProperty(that, 'message', String(message));
  var errorsArray = [];
  iterate(errors, errorsArray.push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};
$AggregateError.prototype = objectCreate(Error.prototype, {
  constructor: createPropertyDescriptor(5, $AggregateError),
  message: createPropertyDescriptor(5, ''),
  name: createPropertyDescriptor(5, 'AggregateError'),
});
_export(
  { global: true },
  {
    AggregateError: $AggregateError,
  }
);
var nativePromiseConstructor = global_1.Promise;
var redefineAll = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else redefine(target, key, src[key], options);
  }
  return target;
};
var SPECIES$3 = wellKnownSymbol('species');
var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty4 = objectDefineProperty.f;
  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
    defineProperty4(Constructor, SPECIES$3, {
      configurable: true,
      get: function () {
        return this;
      },
    });
  }
};
var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  }
  return it;
};
var SPECIES$4 = wellKnownSymbol('species');
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === void 0 || (S = anObject(C)[SPECIES$4]) == void 0
    ? defaultConstructor
    : aFunction(S);
};
var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);
var engineIsNode = classofRaw(global_1.process) == 'process';
var location = global_1.location;
var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$1 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function (id2) {
  if (queue.hasOwnProperty(id2)) {
    var fn = queue[id2];
    delete queue[id2];
    fn();
  }
};
var runner = function (id2) {
  return function () {
    run(id2);
  };
};
var listener = function (event) {
  run(event.data);
};
var post = function (id2) {
  global_1.postMessage(id2 + '', location.protocol + '//' + location.host);
};
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      (typeof fn == 'function' ? fn : Function(fn)).apply(void 0, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id2) {
    delete queue[id2];
  };
  if (engineIsNode) {
    defer = function (id2) {
      process$1.nextTick(runner(id2));
    };
  } else if (Dispatch && Dispatch.now) {
    defer = function (id2) {
      Dispatch.now(runner(id2));
    };
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location &&
    location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id2) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] =
        function () {
          html.removeChild(this);
          run(id2);
        };
    };
  } else {
    defer = function (id2) {
      setTimeout(runner(id2), 0);
    };
  }
}
var task = {
  set: set$1,
  clear,
};
var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);
var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
var macrotask = task.set;
var MutationObserver =
  global_1.MutationObserver || global_1.WebKitMutationObserver;
var document$2 = global_1.document;
var process$2 = global_1.process;
var Promise$1 = global_1.Promise;
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$4(
  global_1,
  'queueMicrotask'
);
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var flush, head, last, notify, toggle, node, promise, then;
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (engineIsNode && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = void 0;
        throw error;
      }
    }
    last = void 0;
    if (parent) parent.enter();
  };
  if (
    !engineIsIos &&
    !engineIsNode &&
    !engineIsWebosWebkit &&
    MutationObserver &&
    document$2
  ) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  } else if (Promise$1 && Promise$1.resolve) {
    promise = Promise$1.resolve(void 0);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  } else if (engineIsNode) {
    notify = function () {
      process$2.nextTick(flush);
    };
  } else {
    notify = function () {
      macrotask.call(global_1, flush);
    };
  }
}
var microtask =
  queueMicrotask ||
  function (fn) {
    var task2 = { fn, next: void 0 };
    if (last) last.next = task2;
    if (!head) {
      head = task2;
      notify();
    }
    last = task2;
  };
var PromiseCapability = function (C) {
  var resolve4, reject2;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve4 !== void 0 || reject2 !== void 0)
      throw TypeError('Bad Promise constructor');
    resolve4 = $$resolve;
    reject2 = $$reject;
  });
  this.resolve = aFunction(resolve4);
  this.reject = aFunction(reject2);
};
var f$7 = function (C) {
  return new PromiseCapability(C);
};
var newPromiseCapability = {
  f: f$7,
};
var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve4 = promiseCapability.resolve;
  resolve4(x);
  return promiseCapability.promise;
};
var hostReportErrors = function (a, b) {
  var console2 = global_1.console;
  if (console2 && console2.error) {
    arguments.length === 1 ? console2.error(a) : console2.error(a, b);
  }
};
var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};
var task$1 = task.set;
var SPECIES$5 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState$3 = internalState.get;
var setInternalState$3 = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var PromiseConstructor = nativePromiseConstructor;
var TypeError$1 = global_1.TypeError;
var document$3 = global_1.document;
var process$3 = global_1.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var DISPATCH_EVENT = !!(
  document$3 &&
  document$3.createEvent &&
  global_1.dispatchEvent
);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper;
var FORCED$2 = isForced_1(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE =
    inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    if (engineV8Version === 66) return true;
    if (!engineIsNode && !NATIVE_REJECTION_EVENT) return true;
  }
  if (!PromiseConstructor.prototype['finally']) return true;
  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor))
    return false;
  var promise2 = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(
      function () {},
      function () {}
    );
  };
  var constructor = (promise2.constructor = {});
  constructor[SPECIES$5] = FakePromise;
  return !(promise2.then(function () {}) instanceof FakePromise);
});
var INCORRECT_ITERATION$1 =
  FORCED$2 ||
  !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () {});
  });
var isThenable = function (it) {
  var then2;
  return isObject(it) && typeof (then2 = it.then) == 'function' ? then2 : false;
};
var notify$1 = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve4 = reaction.resolve;
      var reject2 = reaction.reject;
      var domain = reaction.domain;
      var result, then2, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject2(TypeError$1('Promise-chain cycle'));
          } else if ((then2 = isThenable(result))) {
            then2.call(result, resolve4, reject2);
          } else resolve4(result);
        } else reject2(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject2(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};
var dispatchEvent = function (name, promise2, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$3.createEvent('Event');
    event.promise = promise2;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise2, reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name]))
    handler(event);
  else if (name === UNHANDLED_REJECTION)
    hostReportErrors('Unhandled promise rejection', reason);
};
var onUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise2 = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (engineIsNode) {
          process$3.emit('unhandledRejection', value, promise2);
        } else dispatchEvent(UNHANDLED_REJECTION, promise2, value);
      });
      state.rejection =
        engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};
var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};
var onHandleUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise2 = state.facade;
    if (engineIsNode) {
      process$3.emit('rejectionHandled', promise2);
    } else dispatchEvent(REJECTION_HANDLED, promise2, state.value);
  });
};
var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};
var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(state, true);
};
var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value)
      throw TypeError$1("Promise can't be resolved itself");
    var then2 = isThenable(value);
    if (then2) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then2.call(
            value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};
if (FORCED$2) {
  PromiseConstructor = function Promise2(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState$3(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  Internal = function Promise2(executor) {
    setInternalState$3(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: void 0,
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    then: function then2(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(
        speciesConstructor(this, PromiseConstructor)
      );
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = engineIsNode ? process$3.domain : void 0;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(state, false);
      return reaction.promise;
    },
    catch: function (onRejected) {
      return this.then(void 0, onRejected);
    },
  });
  OwnPromiseCapability = function () {
    var promise2 = new Internal();
    var state = getInternalState$3(promise2);
    this.promise = promise2;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}
_export(
  { global: true, wrap: true, forced: FORCED$2 },
  {
    Promise: PromiseConstructor,
  }
);
setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);
PromiseWrapper = getBuiltIn(PROMISE);
_export(
  { target: PROMISE, stat: true, forced: FORCED$2 },
  {
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(void 0, r);
      return capability.promise;
    },
  }
);
_export(
  { target: PROMISE, stat: true, forced: isPure },
  {
    resolve: function resolve(x) {
      return promiseResolve(
        this === PromiseWrapper ? PromiseConstructor : this,
        x
      );
    },
  }
);
_export(
  { target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 },
  {
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve4 = capability.resolve;
      var reject2 = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction(C.resolve);
        var values = [];
        var counter2 = 0;
        var remaining = 1;
        iterate(iterable, function (promise2) {
          var index = counter2++;
          var alreadyCalled = false;
          values.push(void 0);
          remaining++;
          $promiseResolve.call(C, promise2).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve4(values);
          }, reject2);
        });
        --remaining || resolve4(values);
      });
      if (result.error) reject2(result.value);
      return capability.promise;
    },
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject2 = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction(C.resolve);
        iterate(iterable, function (promise2) {
          $promiseResolve.call(C, promise2).then(capability.resolve, reject2);
        });
      });
      if (result.error) reject2(result.value);
      return capability.promise;
    },
  }
);
_export(
  { target: 'Promise', stat: true },
  {
    allSettled: function allSettled(iterable) {
      var C = this;
      var capability = newPromiseCapability.f(C);
      var resolve4 = capability.resolve;
      var reject2 = capability.reject;
      var result = perform(function () {
        var promiseResolve2 = aFunction(C.resolve);
        var values = [];
        var counter2 = 0;
        var remaining = 1;
        iterate(iterable, function (promise2) {
          var index = counter2++;
          var alreadyCalled = false;
          values.push(void 0);
          remaining++;
          promiseResolve2.call(C, promise2).then(
            function (value) {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[index] = { status: 'fulfilled', value };
              --remaining || resolve4(values);
            },
            function (error) {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[index] = { status: 'rejected', reason: error };
              --remaining || resolve4(values);
            }
          );
        });
        --remaining || resolve4(values);
      });
      if (result.error) reject2(result.value);
      return capability.promise;
    },
  }
);
var PROMISE_ANY_ERROR = 'No one promise resolved';
_export(
  { target: 'Promise', stat: true },
  {
    any: function any(iterable) {
      var C = this;
      var capability = newPromiseCapability.f(C);
      var resolve4 = capability.resolve;
      var reject2 = capability.reject;
      var result = perform(function () {
        var promiseResolve2 = aFunction(C.resolve);
        var errors = [];
        var counter2 = 0;
        var remaining = 1;
        var alreadyResolved = false;
        iterate(iterable, function (promise2) {
          var index = counter2++;
          var alreadyRejected = false;
          errors.push(void 0);
          remaining++;
          promiseResolve2.call(C, promise2).then(
            function (value) {
              if (alreadyRejected || alreadyResolved) return;
              alreadyResolved = true;
              resolve4(value);
            },
            function (error) {
              if (alreadyRejected || alreadyResolved) return;
              alreadyRejected = true;
              errors[index] = error;
              --remaining ||
                reject2(
                  new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR)
                );
            }
          );
        });
        --remaining ||
          reject2(
            new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR)
          );
      });
      if (result.error) reject2(result.value);
      return capability.promise;
    },
  }
);
var NON_GENERIC =
  !!nativePromiseConstructor &&
  fails(function () {
    nativePromiseConstructor.prototype['finally'].call(
      { then: function () {} },
      function () {}
    );
  });
_export(
  { target: 'Promise', proto: true, real: true, forced: NON_GENERIC },
  {
    finally: function (onFinally) {
      var C = speciesConstructor(this, getBuiltIn('Promise'));
      var isFunction2 = typeof onFinally == 'function';
      return this.then(
        isFunction2
          ? function (x) {
              return promiseResolve(C, onFinally()).then(function () {
                return x;
              });
            }
          : onFinally,
        isFunction2
          ? function (e) {
              return promiseResolve(C, onFinally()).then(function () {
                throw e;
              });
            }
          : onFinally
      );
    },
  }
);
var promise$1 = path.Promise;
_export(
  { target: 'Promise', stat: true },
  {
    try: function (callbackfn) {
      var promiseCapability = newPromiseCapability.f(this);
      var result = perform(callbackfn);
      (result.error ? promiseCapability.reject : promiseCapability.resolve)(
        result.value
      );
      return promiseCapability.promise;
    },
  }
);
var promise$2 = promise$1;
var promise$3 = promise$2;
function asyncGeneratorStep(gen, resolve4, reject2, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject2(error);
    return;
  }
  if (info.done) {
    resolve4(value);
  } else {
    promise$3.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self2 = this,
      args = arguments;
    return new promise$3(function (resolve4, reject2) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(
          gen,
          resolve4,
          reject2,
          _next,
          _throw,
          'next',
          value
        );
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve4, reject2, _next, _throw, 'throw', err);
      }
      _next(void 0);
    });
  };
}
var asyncToGenerator = _asyncToGenerator;
var runtime_1 = createCommonjsModule(function (module) {
  var runtime = (function (exports) {
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1;
    var $Symbol2 = typeof Symbol === 'function' ? Symbol : {};
    var iteratorSymbol = $Symbol2.iterator || '@@iterator';
    var asyncIteratorSymbol = $Symbol2.asyncIterator || '@@asyncIterator';
    var toStringTagSymbol = $Symbol2.toStringTag || '@@toStringTag';
    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
      return obj[key];
    }
    try {
      define({}, '');
    } catch (err) {
      define = function (obj, key, value) {
        return (obj[key] = value);
      };
    }
    function wrap2(innerFn, outerFn, self2, tryLocsList) {
      var protoGenerator =
        outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context2 = new Context(tryLocsList || []);
      generator._invoke = makeInvokeMethod(innerFn, self2, context2);
      return generator;
    }
    exports.wrap = wrap2;
    function tryCatch(fn, obj, arg) {
      try {
        return { type: 'normal', arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: 'throw', arg: err };
      }
    }
    var GenStateSuspendedStart = 'suspendedStart';
    var GenStateSuspendedYield = 'suspendedYield';
    var GenStateExecuting = 'executing';
    var GenStateCompleted = 'completed';
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype2 = {};
    IteratorPrototype2[iteratorSymbol] = function () {
      return this;
    };
    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (
      NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
    ) {
      IteratorPrototype2 = NativeIteratorPrototype;
    }
    var Gp =
      (GeneratorFunctionPrototype.prototype =
      Generator.prototype =
        Object.create(IteratorPrototype2));
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      'GeneratorFunction'
    );
    function defineIteratorMethods(prototype) {
      ['next', 'throw', 'return'].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === 'function' && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
            (ctor.displayName || ctor.name) === 'GeneratorFunction'
        : false;
    };
    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, 'GeneratorFunction');
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };
    exports.awrap = function (arg) {
      return { __await: arg };
    };
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve4, reject2) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === 'throw') {
          reject2(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (
            value &&
            typeof value === 'object' &&
            hasOwn.call(value, '__await')
          ) {
            return PromiseImpl.resolve(value.__await).then(
              function (value2) {
                invoke('next', value2, resolve4, reject2);
              },
              function (err) {
                invoke('throw', err, resolve4, reject2);
              }
            );
          }
          return PromiseImpl.resolve(value).then(
            function (unwrapped) {
              result.value = unwrapped;
              resolve4(result);
            },
            function (error) {
              return invoke('throw', error, resolve4, reject2);
            }
          );
        }
      }
      var previousPromise;
      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve4, reject2) {
            invoke(method, arg, resolve4, reject2);
          });
        }
        return (previousPromise = previousPromise
          ? previousPromise.then(
              callInvokeWithMethodAndArg,
              callInvokeWithMethodAndArg
            )
          : callInvokeWithMethodAndArg());
      }
      this._invoke = enqueue;
    }
    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;
    exports.async = function (
      innerFn,
      outerFn,
      self2,
      tryLocsList,
      PromiseImpl
    ) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(
        wrap2(innerFn, outerFn, self2, tryLocsList),
        PromiseImpl
      );
      return exports.isGeneratorFunction(outerFn)
        ? iter
        : iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
    };
    function makeInvokeMethod(innerFn, self2, context2) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error('Generator is already running');
        }
        if (state === GenStateCompleted) {
          if (method === 'throw') {
            throw arg;
          }
          return doneResult();
        }
        context2.method = method;
        context2.arg = arg;
        while (true) {
          var delegate = context2.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context2);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if (context2.method === 'next') {
            context2.sent = context2._sent = context2.arg;
          } else if (context2.method === 'throw') {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context2.arg;
            }
            context2.dispatchException(context2.arg);
          } else if (context2.method === 'return') {
            context2.abrupt('return', context2.arg);
          }
          state = GenStateExecuting;
          var record = tryCatch(innerFn, self2, context2);
          if (record.type === 'normal') {
            state = context2.done ? GenStateCompleted : GenStateSuspendedYield;
            if (record.arg === ContinueSentinel) {
              continue;
            }
            return {
              value: record.arg,
              done: context2.done,
            };
          } else if (record.type === 'throw') {
            state = GenStateCompleted;
            context2.method = 'throw';
            context2.arg = record.arg;
          }
        }
      };
    }
    function maybeInvokeDelegate(delegate, context2) {
      var method = delegate.iterator[context2.method];
      if (method === undefined$1) {
        context2.delegate = null;
        if (context2.method === 'throw') {
          if (delegate.iterator['return']) {
            context2.method = 'return';
            context2.arg = undefined$1;
            maybeInvokeDelegate(delegate, context2);
            if (context2.method === 'throw') {
              return ContinueSentinel;
            }
          }
          context2.method = 'throw';
          context2.arg = new TypeError(
            "The iterator does not provide a 'throw' method"
          );
        }
        return ContinueSentinel;
      }
      var record = tryCatch(method, delegate.iterator, context2.arg);
      if (record.type === 'throw') {
        context2.method = 'throw';
        context2.arg = record.arg;
        context2.delegate = null;
        return ContinueSentinel;
      }
      var info = record.arg;
      if (!info) {
        context2.method = 'throw';
        context2.arg = new TypeError('iterator result is not an object');
        context2.delegate = null;
        return ContinueSentinel;
      }
      if (info.done) {
        context2[delegate.resultName] = info.value;
        context2.next = delegate.nextLoc;
        if (context2.method !== 'return') {
          context2.method = 'next';
          context2.arg = undefined$1;
        }
      } else {
        return info;
      }
      context2.delegate = null;
      return ContinueSentinel;
    }
    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, 'Generator');
    Gp[iteratorSymbol] = function () {
      return this;
    };
    Gp.toString = function () {
      return '[object Generator]';
    };
    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };
      if (1 in locs) {
        entry.catchLoc = locs[1];
      }
      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }
      this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = 'normal';
      delete record.arg;
      entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{ tryLoc: 'root' }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }
    exports.keys = function (object) {
      var keys4 = [];
      for (var key in object) {
        keys4.push(key);
      }
      keys4.reverse();
      return function next2() {
        while (keys4.length) {
          var key2 = keys4.pop();
          if (key2 in object) {
            next2.value = key2;
            next2.done = false;
            return next2;
          }
        }
        next2.done = true;
        return next2;
      };
    };
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }
        if (typeof iterable.next === 'function') {
          return iterable;
        }
        if (!isNaN(iterable.length)) {
          var i = -1,
            next2 = function next3() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next3.value = iterable[i];
                  next3.done = false;
                  return next3;
                }
              }
              next3.value = undefined$1;
              next3.done = true;
              return next3;
            };
          return (next2.next = next2);
        }
      }
      return { next: doneResult };
    }
    exports.values = values;
    function doneResult() {
      return { value: undefined$1, done: true };
    }
    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = 'next';
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);
        if (!skipTempReset) {
          for (var name in this) {
            if (
              name.charAt(0) === 't' &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))
            ) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === 'throw') {
          throw rootRecord.arg;
        }
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }
        var context2 = this;
        function handle(loc, caught) {
          record.type = 'throw';
          record.arg = exception;
          context2.next = loc;
          if (caught) {
            context2.method = 'next';
            context2.arg = undefined$1;
          }
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;
          if (entry.tryLoc === 'root') {
            return handle('end');
          }
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, 'catchLoc');
            var hasFinally = hasOwn.call(entry, 'finallyLoc');
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error('try statement without catch or finally');
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (
            entry.tryLoc <= this.prev &&
            hasOwn.call(entry, 'finallyLoc') &&
            this.prev < entry.finallyLoc
          ) {
            var finallyEntry = entry;
            break;
          }
        }
        if (
          finallyEntry &&
          (type === 'break' || type === 'continue') &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc
        ) {
          finallyEntry = null;
        }
        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;
        if (finallyEntry) {
          this.method = 'next';
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }
        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === 'throw') {
          throw record.arg;
        }
        if (record.type === 'break' || record.type === 'continue') {
          this.next = record.arg;
        } else if (record.type === 'return') {
          this.rval = this.arg = record.arg;
          this.method = 'return';
          this.next = 'end';
        } else if (record.type === 'normal' && afterLoc) {
          this.next = afterLoc;
        }
        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === 'throw') {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error('illegal catch attempt');
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName,
          nextLoc,
        };
        if (this.method === 'next') {
          this.arg = undefined$1;
        }
        return ContinueSentinel;
      },
    };
    return exports;
  })(module.exports);
  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    Function('r', 'regeneratorRuntime = r')(runtime);
  }
});
var regenerator = runtime_1;
var $includes = arrayIncludes.includes;
var USES_TO_LENGTH$3 = arrayMethodUsesToLength('indexOf', {
  ACCESSORS: true,
  1: 0,
});
_export(
  { target: 'Array', proto: true, forced: !USES_TO_LENGTH$3 },
  {
    includes: function includes(el) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
    },
  }
);
var includes2 = entryVirtual('Array').includes;
var MATCH = wellKnownSymbol('match');
var isRegexp = function (it) {
  var isRegExp;
  return (
    isObject(it) &&
    ((isRegExp = it[MATCH]) !== void 0
      ? !!isRegExp
      : classofRaw(it) == 'RegExp')
  );
};
var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  }
  return it;
};
var MATCH$1 = wellKnownSymbol('match');
var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) {}
  }
  return false;
};
_export(
  { target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') },
  {
    includes: function includes3(searchString) {
      return !!~String(requireObjectCoercible(this)).indexOf(
        notARegexp(searchString),
        arguments.length > 1 ? arguments[1] : void 0
      );
    },
  }
);
var includes$1 = entryVirtual('String').includes;
var ArrayPrototype$4 = Array.prototype;
var StringPrototype = String.prototype;
var includes$2 = function (it) {
  var own = it.includes;
  if (
    it === ArrayPrototype$4 ||
    (it instanceof Array && own === ArrayPrototype$4.includes)
  )
    return includes2;
  if (
    typeof it === 'string' ||
    it === StringPrototype ||
    (it instanceof String && own === StringPrototype.includes)
  ) {
    return includes$1;
  }
  return own;
};
var includes$3 = includes$2;
var includes$4 = includes$3;
var entries = entryVirtual('Array').entries;
var entries$1 = entries;
var ArrayPrototype$5 = Array.prototype;
var DOMIterables$1 = {
  DOMTokenList: true,
  NodeList: true,
};
var entries_1 = function (it) {
  var own = it.entries;
  return it === ArrayPrototype$5 ||
    (it instanceof Array && own === ArrayPrototype$5.entries) ||
    DOMIterables$1.hasOwnProperty(classof(it))
    ? entries$1
    : own;
};
var entries$2 = entries_1;
var from_1$3 = from_1;
var from_1$4 = from_1$3;
var $stringify$1 = getBuiltIn('JSON', 'stringify');
var re = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;
var fix = function (match2, offset, string) {
  var prev = string.charAt(offset - 1);
  var next2 = string.charAt(offset + 1);
  if (
    (low.test(match2) && !hi.test(next2)) ||
    (hi.test(match2) && !low.test(prev))
  ) {
    return '\\u' + match2.charCodeAt(0).toString(16);
  }
  return match2;
};
var FORCED$3 = fails(function () {
  return (
    $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"' ||
    $stringify$1('\uDEAD') !== '"\\udead"'
  );
});
if ($stringify$1) {
  _export(
    { target: 'JSON', stat: true, forced: FORCED$3 },
    {
      stringify: function stringify3(it, replacer, space) {
        var result = $stringify$1.apply(null, arguments);
        return typeof result == 'string' ? result.replace(re, fix) : result;
      },
    }
  );
}
if (!path.JSON) path.JSON = { stringify: JSON.stringify };
var stringify = function stringify2(it, replacer, space) {
  return path.JSON.stringify.apply(null, arguments);
};
var stringify$1 = stringify;
var stringify$2 = stringify$1;
var $map = arrayIteration.map;
var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
var USES_TO_LENGTH$4 = arrayMethodUsesToLength('map');
_export(
  {
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4,
  },
  {
    map: function map(callbackfn) {
      return $map(
        this,
        callbackfn,
        arguments.length > 1 ? arguments[1] : void 0
      );
    },
  }
);
var map2 = entryVirtual('Array').map;
var ArrayPrototype$6 = Array.prototype;
var map_1 = function (it) {
  var own = it.map;
  return it === ArrayPrototype$6 ||
    (it instanceof Array && own === ArrayPrototype$6.map)
    ? map2
    : own;
};
var map$1 = map_1;
var map$2 = map$1;
var keys$5 = keys$1;
var keys$6 = keys$5;
var concat2 = entryVirtual('Array').concat;
var ArrayPrototype$7 = Array.prototype;
var concat_1 = function (it) {
  var own = it.concat;
  return it === ArrayPrototype$7 ||
    (it instanceof Array && own === ArrayPrototype$7.concat)
    ? concat2
    : own;
};
var concat$1 = concat_1;
var concat$2 = concat$1;
var propertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var createMethod$3 = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys4 = objectKeys(O);
    var length = keys4.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys4[i++];
      if (!descriptors || propertyIsEnumerable$1.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};
var objectToArray = {
  entries: createMethod$3(true),
  values: createMethod$3(false),
};
var $entries = objectToArray.entries;
_export(
  { target: 'Object', stat: true },
  {
    entries: function entries2(O) {
      return $entries(O);
    },
  }
);
var entries$3 = path.Object.entries;
var entries$4 = entries$3;
var entries$5 = entries$4;
var filter$3 = filter_1;
var filter$4 = filter$3;
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ||
    value == null ||
    isSymbol_1(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
}
var _isKey = isKey;
var nativeCreate = _getNative(Object, 'create');
var _nativeCreate = nativeCreate;
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}
var _hashClear = hashClear;
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete;
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var objectProto$9 = Object.prototype;
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function hashGet(key) {
  var data2 = this.__data__;
  if (_nativeCreate) {
    var result = data2[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty$8.call(data2, key) ? data2[key] : void 0;
}
var _hashGet = hashGet;
var objectProto$a = Object.prototype;
var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
function hashHas(key) {
  var data2 = this.__data__;
  return _nativeCreate
    ? data2[key] !== void 0
    : hasOwnProperty$9.call(data2, key);
}
var _hashHas = hashHas;
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
function hashSet(key, value) {
  var data2 = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data2[key] = _nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
var _hashSet = hashSet;
function Hash(entries3) {
  var index = -1,
    length = entries3 == null ? 0 : entries3.length;
  this.clear();
  while (++index < length) {
    var entry = entries3[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;
var _Hash = Hash;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear;
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data2 = this.__data__,
    index = _assocIndexOf(data2, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data2.length - 1;
  if (index == lastIndex) {
    data2.pop();
  } else {
    splice.call(data2, index, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete;
function listCacheGet(key) {
  var data2 = this.__data__,
    index = _assocIndexOf(data2, key);
  return index < 0 ? void 0 : data2[index][1];
}
var _listCacheGet = listCacheGet;
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas;
function listCacheSet(key, value) {
  var data2 = this.__data__,
    index = _assocIndexOf(data2, key);
  if (index < 0) {
    ++this.size;
    data2.push([key, value]);
  } else {
    data2[index][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet;
function ListCache(entries3) {
  var index = -1,
    length = entries3 == null ? 0 : entries3.length;
  this.clear();
  while (++index < length) {
    var entry = entries3[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;
var _ListCache = ListCache;
var Map = _getNative(_root, 'Map');
var _Map = Map;
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    hash: new _Hash(),
    map: new (_Map || _ListCache)(),
    string: new _Hash(),
  };
}
var _mapCacheClear = mapCacheClear;
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' ||
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean'
    ? value !== '__proto__'
    : value === null;
}
var _isKeyable = isKeyable;
function getMapData(map3, key) {
  var data2 = map3.__data__;
  return _isKeyable(key)
    ? data2[typeof key == 'string' ? 'string' : 'hash']
    : data2.map;
}
var _getMapData = getMapData;
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete;
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}
var _mapCacheGet = mapCacheGet;
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}
var _mapCacheHas = mapCacheHas;
function mapCacheSet(key, value) {
  var data2 = _getMapData(this, key),
    size = data2.size;
  data2.set(key, value);
  this.size += data2.size == size ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet;
function MapCache(entries3) {
  var index = -1,
    length = entries3 == null ? 0 : entries3.length;
  this.clear();
  while (++index < length) {
    var entry = entries3[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;
var _MapCache = MapCache;
var FUNC_ERROR_TEXT = 'Expected a function';
function memoize(func, resolver) {
  if (
    typeof func != 'function' ||
    (resolver != null && typeof resolver != 'function')
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function () {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache2 = memoized.cache;
    if (cache2.has(key)) {
      return cache2.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache2.set(key, result) || cache2;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache)();
  return memoized;
}
memoize.Cache = _MapCache;
var memoize_1 = memoize;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize_1(func, function (key) {
    if (cache2.size === MAX_MEMOIZE_SIZE) {
      cache2.clear();
    }
    return key;
  });
  var cache2 = result.cache;
  return result;
}
var _memoizeCapped = memoizeCapped;
var rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = _memoizeCapped(function (string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push('');
  }
  string.replace(rePropName, function (match2, number, quote, subString) {
    result.push(
      quote ? subString.replace(reEscapeChar, '$1') : number || match2
    );
  });
  return result;
});
var _stringToPath = stringToPath;
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}
var _castPath = castPath;
var INFINITY$2 = 1 / 0;
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
}
var _toKey = toKey;
function baseGet(object, path2) {
  path2 = _castPath(path2, object);
  var index = 0,
    length = path2.length;
  while (object != null && index < length) {
    object = object[_toKey(path2[index++])];
  }
  return index && index == length ? object : void 0;
}
var _baseGet = baseGet;
function baseSet(object, path2, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }
  path2 = _castPath(path2, object);
  var index = -1,
    length = path2.length,
    lastIndex = length - 1,
    nested = object;
  while (nested != null && ++index < length) {
    var key = _toKey(path2[index]),
      newValue = value;
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_1(objValue)
          ? objValue
          : _isIndex(path2[index + 1])
          ? []
          : {};
      }
    }
    _assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var _baseSet = baseSet;
function basePickBy(object, paths, predicate) {
  var index = -1,
    length = paths.length,
    result = {};
  while (++index < length) {
    var path2 = paths[index],
      value = _baseGet(object, path2);
    if (predicate(value, path2)) {
      _baseSet(result, _castPath(path2, object), value);
    }
  }
  return result;
}
var _basePickBy = basePickBy;
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var _baseHasIn = baseHasIn;
function hasPath(object, path2, hasFunc) {
  path2 = _castPath(path2, object);
  var index = -1,
    length = path2.length,
    result = false;
  while (++index < length) {
    var key = _toKey(path2[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return (
    !!length &&
    isLength_1(length) &&
    _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object))
  );
}
var _hasPath = hasPath;
function hasIn(object, path2) {
  return object != null && _hasPath(object, path2, _baseHasIn);
}
var hasIn_1 = hasIn;
function basePick(object, paths) {
  return _basePickBy(object, paths, function (value, path2) {
    return hasIn_1(object, path2);
  });
}
var _basePick = basePick;
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
var _arrayPush = arrayPush;
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return (
    isArray_1(value) ||
    isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol])
  );
}
var _isFlattenable = isFlattenable;
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
    length = array.length;
  predicate || (predicate = _isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var _baseFlatten = baseFlatten;
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}
var flatten_1 = flatten;
function flatRest(func) {
  return _setToString(_overRest(func, void 0, flatten_1), func + '');
}
var _flatRest = flatRest;
var pick = _flatRest(function (object, paths) {
  return object == null ? {} : _basePick(object, paths);
});
var pick_1 = pick;
function _arrayWithoutHoles(arr) {
  if (isArray$4(arr)) return arrayLikeToArray(arr);
}
var arrayWithoutHoles = _arrayWithoutHoles;
function _iterableToArray(iter) {
  if (typeof symbol$2 !== 'undefined' && isIterable$1(Object(iter)))
    return from_1$2(iter);
}
var iterableToArray = _iterableToArray;
function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
var nonIterableSpread = _nonIterableSpread;
function _toConsumableArray(arr) {
  return (
    arrayWithoutHoles(arr) ||
    iterableToArray(arr) ||
    unsupportedIterableToArray(arr) ||
    nonIterableSpread()
  );
}
var toConsumableArray = _toConsumableArray;
var slice$3 = slice_1;
var slice$4 = slice$3;
var _require = require('buffer'),
  Buffer = _require.Buffer;
var isRfc3986Reserved = function isRfc3986Reserved2(char) {
  return ":/?#[]@!$&'()*+,;=".indexOf(char) > -1;
};
var isRrc3986Unreserved = function isRrc3986Unreserved2(char) {
  return /^[a-z0-9\-._~]+$/i.test(char);
};
function encodeDisallowedCharacters(str) {
  var _context;
  var _ref =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    escape = _ref.escape;
  var parse = arguments.length > 2 ? arguments[2] : void 0;
  if (typeof str === 'number') {
    str = str.toString();
  }
  if (typeof str !== 'string' || !str.length) {
    return str;
  }
  if (!escape) {
    return str;
  }
  if (parse) {
    return JSON.parse(str);
  }
  return map$2((_context = toConsumableArray(str)))
    .call(_context, function (char) {
      var _context2, _context3;
      if (isRrc3986Unreserved(char)) {
        return char;
      }
      if (isRfc3986Reserved(char) && escape === 'unsafe') {
        return char;
      }
      var encoded = map$2(
        (_context2 = map$2(
          (_context3 = Buffer.from(char).toJSON().data || [])
        ).call(_context3, function (byte) {
          var _context4;
          return slice$4(
            (_context4 = '0'.concat(byte.toString(16).toUpperCase()))
          ).call(_context4, -2);
        }))
      )
        .call(_context2, function (encodedByte) {
          return '%'.concat(encodedByte);
        })
        .join('');
      return encoded;
    })
    .join('');
}
function stylize(config) {
  var value = config.value;
  if (Array.isArray(value)) {
    return encodeArray(config);
  }
  if (_typeof_1(value) === 'object') {
    return encodeObject(config);
  }
  return encodePrimitive(config);
}
function encodeArray(_ref2) {
  var key = _ref2.key,
    value = _ref2.value,
    style = _ref2.style,
    explode = _ref2.explode,
    escape = _ref2.escape;
  var valueEncoder = function valueEncoder2(str) {
    return encodeDisallowedCharacters(str, {
      escape,
    });
  };
  if (style === 'simple') {
    return map$2(value)
      .call(value, function (val) {
        return valueEncoder(val);
      })
      .join(',');
  }
  if (style === 'label') {
    return '.'.concat(
      map$2(value)
        .call(value, function (val) {
          return valueEncoder(val);
        })
        .join('.')
    );
  }
  if (style === 'matrix') {
    return map$2(value)
      .call(value, function (val) {
        return valueEncoder(val);
      })
      .reduce(function (prev, curr) {
        var _context7;
        if (!prev || explode) {
          var _context5, _context6;
          return concat$2(
            (_context5 = concat$2(
              (_context6 = ''.concat(prev || '', ';'))
            ).call(_context6, key, '='))
          ).call(_context5, curr);
        }
        return concat$2((_context7 = ''.concat(prev, ','))).call(
          _context7,
          curr
        );
      }, '');
  }
  if (style === 'form') {
    var after = explode ? '&'.concat(key, '=') : ',';
    return map$2(value)
      .call(value, function (val) {
        return valueEncoder(val);
      })
      .join(after);
  }
  if (style === 'spaceDelimited') {
    var _after = explode ? ''.concat(key, '=') : '';
    return map$2(value)
      .call(value, function (val) {
        return valueEncoder(val);
      })
      .join(' '.concat(_after));
  }
  if (style === 'pipeDelimited') {
    var _after2 = explode ? ''.concat(key, '=') : '';
    return map$2(value)
      .call(value, function (val) {
        return valueEncoder(val);
      })
      .join('|'.concat(_after2));
  }
  return void 0;
}
function encodeObject(_ref3) {
  var key = _ref3.key,
    value = _ref3.value,
    style = _ref3.style,
    explode = _ref3.explode,
    escape = _ref3.escape;
  var valueEncoder = function valueEncoder2(str) {
    return encodeDisallowedCharacters(str, {
      escape,
    });
  };
  var valueKeys = keys$6(value);
  if (style === 'simple') {
    return valueKeys.reduce(function (prev, curr) {
      var _context8, _context9, _context10;
      var val = valueEncoder(value[curr]);
      var middleChar = explode ? '=' : ',';
      var prefix = prev ? ''.concat(prev, ',') : '';
      return concat$2(
        (_context8 = concat$2(
          (_context9 = concat$2((_context10 = ''.concat(prefix))).call(
            _context10,
            curr
          ))
        ).call(_context9, middleChar))
      ).call(_context8, val);
    }, '');
  }
  if (style === 'label') {
    return valueKeys.reduce(function (prev, curr) {
      var _context11, _context12, _context13;
      var val = valueEncoder(value[curr]);
      var middleChar = explode ? '=' : '.';
      var prefix = prev ? ''.concat(prev, '.') : '.';
      return concat$2(
        (_context11 = concat$2(
          (_context12 = concat$2((_context13 = ''.concat(prefix))).call(
            _context13,
            curr
          ))
        ).call(_context12, middleChar))
      ).call(_context11, val);
    }, '');
  }
  if (style === 'matrix' && explode) {
    return valueKeys.reduce(function (prev, curr) {
      var _context14, _context15;
      var val = valueEncoder(value[curr]);
      var prefix = prev ? ''.concat(prev, ';') : ';';
      return concat$2(
        (_context14 = concat$2((_context15 = ''.concat(prefix))).call(
          _context15,
          curr,
          '='
        ))
      ).call(_context14, val);
    }, '');
  }
  if (style === 'matrix') {
    return valueKeys.reduce(function (prev, curr) {
      var _context16, _context17;
      var val = valueEncoder(value[curr]);
      var prefix = prev ? ''.concat(prev, ',') : ';'.concat(key, '=');
      return concat$2(
        (_context16 = concat$2((_context17 = ''.concat(prefix))).call(
          _context17,
          curr,
          ','
        ))
      ).call(_context16, val);
    }, '');
  }
  if (style === 'form') {
    return valueKeys.reduce(function (prev, curr) {
      var _context18, _context19, _context20, _context21;
      var val = valueEncoder(value[curr]);
      var prefix = prev
        ? concat$2((_context18 = ''.concat(prev))).call(
            _context18,
            explode ? '&' : ','
          )
        : '';
      var separator = explode ? '=' : ',';
      return concat$2(
        (_context19 = concat$2(
          (_context20 = concat$2((_context21 = ''.concat(prefix))).call(
            _context21,
            curr
          ))
        ).call(_context20, separator))
      ).call(_context19, val);
    }, '');
  }
  return void 0;
}
function encodePrimitive(_ref4) {
  var key = _ref4.key,
    value = _ref4.value,
    style = _ref4.style,
    escape = _ref4.escape;
  var valueEncoder = function valueEncoder2(str) {
    return encodeDisallowedCharacters(str, {
      escape,
    });
  };
  if (style === 'simple') {
    return valueEncoder(value);
  }
  if (style === 'label') {
    return '.'.concat(valueEncoder(value));
  }
  if (style === 'matrix') {
    var _context22;
    return concat$2((_context22 = ';'.concat(key, '='))).call(
      _context22,
      valueEncoder(value)
    );
  }
  if (style === 'form') {
    return valueEncoder(value);
  }
  if (style === 'deepObject') {
    return valueEncoder(value);
  }
  return void 0;
}
var foldFormDataToRequest = function foldFormDataToRequest2(formdata, request) {
  request.body = formdata;
};
var self$1 = {
  serializeRes,
  mergeInQueryOrForm,
};
function http(_x) {
  return _http.apply(this, arguments);
}
function _http() {
  _http = asyncToGenerator(
    /* @__PURE__ */ regenerator.mark(function _callee(url3) {
      var request,
        contentType,
        res,
        error,
        _error,
        _args = arguments;
      return regenerator.wrap(
        function _callee$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                request =
                  _args.length > 1 && _args[1] !== void 0 ? _args[1] : {};
                if (_typeof_1(url3) === 'object') {
                  request = url3;
                  url3 = request.url;
                }
                request.headers = request.headers || {};
                self$1.mergeInQueryOrForm(request);
                if (request.headers) {
                  keys$6(request.headers).forEach(function (headerName) {
                    var value = request.headers[headerName];
                    if (typeof value === 'string') {
                      request.headers[headerName] = value.replace(/\n+/g, ' ');
                    }
                  });
                }
                if (!request.requestInterceptor) {
                  _context6.next = 12;
                  break;
                }
                _context6.next = 8;
                return request.requestInterceptor(request);
              case 8:
                _context6.t0 = _context6.sent;
                if (_context6.t0) {
                  _context6.next = 11;
                  break;
                }
                _context6.t0 = request;
              case 11:
                request = _context6.t0;
              case 12:
                contentType =
                  request.headers['content-type'] ||
                  request.headers['Content-Type'];
                if (
                  /multipart\/form-data/i.test(contentType) &&
                  request.body instanceof FormData
                ) {
                  delete request.headers['content-type'];
                  delete request.headers['Content-Type'];
                }
                _context6.prev = 14;
                _context6.next = 17;
                return (request.userFetch || fetch)(request.url, request);
              case 17:
                res = _context6.sent;
                _context6.next = 20;
                return self$1.serializeRes(res, url3, request);
              case 20:
                res = _context6.sent;
                if (!request.responseInterceptor) {
                  _context6.next = 28;
                  break;
                }
                _context6.next = 24;
                return request.responseInterceptor(res);
              case 24:
                _context6.t1 = _context6.sent;
                if (_context6.t1) {
                  _context6.next = 27;
                  break;
                }
                _context6.t1 = res;
              case 27:
                res = _context6.t1;
              case 28:
                _context6.next = 39;
                break;
              case 30:
                _context6.prev = 30;
                _context6.t2 = _context6['catch'](14);
                if (res) {
                  _context6.next = 34;
                  break;
                }
                throw _context6.t2;
              case 34:
                error = new Error(
                  res.statusText || 'response status is '.concat(res.status)
                );
                error.status = res.status;
                error.statusCode = res.status;
                error.responseError = _context6.t2;
                throw error;
              case 39:
                if (res.ok) {
                  _context6.next = 45;
                  break;
                }
                _error = new Error(
                  res.statusText || 'response status is '.concat(res.status)
                );
                _error.status = res.status;
                _error.statusCode = res.status;
                _error.response = res;
                throw _error;
              case 45:
                return _context6.abrupt('return', res);
              case 46:
              case 'end':
                return _context6.stop();
            }
          }
        },
        _callee,
        null,
        [[14, 30]]
      );
    })
  );
  return _http.apply(this, arguments);
}
var shouldDownloadAsText = function shouldDownloadAsText2() {
  var contentType =
    arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
  return /(json|xml|yaml|text)\b/.test(contentType);
};
function parseBody(body, contentType) {
  if (
    contentType &&
    (contentType.indexOf('application/json') === 0 ||
      contentType.indexOf('+json') > 0)
  ) {
    return JSON.parse(body);
  }
  return jsYaml.load(body);
}
function serializeRes(oriRes, url3) {
  var _ref =
      arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    _ref$loadSpec = _ref.loadSpec,
    loadSpec = _ref$loadSpec === void 0 ? false : _ref$loadSpec;
  var res = {
    ok: oriRes.ok,
    url: oriRes.url || url3,
    status: oriRes.status,
    statusText: oriRes.statusText,
    headers: serializeHeaders(oriRes.headers),
  };
  var contentType = res.headers['content-type'];
  var useText = loadSpec || shouldDownloadAsText(contentType);
  var getBody = useText ? oriRes.text : oriRes.blob || oriRes.buffer;
  return getBody.call(oriRes).then(function (body) {
    res.text = body;
    res.data = body;
    if (useText) {
      try {
        var obj = parseBody(body, contentType);
        res.body = obj;
        res.obj = obj;
      } catch (e) {
        res.parseError = e;
      }
    }
    return res;
  });
}
function serializeHeaderValue(value) {
  var isMulti = includes$4(value).call(value, ', ');
  return isMulti ? value.split(', ') : value;
}
function serializeHeaders() {
  var headers =
    arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  if (!isFunction_1(entries$2(headers))) return {};
  return from_1$4(entries$2(headers).call(headers)).reduce(function (
    acc,
    _ref2
  ) {
    var _ref3 = slicedToArray(_ref2, 2),
      header2 = _ref3[0],
      value = _ref3[1];
    acc[header2] = serializeHeaderValue(value);
    return acc;
  },
  {});
}
function isFile(obj, navigatorObj) {
  if (!navigatorObj && typeof navigator !== 'undefined') {
    navigatorObj = navigator;
  }
  if (navigatorObj && navigatorObj.product === 'ReactNative') {
    if (obj && _typeof_1(obj) === 'object' && typeof obj.uri === 'string') {
      return true;
    }
    return false;
  }
  if (typeof File !== 'undefined' && obj instanceof File) {
    return true;
  }
  if (typeof Blob !== 'undefined' && obj instanceof Blob) {
    return true;
  }
  if (typeof Buffer$1 !== 'undefined' && obj instanceof Buffer$1) {
    return true;
  }
  return (
    obj !== null &&
    _typeof_1(obj) === 'object' &&
    typeof obj.pipe === 'function'
  );
}
function isArrayOfFile(obj, navigatorObj) {
  return (
    Array.isArray(obj) &&
    obj.some(function (v) {
      return isFile(v, navigatorObj);
    })
  );
}
var STYLE_SEPARATORS = {
  form: ',',
  spaceDelimited: '%20',
  pipeDelimited: '|',
};
var SEPARATORS = {
  csv: ',',
  ssv: '%20',
  tsv: '%09',
  pipes: '|',
};
function formatKeyValue(key, input) {
  var skipEncoding =
    arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var collectionFormat = input.collectionFormat,
    allowEmptyValue = input.allowEmptyValue,
    serializationOption = input.serializationOption,
    encoding = input.encoding;
  var value =
    _typeof_1(input) === 'object' && !Array.isArray(input)
      ? input.value
      : input;
  var encodeFn = skipEncoding
    ? function (k) {
        return k.toString();
      }
    : function (k) {
        return encodeURIComponent(k);
      };
  var encodedKey = encodeFn(key);
  if (typeof value === 'undefined' && allowEmptyValue) {
    return [[encodedKey, '']];
  }
  if (isFile(value) || isArrayOfFile(value)) {
    return [[encodedKey, value]];
  }
  if (serializationOption) {
    return formatKeyValueBySerializationOption(
      key,
      value,
      skipEncoding,
      serializationOption
    );
  }
  if (encoding) {
    if (
      [
        _typeof_1(encoding.style),
        _typeof_1(encoding.explode),
        _typeof_1(encoding.allowReserved),
      ].some(function (type) {
        return type !== 'undefined';
      })
    ) {
      return formatKeyValueBySerializationOption(
        key,
        value,
        skipEncoding,
        pick_1(encoding, ['style', 'explode', 'allowReserved'])
      );
    }
    if (encoding.contentType) {
      if (encoding.contentType === 'application/json') {
        var json = typeof value === 'string' ? value : stringify$2(value);
        return [[encodedKey, encodeFn(json)]];
      }
      return [[encodedKey, encodeFn(value.toString())]];
    }
    if (_typeof_1(value) !== 'object') {
      return [[encodedKey, encodeFn(value)]];
    }
    if (
      Array.isArray(value) &&
      value.every(function (v) {
        return _typeof_1(v) !== 'object';
      })
    ) {
      return [[encodedKey, map$2(value).call(value, encodeFn).join(',')]];
    }
    return [[encodedKey, encodeFn(stringify$2(value))]];
  }
  if (_typeof_1(value) !== 'object') {
    return [[encodedKey, encodeFn(value)]];
  }
  if (Array.isArray(value)) {
    if (collectionFormat === 'multi') {
      return [[encodedKey, map$2(value).call(value, encodeFn)]];
    }
    return [
      [
        encodedKey,
        map$2(value)
          .call(value, encodeFn)
          .join(SEPARATORS[collectionFormat || 'csv']),
      ],
    ];
  }
  return [[encodedKey, '']];
}
function formatKeyValueBySerializationOption(
  key,
  value,
  skipEncoding,
  serializationOption
) {
  var _context4;
  var style = serializationOption.style || 'form';
  var explode =
    typeof serializationOption.explode === 'undefined'
      ? style === 'form'
      : serializationOption.explode;
  var escape = skipEncoding
    ? false
    : serializationOption && serializationOption.allowReserved
    ? 'unsafe'
    : 'reserved';
  var encodeFn = function encodeFn2(v) {
    return encodeDisallowedCharacters(v, {
      escape,
    });
  };
  var encodeKeyFn = skipEncoding
    ? function (k) {
        return k;
      }
    : function (k) {
        return encodeDisallowedCharacters(k, {
          escape,
        });
      };
  if (_typeof_1(value) !== 'object') {
    return [[encodeKeyFn(key), encodeFn(value)]];
  }
  if (Array.isArray(value)) {
    if (explode) {
      return [[encodeKeyFn(key), map$2(value).call(value, encodeFn)]];
    }
    return [
      [
        encodeKeyFn(key),
        map$2(value).call(value, encodeFn).join(STYLE_SEPARATORS[style]),
      ],
    ];
  }
  if (style === 'deepObject') {
    var _context;
    return map$2((_context = keys$6(value))).call(
      _context,
      function (valueKey) {
        var _context2;
        return [
          encodeKeyFn(
            concat$2((_context2 = ''.concat(key, '['))).call(
              _context2,
              valueKey,
              ']'
            )
          ),
          encodeFn(value[valueKey]),
        ];
      }
    );
  }
  if (explode) {
    var _context3;
    return map$2((_context3 = keys$6(value))).call(
      _context3,
      function (valueKey) {
        return [encodeKeyFn(valueKey), encodeFn(value[valueKey])];
      }
    );
  }
  return [
    [
      encodeKeyFn(key),
      map$2((_context4 = keys$6(value)))
        .call(_context4, function (valueKey) {
          var _context5;
          return [
            concat$2((_context5 = ''.concat(encodeKeyFn(valueKey), ','))).call(
              _context5,
              encodeFn(value[valueKey])
            ),
          ];
        })
        .join(','),
    ],
  ];
}
function buildFormData(reqForm) {
  return entries$5(reqForm).reduce(function (formData, _ref4) {
    var _ref5 = slicedToArray(_ref4, 2),
      name = _ref5[0],
      input = _ref5[1];
    var _iterator = createForOfIteratorHelper(
        formatKeyValue(name, input, true)
      ),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var _step$value = slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];
        if (Array.isArray(value)) {
          var _iterator2 = createForOfIteratorHelper(value),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var v = _step2.value;
              formData.append(key, v);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } else {
          formData.append(key, value);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return formData;
  }, new FormData());
}
function encodeFormOrQuery(data2) {
  var encodedQuery = keys$6(data2).reduce(function (result, parameterName) {
    var _iterator3 = createForOfIteratorHelper(
        formatKeyValue(parameterName, data2[parameterName])
      ),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
        var _step3$value = slicedToArray(_step3.value, 2),
          key = _step3$value[0],
          value = _step3$value[1];
        result[key] = value;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return result;
  }, {});
  return (
    qs2.stringify(encodedQuery, {
      encode: false,
      indices: false,
    }) || ''
  );
}
function mergeInQueryOrForm() {
  var req = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var _req$url = req.url,
    url3 = _req$url === void 0 ? '' : _req$url,
    query2 = req.query,
    form = req.form;
  var joinSearch = function joinSearch2() {
    for (
      var _len = arguments.length, strs = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      strs[_key] = arguments[_key];
    }
    var search = filter$4(strs)
      .call(strs, function (a) {
        return a;
      })
      .join('&');
    return search ? '?'.concat(search) : '';
  };
  if (form) {
    var hasFile = keys$6(form).some(function (key) {
      var value = form[key].value;
      return isFile(value) || isArrayOfFile(value);
    });
    var contentType =
      req.headers['content-type'] || req.headers['Content-Type'];
    if (hasFile || /multipart\/form-data/i.test(contentType)) {
      var formdata = buildFormData(req.form);
      foldFormDataToRequest(formdata, req);
    } else {
      req.body = encodeFormOrQuery(form);
    }
    delete req.form;
  }
  if (query2) {
    var _url$split = url3.split('?'),
      _url$split2 = slicedToArray(_url$split, 2),
      baseUrl2 = _url$split2[0],
      oriSearch = _url$split2[1];
    var newStr = '';
    if (oriSearch) {
      var oriQuery = qs2.parse(oriSearch);
      var keysToRemove = keys$6(query2);
      keysToRemove.forEach(function (key) {
        return delete oriQuery[key];
      });
      newStr = qs2.stringify(oriQuery, {
        encode: true,
      });
    }
    var finalStr = joinSearch(newStr, encodeFormOrQuery(query2));
    req.url = baseUrl2 + finalStr;
    delete req.query;
  }
  return req;
}
function makeHttp(httpFn, preFetch, postFetch) {
  postFetch =
    postFetch ||
    function (a) {
      return a;
    };
  preFetch =
    preFetch ||
    function (a) {
      return a;
    };
  return function (req) {
    if (typeof req === 'string') {
      req = {
        url: req,
      };
    }
    self$1.mergeInQueryOrForm(req);
    req = preFetch(req);
    return postFetch(httpFn(req));
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var classCallCheck = _classCallCheck;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    defineProperty$1(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var createClass = _createClass;
var nativeAssign = Object.assign;
var defineProperty$7 = Object.defineProperty;
var objectAssign =
  !nativeAssign ||
  fails(function () {
    if (
      descriptors &&
      nativeAssign(
        { b: 1 },
        nativeAssign(
          defineProperty$7({}, 'a', {
            enumerable: true,
            get: function () {
              defineProperty$7(this, 'b', {
                value: 3,
                enumerable: false,
              });
            },
          }),
          { b: 2 }
        )
      ).b !== 1
    )
      return true;
    var A = {};
    var B = {};
    var symbol2 = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol2] = 7;
    alphabet.split('').forEach(function (chr) {
      B[chr] = chr;
    });
    return (
      nativeAssign({}, A)[symbol2] != 7 ||
      objectKeys(nativeAssign({}, B)).join('') != alphabet
    );
  })
    ? function assign2(target, source) {
        var T = toObject(target);
        var argumentsLength = arguments.length;
        var index = 1;
        var getOwnPropertySymbols4 = objectGetOwnPropertySymbols.f;
        var propertyIsEnumerable4 = objectPropertyIsEnumerable.f;
        while (argumentsLength > index) {
          var S = indexedObject(arguments[index++]);
          var keys4 = getOwnPropertySymbols4
            ? objectKeys(S).concat(getOwnPropertySymbols4(S))
            : objectKeys(S);
          var length = keys4.length;
          var j = 0;
          var key;
          while (length > j) {
            key = keys4[j++];
            if (!descriptors || propertyIsEnumerable4.call(S, key))
              T[key] = S[key];
          }
        }
        return T;
      }
    : nativeAssign;
_export(
  { target: 'Object', stat: true, forced: Object.assign !== objectAssign },
  {
    assign: objectAssign,
  }
);
var assign$1 = path.Object.assign;
var assign$2 = assign$1;
var assign$3 = assign$2;
var promise$4 = promise$1;
var promise$5 = promise$4;
var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH$5 = arrayMethodUsesToLength('splice', {
  ACCESSORS: true,
  0: 0,
  1: 2,
});
var max$2 = Math.max;
var min$2 = Math.min;
var MAX_SAFE_INTEGER$3 = 9007199254740991;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';
_export(
  {
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$5,
  },
  {
    splice: function splice2(start, deleteCount) {
      var O = toObject(this);
      var len = toLength(O.length);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from2, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$2(
          max$2(toInteger(deleteCount), 0),
          len - actualStart
        );
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$3) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from2 = actualStart + k;
        if (from2 in O) createProperty(A, k, O[from2]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from2 = k + actualDeleteCount;
          to = k + insertCount;
          if (from2 in O) O[to] = O[from2];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--)
          delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from2 = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from2 in O) O[to] = O[from2];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    },
  }
);
var splice$1 = entryVirtual('Array').splice;
var ArrayPrototype$8 = Array.prototype;
var splice_1 = function (it) {
  var own = it.splice;
  return it === ArrayPrototype$8 ||
    (it instanceof Array && own === ArrayPrototype$8.splice)
    ? splice$1
    : own;
};
var splice$2 = splice_1;
var splice$3 = splice$2;
function stackClear() {
  this.__data__ = new _ListCache();
  this.size = 0;
}
var _stackClear = stackClear;
function stackDelete(key) {
  var data2 = this.__data__,
    result = data2['delete'](key);
  this.size = data2.size;
  return result;
}
var _stackDelete = stackDelete;
function stackGet(key) {
  return this.__data__.get(key);
}
var _stackGet = stackGet;
function stackHas(key) {
  return this.__data__.has(key);
}
var _stackHas = stackHas;
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data2 = this.__data__;
  if (data2 instanceof _ListCache) {
    var pairs = data2.__data__;
    if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data2.size;
      return this;
    }
    data2 = this.__data__ = new _MapCache(pairs);
  }
  data2.set(key, value);
  this.size = data2.size;
  return this;
}
var _stackSet = stackSet;
function Stack(entries3) {
  var data2 = (this.__data__ = new _ListCache(entries3));
  this.size = data2.size;
}
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;
var _Stack = Stack;
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}
var _setCacheAdd = setCacheAdd;
function setCacheHas(value) {
  return this.__data__.has(value);
}
var _setCacheHas = setCacheHas;
function SetCache(values) {
  var index = -1,
    length = values == null ? 0 : values.length;
  this.__data__ = new _MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;
var _SetCache = SetCache;
function arraySome(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var _arraySome = arraySome;
function cacheHas(cache2, key) {
  return cache2.has(key);
}
var _cacheHas = cacheHas;
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    arrLength = array.length,
    othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
    result = true,
    seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index],
      othValue = other[index];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (
        !_arraySome(other, function (othValue2, othIndex) {
          if (
            !_cacheHas(seen, othIndex) &&
            (arrValue === othValue2 ||
              equalFunc(arrValue, othValue2, bitmask, customizer, stack))
          ) {
            return seen.push(othIndex);
          }
        })
      ) {
        result = false;
        break;
      }
    } else if (
      !(
        arrValue === othValue ||
        equalFunc(arrValue, othValue, bitmask, customizer, stack)
      )
    ) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}
var _equalArrays = equalArrays;
var Uint8Array = _root.Uint8Array;
var _Uint8Array = Uint8Array;
function mapToArray(map3) {
  var index = -1,
    result = Array(map3.size);
  map3.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var _mapToArray = mapToArray;
function setToArray(set2) {
  var index = -1,
    result = Array(set2.size);
  set2.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}
var _setToArray = setToArray;
var COMPARE_PARTIAL_FLAG$1 = 1,
  COMPARE_UNORDERED_FLAG$1 = 2;
var boolTag$1 = '[object Boolean]',
  dateTag$1 = '[object Date]',
  errorTag$1 = '[object Error]',
  mapTag$1 = '[object Map]',
  numberTag$1 = '[object Number]',
  regexpTag$1 = '[object RegExp]',
  setTag$1 = '[object Set]',
  stringTag$1 = '[object String]',
  symbolTag$1 = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
  dataViewTag$1 = '[object DataView]';
var symbolProto$1 = _Symbol ? _Symbol.prototype : void 0,
  symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if (
        object.byteLength != other.byteLength ||
        object.byteOffset != other.byteOffset
      ) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$1:
      if (
        object.byteLength != other.byteLength ||
        !equalFunc(new _Uint8Array(object), new _Uint8Array(other))
      ) {
        return false;
      }
      return true;
    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      return eq_1(+object, +other);
    case errorTag$1:
      return object.name == other.name && object.message == other.message;
    case regexpTag$1:
    case stringTag$1:
      return object == other + '';
    case mapTag$1:
      var convert = _mapToArray;
    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;
      stack.set(object, other);
      var result = _equalArrays(
        convert(object),
        convert(other),
        bitmask,
        customizer,
        equalFunc,
        stack
      );
      stack['delete'](object);
      return result;
    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var _equalByTag = equalByTag;
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}
var _baseGetAllKeys = baseGetAllKeys;
function arrayFilter(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length,
    resIndex = 0,
    result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var _arrayFilter = arrayFilter;
function stubArray() {
  return [];
}
var stubArray_1 = stubArray;
var objectProto$b = Object.prototype;
var propertyIsEnumerable$2 = objectProto$b.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols
  ? stubArray_1
  : function (object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(nativeGetSymbols(object), function (symbol2) {
        return propertyIsEnumerable$2.call(object, symbol2);
      });
    };
var _getSymbols = getSymbols;
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}
var _getAllKeys = getAllKeys;
var COMPARE_PARTIAL_FLAG$2 = 1;
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
    objProps = _getAllKeys(object),
    objLength = objProps.length,
    othProps = _getAllKeys(other),
    othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$a.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
      othValue = other[key];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    if (
      !(compared === void 0
        ? objValue === othValue ||
          equalFunc(objValue, othValue, bitmask, customizer, stack)
        : compared)
    ) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
      othCtor = other.constructor;
    if (
      objCtor != othCtor &&
      'constructor' in object &&
      'constructor' in other &&
      !(
        typeof objCtor == 'function' &&
        objCtor instanceof objCtor &&
        typeof othCtor == 'function' &&
        othCtor instanceof othCtor
      )
    ) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}
var _equalObjects = equalObjects;
var DataView = _getNative(_root, 'DataView');
var _DataView = DataView;
var Promise$2 = _getNative(_root, 'Promise');
var _Promise = Promise$2;
var Set = _getNative(_root, 'Set');
var _Set = Set;
var WeakMap$2 = _getNative(_root, 'WeakMap');
var _WeakMap = WeakMap$2;
var mapTag$2 = '[object Map]',
  objectTag$1 = '[object Object]',
  promiseTag = '[object Promise]',
  setTag$2 = '[object Set]',
  weakMapTag$1 = '[object WeakMap]';
var dataViewTag$2 = '[object DataView]';
var dataViewCtorString = _toSource(_DataView),
  mapCtorString = _toSource(_Map),
  promiseCtorString = _toSource(_Promise),
  setCtorString = _toSource(_Set),
  weakMapCtorString = _toSource(_WeakMap);
var getTag = _baseGetTag;
if (
  (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
  (_Map && getTag(new _Map()) != mapTag$2) ||
  (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
  (_Set && getTag(new _Set()) != setTag$2) ||
  (_WeakMap && getTag(new _WeakMap()) != weakMapTag$1)
) {
  getTag = function (value) {
    var result = _baseGetTag(value),
      Ctor = result == objectTag$1 ? value.constructor : void 0,
      ctorString = Ctor ? _toSource(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;
        case mapCtorString:
          return mapTag$2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$2;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var _getTag = getTag;
var COMPARE_PARTIAL_FLAG$3 = 1;
var argsTag$2 = '[object Arguments]',
  arrayTag$1 = '[object Array]',
  objectTag$2 = '[object Object]';
var objectProto$d = Object.prototype;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
    othIsArr = isArray_1(other),
    objTag = objIsArr ? arrayTag$1 : _getTag(object),
    othTag = othIsArr ? arrayTag$1 : _getTag(other);
  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;
  var objIsObj = objTag == objectTag$2,
    othIsObj = othTag == objectTag$2,
    isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack());
    return objIsArr || isTypedArray_1(object)
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(
          object,
          other,
          objTag,
          bitmask,
          customizer,
          equalFunc,
          stack
        );
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$b.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && hasOwnProperty$b.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new _Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack());
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
var _baseIsEqualDeep = baseIsEqualDeep;
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (
    value == null ||
    other == null ||
    (!isObjectLike_1(value) && !isObjectLike_1(other))
  ) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(
    value,
    other,
    bitmask,
    customizer,
    baseIsEqual,
    stack
  );
}
var _baseIsEqual = baseIsEqual;
var COMPARE_PARTIAL_FLAG$4 = 1,
  COMPARE_UNORDERED_FLAG$2 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
    length = index,
    noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data2 = matchData[index];
    if (
      noCustomizer && data2[2]
        ? data2[1] !== object[data2[0]]
        : !(data2[0] in object)
    ) {
      return false;
    }
  }
  while (++index < length) {
    data2 = matchData[index];
    var key = data2[0],
      objValue = object[key],
      srcValue = data2[1];
    if (noCustomizer && data2[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (
        !(result === void 0
          ? _baseIsEqual(
              srcValue,
              objValue,
              COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2,
              customizer,
              stack
            )
          : result)
      ) {
        return false;
      }
    }
  }
  return true;
}
var _baseIsMatch = baseIsMatch;
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}
var _isStrictComparable = isStrictComparable;
function getMatchData(object) {
  var result = keys_1(object),
    length = result.length;
  while (length--) {
    var key = result[length],
      value = object[key];
    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}
var _getMatchData = getMatchData;
function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return (
      object[key] === srcValue && (srcValue !== void 0 || key in Object(object))
    );
  };
}
var _matchesStrictComparable = matchesStrictComparable;
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}
var _baseMatches = baseMatches;
function get$1(object, path2, defaultValue) {
  var result = object == null ? void 0 : _baseGet(object, path2);
  return result === void 0 ? defaultValue : result;
}
var get_1 = get$1;
var COMPARE_PARTIAL_FLAG$5 = 1,
  COMPARE_UNORDERED_FLAG$3 = 2;
function baseMatchesProperty(path2, srcValue) {
  if (_isKey(path2) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path2), srcValue);
  }
  return function (object) {
    var objValue = get_1(object, path2);
    return objValue === void 0 && objValue === srcValue
      ? hasIn_1(object, path2)
      : _baseIsEqual(
          srcValue,
          objValue,
          COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3
        );
  };
}
var _baseMatchesProperty = baseMatchesProperty;
function baseProperty(key) {
  return function (object) {
    return object == null ? void 0 : object[key];
  };
}
var _baseProperty = baseProperty;
function basePropertyDeep(path2) {
  return function (object) {
    return _baseGet(object, path2);
  };
}
var _basePropertyDeep = basePropertyDeep;
function property(path2) {
  return _isKey(path2)
    ? _baseProperty(_toKey(path2))
    : _basePropertyDeep(path2);
}
var property_1 = property;
function baseIteratee(value) {
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}
var _baseIteratee = baseIteratee;
function createFind(findIndexFunc) {
  return function (collection2, predicate, fromIndex) {
    var iterable = Object(collection2);
    if (!isArrayLike_1(collection2)) {
      var iteratee = _baseIteratee(predicate);
      collection2 = keys_1(collection2);
      predicate = function (key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index = findIndexFunc(collection2, predicate, fromIndex);
    return index > -1
      ? iterable[iteratee ? collection2[index] : index]
      : void 0;
  };
}
var _createFind = createFind;
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
    index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var _baseFindIndex = baseFindIndex;
var nativeMax$1 = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
  if (index < 0) {
    index = nativeMax$1(length + index, 0);
  }
  return _baseFindIndex(array, _baseIteratee(predicate), index);
}
var findIndex_1 = findIndex;
var find = _createFind(findIndex_1);
var find_1 = find;
function noop() {}
var noop_1 = noop;
function arrayEach(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var _arrayEach = arrayEach;
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}
var _baseAssign = baseAssign;
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var _nativeKeysIn = nativeKeysIn;
var objectProto$e = Object.prototype;
var hasOwnProperty$c = objectProto$e.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
    result = [];
  for (var key in object) {
    if (
      !(
        key == 'constructor' &&
        (isProto || !hasOwnProperty$c.call(object, key))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}
var _baseKeysIn = baseKeysIn;
function keysIn(object) {
  return isArrayLike_1(object)
    ? _arrayLikeKeys(object, true)
    : _baseKeysIn(object);
}
var keysIn_1 = keysIn;
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}
var _baseAssignIn = baseAssignIn;
var _cloneBuffer = createCommonjsModule(function (module, exports) {
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? _root.Buffer : void 0,
    allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
  function cloneBuffer(buffer2, isDeep) {
    if (isDeep) {
      return buffer2.slice();
    }
    var length = buffer2.length,
      result = allocUnsafe
        ? allocUnsafe(length)
        : new buffer2.constructor(length);
    buffer2.copy(result);
    return result;
  }
  module.exports = cloneBuffer;
});
function copyArray(source, array) {
  var index = -1,
    length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var _copyArray = copyArray;
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}
var _copySymbols = copySymbols;
var getPrototype = _overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols$1
  ? stubArray_1
  : function (object) {
      var result = [];
      while (object) {
        _arrayPush(result, _getSymbols(object));
        object = _getPrototype(object);
      }
      return result;
    };
var _getSymbolsIn = getSymbolsIn;
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}
var _copySymbolsIn = copySymbolsIn;
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}
var _getAllKeysIn = getAllKeysIn;
var objectProto$f = Object.prototype;
var hasOwnProperty$d = objectProto$f.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length,
    result = new array.constructor(length);
  if (
    length &&
    typeof array[0] == 'string' &&
    hasOwnProperty$d.call(array, 'index')
  ) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var _initCloneArray = initCloneArray;
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}
var _cloneArrayBuffer = cloneArrayBuffer;
function cloneDataView(dataView, isDeep) {
  var buffer2 = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(
    buffer2,
    dataView.byteOffset,
    dataView.byteLength
  );
}
var _cloneDataView = cloneDataView;
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var _cloneRegExp = cloneRegExp;
var symbolProto$2 = _Symbol ? _Symbol.prototype : void 0,
  symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : void 0;
function cloneSymbol(symbol2) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol2)) : {};
}
var _cloneSymbol = cloneSymbol;
function cloneTypedArray(typedArray, isDeep) {
  var buffer2 = isDeep
    ? _cloneArrayBuffer(typedArray.buffer)
    : typedArray.buffer;
  return new typedArray.constructor(
    buffer2,
    typedArray.byteOffset,
    typedArray.length
  );
}
var _cloneTypedArray = cloneTypedArray;
var boolTag$2 = '[object Boolean]',
  dateTag$2 = '[object Date]',
  mapTag$3 = '[object Map]',
  numberTag$2 = '[object Number]',
  regexpTag$2 = '[object RegExp]',
  setTag$3 = '[object Set]',
  stringTag$2 = '[object String]',
  symbolTag$2 = '[object Symbol]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
  dataViewTag$3 = '[object DataView]',
  float32Tag$1 = '[object Float32Array]',
  float64Tag$1 = '[object Float64Array]',
  int8Tag$1 = '[object Int8Array]',
  int16Tag$1 = '[object Int16Array]',
  int32Tag$1 = '[object Int32Array]',
  uint8Tag$1 = '[object Uint8Array]',
  uint8ClampedTag$1 = '[object Uint8ClampedArray]',
  uint16Tag$1 = '[object Uint16Array]',
  uint32Tag$1 = '[object Uint32Array]';
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return _cloneArrayBuffer(object);
    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);
    case dataViewTag$3:
      return _cloneDataView(object, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);
    case mapTag$3:
      return new Ctor();
    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);
    case regexpTag$2:
      return _cloneRegExp(object);
    case setTag$3:
      return new Ctor();
    case symbolTag$2:
      return _cloneSymbol(object);
  }
}
var _initCloneByTag = initCloneByTag;
var objectCreate$1 = Object.create;
var baseCreate = (function () {
  function object() {}
  return function (proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate$1) {
      return objectCreate$1(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
})();
var _baseCreate = baseCreate;
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !_isPrototype(object)
    ? _baseCreate(_getPrototype(object))
    : {};
}
var _initCloneObject = initCloneObject;
var mapTag$4 = '[object Map]';
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$4;
}
var _baseIsMap = baseIsMap;
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;
var isMap_1 = isMap;
var setTag$4 = '[object Set]';
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$4;
}
var _baseIsSet = baseIsSet;
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;
var isSet_1 = isSet;
var CLONE_DEEP_FLAG = 1,
  CLONE_FLAT_FLAG = 2,
  CLONE_SYMBOLS_FLAG = 4;
var argsTag$3 = '[object Arguments]',
  arrayTag$2 = '[object Array]',
  boolTag$3 = '[object Boolean]',
  dateTag$3 = '[object Date]',
  errorTag$2 = '[object Error]',
  funcTag$2 = '[object Function]',
  genTag$1 = '[object GeneratorFunction]',
  mapTag$5 = '[object Map]',
  numberTag$3 = '[object Number]',
  objectTag$3 = '[object Object]',
  regexpTag$3 = '[object RegExp]',
  setTag$5 = '[object Set]',
  stringTag$3 = '[object String]',
  symbolTag$3 = '[object Symbol]',
  weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$3 = '[object ArrayBuffer]',
  dataViewTag$4 = '[object DataView]',
  float32Tag$2 = '[object Float32Array]',
  float64Tag$2 = '[object Float64Array]',
  int8Tag$2 = '[object Int8Array]',
  int16Tag$2 = '[object Int16Array]',
  int32Tag$2 = '[object Int32Array]',
  uint8Tag$2 = '[object Uint8Array]',
  uint8ClampedTag$2 = '[object Uint8ClampedArray]',
  uint16Tag$2 = '[object Uint16Array]',
  uint32Tag$2 = '[object Uint32Array]';
var cloneableTags = {};
cloneableTags[argsTag$3] =
  cloneableTags[arrayTag$2] =
  cloneableTags[arrayBufferTag$3] =
  cloneableTags[dataViewTag$4] =
  cloneableTags[boolTag$3] =
  cloneableTags[dateTag$3] =
  cloneableTags[float32Tag$2] =
  cloneableTags[float64Tag$2] =
  cloneableTags[int8Tag$2] =
  cloneableTags[int16Tag$2] =
  cloneableTags[int32Tag$2] =
  cloneableTags[mapTag$5] =
  cloneableTags[numberTag$3] =
  cloneableTags[objectTag$3] =
  cloneableTags[regexpTag$3] =
  cloneableTags[setTag$5] =
  cloneableTags[stringTag$3] =
  cloneableTags[symbolTag$3] =
  cloneableTags[uint8Tag$2] =
  cloneableTags[uint8ClampedTag$2] =
  cloneableTags[uint16Tag$2] =
  cloneableTags[uint32Tag$2] =
    true;
cloneableTags[errorTag$2] =
  cloneableTags[funcTag$2] =
  cloneableTags[weakMapTag$2] =
    false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
    isDeep = bitmask & CLONE_DEEP_FLAG,
    isFlat = bitmask & CLONE_FLAT_FLAG,
    isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
      isFunc = tag == funcTag$2 || tag == genTag$1;
    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$3 || (isFunc && !object)) {
      result = isFlat || isFunc ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new _Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet_1(value)) {
    value.forEach(function (subValue) {
      result.add(
        baseClone(subValue, bitmask, customizer, subValue, value, stack)
      );
    });
  } else if (isMap_1(value)) {
    value.forEach(function (subValue, key2) {
      result.set(
        key2,
        baseClone(subValue, bitmask, customizer, key2, value, stack)
      );
    });
  }
  var keysFunc = isFull
    ? isFlat
      ? _getAllKeysIn
      : _getAllKeys
    : isFlat
    ? keysIn_1
    : keys_1;
  var props = isArr ? void 0 : keysFunc(value);
  _arrayEach(props || value, function (subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    _assignValue(
      result,
      key2,
      baseClone(subValue, bitmask, customizer, key2, value, stack)
    );
  });
  return result;
}
var _baseClone = baseClone;
var CLONE_DEEP_FLAG$1 = 1,
  CLONE_SYMBOLS_FLAG$1 = 4;
function cloneDeep(value) {
  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}
var cloneDeep_1 = cloneDeep;
var lib = {
  add,
  replace,
  remove,
  merge,
  mergeDeep,
  context,
  getIn,
  applyPatch,
  parentPathMatch,
  flatten: flatten$1,
  fullyNormalizeArray,
  normalizeArray,
  isPromise,
  forEachNew,
  forEachNewPrimitive,
  isJsonPatch,
  isContextPatch,
  isPatch,
  isMutation,
  isAdditiveMutation,
  isGenerator,
  isFunction: isFunction$1,
  isObject: isObject$2,
  isError,
};
function applyPatch(obj, patch, opts) {
  opts = opts || {};
  patch = objectSpread2(
    objectSpread2({}, patch),
    {},
    {
      path: patch.path && normalizeJSONPath(patch.path),
    }
  );
  if (patch.op === 'merge') {
    var newValue = getInByJsonPath(obj, patch.path);
    assign$3(newValue, patch.value);
    applyPatch$1(obj, [replace(patch.path, newValue)]);
  } else if (patch.op === 'mergeDeep') {
    var currentValue = getInByJsonPath(obj, patch.path);
    for (var prop in patch.value) {
      var propVal = patch.value[prop];
      var isArray3 = Array.isArray(propVal);
      if (isArray3) {
        var existing = currentValue[prop] || [];
        currentValue[prop] = concat$2(existing).call(existing, propVal);
      } else if (isObject$2(propVal) && !isArray3) {
        var currentObj = objectSpread2({}, currentValue[prop]);
        for (var key in propVal) {
          if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
            currentObj = deepExtend(cloneDeep_1(currentObj), propVal);
            break;
          } else {
            assign$3(currentObj, defineProperty$5({}, key, propVal[key]));
          }
        }
        currentValue[prop] = currentObj;
      } else {
        currentValue[prop] = propVal;
      }
    }
  } else if (
    patch.op === 'add' &&
    patch.path === '' &&
    isObject$2(patch.value)
  ) {
    var patches = keys$6(patch.value).reduce(function (arr, key2) {
      arr.push({
        op: 'add',
        path: '/'.concat(normalizeJSONPath(key2)),
        value: patch.value[key2],
      });
      return arr;
    }, []);
    applyPatch$1(obj, patches);
  } else if (patch.op === 'replace' && patch.path === '') {
    var _patch = patch,
      value = _patch.value;
    if (
      opts.allowMetaPatches &&
      patch.meta &&
      isAdditiveMutation(patch) &&
      (Array.isArray(patch.value) || isObject$2(patch.value))
    ) {
      value = objectSpread2(objectSpread2({}, value), patch.meta);
    }
    obj = value;
  } else {
    applyPatch$1(obj, [patch]);
    if (
      opts.allowMetaPatches &&
      patch.meta &&
      isAdditiveMutation(patch) &&
      (Array.isArray(patch.value) || isObject$2(patch.value))
    ) {
      var _currentValue = getInByJsonPath(obj, patch.path);
      var _newValue = objectSpread2(
        objectSpread2({}, _currentValue),
        patch.meta
      );
      applyPatch$1(obj, [replace(patch.path, _newValue)]);
    }
  }
  return obj;
}
function normalizeJSONPath(path2) {
  if (Array.isArray(path2)) {
    if (path2.length < 1) {
      return '';
    }
    return '/'.concat(
      map$2(path2)
        .call(path2, function (item) {
          return (item + '').replace(/~/g, '~0').replace(/\//g, '~1');
        })
        .join('/')
    );
  }
  return path2;
}
function add(path2, value) {
  return {
    op: 'add',
    path: path2,
    value,
  };
}
function replace(path2, value, meta) {
  return {
    op: 'replace',
    path: path2,
    value,
    meta,
  };
}
function remove(path2) {
  return {
    op: 'remove',
    path: path2,
  };
}
function merge(path2, value) {
  return {
    type: 'mutation',
    op: 'merge',
    path: path2,
    value,
  };
}
function mergeDeep(path2, value) {
  return {
    type: 'mutation',
    op: 'mergeDeep',
    path: path2,
    value,
  };
}
function context(path2, value) {
  return {
    type: 'context',
    path: path2,
    value,
  };
}
function forEachNew(mutations, fn) {
  try {
    return forEachNewPatch(mutations, forEach$4, fn);
  } catch (e) {
    return e;
  }
}
function forEachNewPrimitive(mutations, fn) {
  try {
    return forEachNewPatch(mutations, forEachPrimitive, fn);
  } catch (e) {
    return e;
  }
}
function forEachNewPatch(mutations, fn, callback) {
  var _context;
  var res =
    map$2(
      (_context = filter$4(mutations).call(mutations, isAdditiveMutation))
    ).call(_context, function (mutation) {
      return fn(mutation.value, callback, mutation.path);
    }) || [];
  var flat = flatten$1(res);
  var clean = cleanArray(flat);
  return clean;
}
function forEachPrimitive(obj, fn, basePath) {
  basePath = basePath || [];
  if (Array.isArray(obj)) {
    return map$2(obj).call(obj, function (val, key) {
      return forEachPrimitive(val, fn, concat$2(basePath).call(basePath, key));
    });
  }
  if (isObject$2(obj)) {
    var _context2;
    return map$2((_context2 = keys$6(obj))).call(_context2, function (key) {
      return forEachPrimitive(
        obj[key],
        fn,
        concat$2(basePath).call(basePath, key)
      );
    });
  }
  return fn(obj, basePath[basePath.length - 1], basePath);
}
function forEach$4(obj, fn, basePath) {
  basePath = basePath || [];
  var results = [];
  if (basePath.length > 0) {
    var newResults = fn(obj, basePath[basePath.length - 1], basePath);
    if (newResults) {
      results = concat$2(results).call(results, newResults);
    }
  }
  if (Array.isArray(obj)) {
    var arrayResults = map$2(obj).call(obj, function (val, key) {
      return forEach$4(val, fn, concat$2(basePath).call(basePath, key));
    });
    if (arrayResults) {
      results = concat$2(results).call(results, arrayResults);
    }
  } else if (isObject$2(obj)) {
    var _context3;
    var moreResults = map$2((_context3 = keys$6(obj))).call(
      _context3,
      function (key) {
        return forEach$4(obj[key], fn, concat$2(basePath).call(basePath, key));
      }
    );
    if (moreResults) {
      results = concat$2(results).call(results, moreResults);
    }
  }
  results = flatten$1(results);
  return results;
}
function parentPathMatch(path2, arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  for (var i = 0, len = arr.length; i < len; i += 1) {
    if (arr[i] !== path2[i]) {
      return false;
    }
  }
  return true;
}
function getIn(obj, path2) {
  return path2.reduce(function (val, token) {
    if (typeof token !== 'undefined' && val) {
      return val[token];
    }
    return val;
  }, obj);
}
function fullyNormalizeArray(arr) {
  return cleanArray(flatten$1(normalizeArray(arr)));
}
function normalizeArray(arr) {
  return Array.isArray(arr) ? arr : [arr];
}
function flatten$1(arr) {
  var _ref;
  return concat$2((_ref = [])).apply(
    _ref,
    toConsumableArray(
      map$2(arr).call(arr, function (val) {
        return Array.isArray(val) ? flatten$1(val) : val;
      })
    )
  );
}
function cleanArray(arr) {
  return filter$4(arr).call(arr, function (elm) {
    return typeof elm !== 'undefined';
  });
}
function isObject$2(val) {
  return val && _typeof_1(val) === 'object';
}
function isPromise(val) {
  return isObject$2(val) && isFunction$1(val.then);
}
function isFunction$1(val) {
  return val && typeof val === 'function';
}
function isError(patch) {
  return patch instanceof Error;
}
function isJsonPatch(patch) {
  if (isPatch(patch)) {
    var op = patch.op;
    return op === 'add' || op === 'remove' || op === 'replace';
  }
  return false;
}
function isGenerator(thing) {
  return Object.prototype.toString.call(thing) === '[object GeneratorFunction]';
}
function isMutation(patch) {
  return isJsonPatch(patch) || (isPatch(patch) && patch.type === 'mutation');
}
function isAdditiveMutation(patch) {
  return (
    isMutation(patch) &&
    (patch.op === 'add' ||
      patch.op === 'replace' ||
      patch.op === 'merge' ||
      patch.op === 'mergeDeep')
  );
}
function isContextPatch(patch) {
  return isPatch(patch) && patch.type === 'context';
}
function isPatch(patch) {
  return patch && _typeof_1(patch) === 'object';
}
function getInByJsonPath(obj, jsonPath) {
  try {
    return getValueByPointer(obj, jsonPath);
  } catch (e) {
    console.error(e);
    return {};
  }
}
var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});
var internalMetadata = createCommonjsModule(function (module) {
  var defineProperty4 = objectDefineProperty.f;
  var METADATA = uid('meta');
  var id2 = 0;
  var isExtensible =
    Object.isExtensible ||
    function () {
      return true;
    };
  var setMetadata = function (it) {
    defineProperty4(it, METADATA, {
      value: {
        objectID: 'O' + ++id2,
        weakData: {},
      },
    });
  };
  var fastKey = function (it, create3) {
    if (!isObject(it))
      return typeof it == 'symbol'
        ? it
        : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, METADATA)) {
      if (!isExtensible(it)) return 'F';
      if (!create3) return 'E';
      setMetadata(it);
    }
    return it[METADATA].objectID;
  };
  var getWeakData2 = function (it, create3) {
    if (!has(it, METADATA)) {
      if (!isExtensible(it)) return true;
      if (!create3) return false;
      setMetadata(it);
    }
    return it[METADATA].weakData;
  };
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA))
      setMetadata(it);
    return it;
  };
  var meta = (module.exports = {
    REQUIRED: false,
    fastKey,
    getWeakData: getWeakData2,
    onFreeze,
  });
  hiddenKeys[METADATA] = true;
});
var defineProperty$8 = objectDefineProperty.f;
var forEach$5 = arrayIteration.forEach;
var setInternalState$4 = internalState.set;
var internalStateGetterFor = internalState.getterFor;
var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var exported = {};
  var Constructor;
  if (
    !descriptors ||
    typeof NativeConstructor != 'function' ||
    !(
      IS_WEAK ||
      (NativePrototype.forEach &&
        !fails(function () {
          new NativeConstructor().entries().next();
        }))
    )
  ) {
    Constructor = common.getConstructor(
      wrapper,
      CONSTRUCTOR_NAME,
      IS_MAP,
      ADDER
    );
    internalMetadata.REQUIRED = true;
  } else {
    Constructor = wrapper(function (target, iterable) {
      setInternalState$4(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
        type: CONSTRUCTOR_NAME,
        collection: new NativeConstructor(),
      });
      if (iterable != void 0)
        iterate(iterable, target[ADDER], { that: target, AS_ENTRIES: IS_MAP });
    });
    var getInternalState2 = internalStateGetterFor(CONSTRUCTOR_NAME);
    forEach$5(
      [
        'add',
        'clear',
        'delete',
        'forEach',
        'get',
        'has',
        'set',
        'keys',
        'values',
        'entries',
      ],
      function (KEY) {
        var IS_ADDER = KEY == 'add' || KEY == 'set';
        if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) {
          createNonEnumerableProperty(
            Constructor.prototype,
            KEY,
            function (a, b) {
              var collection2 = getInternalState2(this).collection;
              if (!IS_ADDER && IS_WEAK && !isObject(a))
                return KEY == 'get' ? void 0 : false;
              var result = collection2[KEY](a === 0 ? 0 : a, b);
              return IS_ADDER ? this : result;
            }
          );
        }
      }
    );
    IS_WEAK ||
      defineProperty$8(Constructor.prototype, 'size', {
        configurable: true,
        get: function () {
          return getInternalState2(this).collection.size;
        },
      });
  }
  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);
  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: true }, exported);
  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
  return Constructor;
};
var getWeakData = internalMetadata.getWeakData;
var setInternalState$5 = internalState.set;
var internalStateGetterFor$1 = internalState.getterFor;
var find$1 = arrayIteration.find;
var findIndex$1 = arrayIteration.findIndex;
var id$1 = 0;
var uncaughtFrozenStore = function (store2) {
  return store2.frozen || (store2.frozen = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.entries = [];
};
var findUncaughtFrozen = function (store2, key) {
  return find$1(store2.entries, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  delete: function (key) {
    var index = findIndex$1(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) this.entries.splice(index, 1);
    return !!~index;
  },
};
var collectionWeak = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$5(that, {
        type: CONSTRUCTOR_NAME,
        id: id$1++,
        frozen: void 0,
      });
      if (iterable != void 0)
        iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
    });
    var getInternalState2 = internalStateGetterFor$1(CONSTRUCTOR_NAME);
    var define = function (that, key, value) {
      var state = getInternalState2(that);
      var data2 = getWeakData(anObject(key), true);
      if (data2 === true) uncaughtFrozenStore(state).set(key, value);
      else data2[state.id] = value;
      return that;
    };
    redefineAll(C.prototype, {
      delete: function (key) {
        var state = getInternalState2(this);
        if (!isObject(key)) return false;
        var data2 = getWeakData(key);
        if (data2 === true) return uncaughtFrozenStore(state)['delete'](key);
        return data2 && has(data2, state.id) && delete data2[state.id];
      },
      has: function has$12(key) {
        var state = getInternalState2(this);
        if (!isObject(key)) return false;
        var data2 = getWeakData(key);
        if (data2 === true) return uncaughtFrozenStore(state).has(key);
        return data2 && has(data2, state.id);
      },
    });
    redefineAll(
      C.prototype,
      IS_MAP
        ? {
            get: function get2(key) {
              var state = getInternalState2(this);
              if (isObject(key)) {
                var data2 = getWeakData(key);
                if (data2 === true) return uncaughtFrozenStore(state).get(key);
                return data2 ? data2[state.id] : void 0;
              }
            },
            set: function set2(key, value) {
              return define(this, key, value);
            },
          }
        : {
            add: function add2(value) {
              return define(this, value, true);
            },
          }
    );
    return C;
  },
};
var es_weakMap = createCommonjsModule(function (module) {
  var enforceIternalState = internalState.enforce;
  var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
  var isExtensible = Object.isExtensible;
  var InternalWeakMap;
  var wrapper = function (init) {
    return function WeakMap2() {
      return init(this, arguments.length ? arguments[0] : void 0);
    };
  };
  var $WeakMap = (module.exports = collection(
    'WeakMap',
    wrapper,
    collectionWeak
  ));
  if (nativeWeakMap && IS_IE11) {
    InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
    internalMetadata.REQUIRED = true;
    var WeakMapPrototype = $WeakMap.prototype;
    var nativeDelete = WeakMapPrototype['delete'];
    var nativeHas = WeakMapPrototype.has;
    var nativeGet = WeakMapPrototype.get;
    var nativeSet = WeakMapPrototype.set;
    redefineAll(WeakMapPrototype, {
      delete: function (key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeDelete.call(this, key) || state.frozen['delete'](key);
        }
        return nativeDelete.call(this, key);
      },
      has: function has2(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) || state.frozen.has(key);
        }
        return nativeHas.call(this, key);
      },
      get: function get2(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key)
            ? nativeGet.call(this, key)
            : state.frozen.get(key);
        }
        return nativeGet.call(this, key);
      },
      set: function set2(key, value) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          nativeHas.call(this, key)
            ? nativeSet.call(this, key, value)
            : state.frozen.set(key, value);
        } else nativeSet.call(this, key, value);
        return this;
      },
    });
  }
});
var weakMap = path.WeakMap;
var weakMap$1 = weakMap;
var weakMap$2 = weakMap$1;
function createErrorType(name, init) {
  function E() {
    if (!Error.captureStackTrace) {
      this.stack = new Error().stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }
    this.message = args[0];
    if (init) {
      init.apply(this, args);
    }
  }
  E.prototype = new Error();
  E.prototype.name = name;
  E.prototype.constructor = E;
  return E;
}
var stringTag$4 = '[object String]';
function isString(value) {
  return (
    typeof value == 'string' ||
    (!isArray_1(value) &&
      isObjectLike_1(value) &&
      _baseGetTag(value) == stringTag$4)
  );
}
var isString_1 = isString;
var freelyNamedKeyParents = ['properties'];
var nonFreelyNamedKeyGrandparents = ['properties'];
var freelyNamedPaths = [
  'definitions',
  'parameters',
  'responses',
  'securityDefinitions',
  'components/schemas',
  'components/responses',
  'components/parameters',
  'components/securitySchemes',
];
var freelyNamedAncestors = ['schema/example', 'items/example'];
function isFreelyNamed(parentPath) {
  var parentKey = parentPath[parentPath.length - 1];
  var grandparentKey = parentPath[parentPath.length - 2];
  var parentStr = parentPath.join('/');
  return (
    (freelyNamedKeyParents.indexOf(parentKey) > -1 &&
      nonFreelyNamedKeyGrandparents.indexOf(grandparentKey) === -1) ||
    freelyNamedPaths.indexOf(parentStr) > -1 ||
    freelyNamedAncestors.some(function (el) {
      return parentStr.indexOf(el) > -1;
    })
  );
}
function generateAbsoluteRefPatches(obj, basePath) {
  var _ref =
      arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    specmap = _ref.specmap,
    _ref$getBaseUrlForNod = _ref.getBaseUrlForNodePath,
    getBaseUrlForNodePath =
      _ref$getBaseUrlForNod === void 0
        ? function (path2) {
            var _context;
            return specmap.getContext(
              concat$2((_context = [])).call(
                _context,
                toConsumableArray(basePath),
                toConsumableArray(path2)
              )
            ).baseDoc;
          }
        : _ref$getBaseUrlForNod,
    _ref$targetKeys = _ref.targetKeys,
    targetKeys =
      _ref$targetKeys === void 0 ? ['$ref', '$$ref'] : _ref$targetKeys;
  var patches = [];
  traverse2(obj).forEach(function callback() {
    if (
      includes$4(targetKeys).call(targetKeys, this.key) &&
      isString_1(this.node)
    ) {
      var nodePath = this.path;
      var fullPath = concat$2(basePath).call(basePath, this.path);
      var absolutifiedRefValue = absolutifyPointer(
        this.node,
        getBaseUrlForNodePath(nodePath)
      );
      patches.push(specmap.replace(fullPath, absolutifiedRefValue));
    }
  });
  return patches;
}
function absolutifyPointer(pointer, baseUrl2) {
  var _context2;
  var _pointer$split = pointer.split('#'),
    _pointer$split2 = slicedToArray(_pointer$split, 2),
    urlPart = _pointer$split2[0],
    fragmentPart = _pointer$split2[1];
  var newRefUrlPart = url2.resolve(urlPart || '', baseUrl2 || '');
  return fragmentPart
    ? concat$2((_context2 = ''.concat(newRefUrlPart, '#'))).call(
        _context2,
        fragmentPart
      )
    : newRefUrlPart;
}
var ACCEPT_HEADER_VALUE_FOR_DOCUMENTS = 'application/json, application/yaml';
var ABSOLUTE_URL_REGEXP = new RegExp('^([a-z]+://|//)', 'i');
var JSONRefError = createErrorType(
  'JSONRefError',
  function cb(message, extra, oriError) {
    this.originalError = oriError;
    assign$3(this, extra || {});
  }
);
var docCache = {};
var specmapRefs = new weakMap$2();
var skipResolutionTestFns = [
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'responses' &&
      path2[5] === 'examples'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'responses' &&
      path2[5] === 'content' &&
      path2[7] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'responses' &&
      path2[5] === 'content' &&
      path2[7] === 'examples' &&
      path2[9] === 'value'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'requestBody' &&
      path2[4] === 'content' &&
      path2[6] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'requestBody' &&
      path2[4] === 'content' &&
      path2[6] === 'examples' &&
      path2[8] === 'value'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[2] === 'parameters' &&
      path2[4] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'parameters' &&
      path2[5] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[2] === 'parameters' &&
      path2[4] === 'examples' &&
      path2[6] === 'value'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'parameters' &&
      path2[5] === 'examples' &&
      path2[7] === 'value'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[2] === 'parameters' &&
      path2[4] === 'content' &&
      path2[6] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[2] === 'parameters' &&
      path2[4] === 'content' &&
      path2[6] === 'examples' &&
      path2[8] === 'value'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'parameters' &&
      path2[4] === 'content' &&
      path2[7] === 'example'
    );
  },
  function (path2) {
    return (
      path2[0] === 'paths' &&
      path2[3] === 'parameters' &&
      path2[5] === 'content' &&
      path2[7] === 'examples' &&
      path2[9] === 'value'
    );
  },
];
var shouldSkipResolution = function shouldSkipResolution2(path2) {
  return skipResolutionTestFns.some(function (fn) {
    return fn(path2);
  });
};
var plugin = {
  key: '$ref',
  plugin: function plugin2(ref, key, fullPath, specmap) {
    var specmapInstance = specmap.getInstance();
    var parent = slice$4(fullPath).call(fullPath, 0, -1);
    if (isFreelyNamed(parent) || shouldSkipResolution(parent)) {
      return void 0;
    }
    var _specmap$getContext = specmap.getContext(fullPath),
      baseDoc = _specmap$getContext.baseDoc;
    if (typeof ref !== 'string') {
      return new JSONRefError('$ref: must be a string (JSON-Ref)', {
        $ref: ref,
        baseDoc,
        fullPath,
      });
    }
    var splitString = split$1(ref);
    var refPath = splitString[0];
    var pointer = splitString[1] || '';
    var basePath;
    try {
      basePath = baseDoc || refPath ? absoluteify(refPath, baseDoc) : null;
    } catch (e) {
      return wrapError(e, {
        pointer,
        $ref: ref,
        basePath,
        fullPath,
      });
    }
    var promOrVal;
    var tokens;
    if (pointerAlreadyInPath(pointer, basePath, parent, specmap)) {
      if (!specmapInstance.useCircularStructures) {
        var _absolutifiedRef = absolutifyPointer(ref, basePath);
        if (ref === _absolutifiedRef) {
          return null;
        }
        return lib.replace(fullPath, _absolutifiedRef);
      }
    }
    if (basePath == null) {
      tokens = jsonPointerToArray(pointer);
      promOrVal = specmap.get(tokens);
      if (typeof promOrVal === 'undefined') {
        promOrVal = new JSONRefError(
          'Could not resolve reference: '.concat(ref),
          {
            pointer,
            $ref: ref,
            baseDoc,
            fullPath,
          }
        );
      }
    } else {
      promOrVal = extractFromDoc(basePath, pointer);
      if (promOrVal.__value != null) {
        promOrVal = promOrVal.__value;
      } else {
        promOrVal = promOrVal.catch(function (e) {
          throw wrapError(e, {
            pointer,
            $ref: ref,
            baseDoc,
            fullPath,
          });
        });
      }
    }
    if (promOrVal instanceof Error) {
      return [lib.remove(fullPath), promOrVal];
    }
    var absolutifiedRef = absolutifyPointer(ref, basePath);
    var patch = lib.replace(parent, promOrVal, {
      $$ref: absolutifiedRef,
    });
    if (basePath && basePath !== baseDoc) {
      return [
        patch,
        lib.context(parent, {
          baseDoc: basePath,
        }),
      ];
    }
    try {
      if (
        !patchValueAlreadyInPath(specmap.state, patch) ||
        specmapInstance.useCircularStructures
      ) {
        return patch;
      }
    } catch (e) {
      return null;
    }
    return void 0;
  },
};
var mod = assign$3(plugin, {
  docCache,
  absoluteify,
  clearCache,
  JSONRefError,
  wrapError,
  getDoc,
  split: split$1,
  extractFromDoc,
  fetchJSON,
  extract,
  jsonPointerToArray,
  unescapeJsonPointerToken,
});
function absoluteify(path2, basePath) {
  if (!ABSOLUTE_URL_REGEXP.test(path2)) {
    if (!basePath) {
      var _context;
      throw new JSONRefError(
        concat$2(
          (_context =
            "Tried to resolve a relative URL, without having a basePath. path: '".concat(
              path2,
              "' basePath: '"
            ))
        ).call(_context, basePath, "'")
      );
    }
    return url2.resolve(basePath, path2);
  }
  return path2;
}
function wrapError(e, extra) {
  var message;
  if (e && e.response && e.response.body) {
    var _context2;
    message = concat$2((_context2 = ''.concat(e.response.body.code, ' '))).call(
      _context2,
      e.response.body.message
    );
  } else {
    message = e.message;
  }
  return new JSONRefError(
    'Could not resolve reference: '.concat(message),
    extra,
    e
  );
}
function split$1(ref) {
  return (ref + '').split('#');
}
function extractFromDoc(docPath, pointer) {
  var doc = docCache[docPath];
  if (doc && !lib.isPromise(doc)) {
    try {
      var v = extract(pointer, doc);
      return assign$3(promise$5.resolve(v), {
        __value: v,
      });
    } catch (e) {
      return promise$5.reject(e);
    }
  }
  return getDoc(docPath).then(function (_doc) {
    return extract(pointer, _doc);
  });
}
function clearCache(item) {
  if (typeof item !== 'undefined') {
    delete docCache[item];
  } else {
    keys$6(docCache).forEach(function (key) {
      delete docCache[key];
    });
  }
}
function getDoc(docPath) {
  var val = docCache[docPath];
  if (val) {
    return lib.isPromise(val) ? val : promise$5.resolve(val);
  }
  docCache[docPath] = mod.fetchJSON(docPath).then(function (doc) {
    docCache[docPath] = doc;
    return doc;
  });
  return docCache[docPath];
}
function fetchJSON(docPath) {
  return fetch(docPath, {
    headers: {
      Accept: ACCEPT_HEADER_VALUE_FOR_DOCUMENTS,
    },
    loadSpec: true,
  })
    .then(function (res) {
      return res.text();
    })
    .then(function (text) {
      return jsYaml.load(text);
    });
}
function extract(pointer, obj) {
  var tokens = jsonPointerToArray(pointer);
  if (tokens.length < 1) {
    return obj;
  }
  var val = lib.getIn(obj, tokens);
  if (typeof val === 'undefined') {
    throw new JSONRefError(
      'Could not resolve pointer: '.concat(
        pointer,
        ' does not exist in document'
      ),
      {
        pointer,
      }
    );
  }
  return val;
}
function jsonPointerToArray(pointer) {
  var _context3;
  if (typeof pointer !== 'string') {
    throw new TypeError('Expected a string, got a '.concat(_typeof_1(pointer)));
  }
  if (pointer[0] === '/') {
    pointer = pointer.substr(1);
  }
  if (pointer === '') {
    return [];
  }
  return map$2((_context3 = pointer.split('/'))).call(
    _context3,
    unescapeJsonPointerToken
  );
}
function unescapeJsonPointerToken(token) {
  if (typeof token !== 'string') {
    return token;
  }
  return qs$1.unescape(token.replace(/~1/g, '/').replace(/~0/g, '~'));
}
function escapeJsonPointerToken(token) {
  return qs$1.escape(token.replace(/~/g, '~0').replace(/\//g, '~1'));
}
function arrayToJsonPointer(arr) {
  if (arr.length === 0) {
    return '';
  }
  return '/'.concat(map$2(arr).call(arr, escapeJsonPointerToken).join('/'));
}
var pointerBoundaryChar = function pointerBoundaryChar2(c) {
  return !c || c === '/' || c === '#';
};
function pointerIsAParent(pointer, parentPointer) {
  if (pointerBoundaryChar(parentPointer)) {
    return true;
  }
  var nextChar = pointer.charAt(parentPointer.length);
  var lastParentChar = slice$4(parentPointer).call(parentPointer, -1);
  return (
    pointer.indexOf(parentPointer) === 0 &&
    (!nextChar || nextChar === '/' || nextChar === '#') &&
    lastParentChar !== '#'
  );
}
function pointerAlreadyInPath(pointer, basePath, parent, specmap) {
  var _context4, _context6;
  var refs = specmapRefs.get(specmap);
  if (!refs) {
    refs = {};
    specmapRefs.set(specmap, refs);
  }
  var parentPointer = arrayToJsonPointer(parent);
  var fullyQualifiedPointer = concat$2(
    (_context4 = ''.concat(basePath || '<specmap-base>', '#'))
  ).call(_context4, pointer);
  var safeParentPointer = parentPointer.replace(/allOf\/\d+\/?/g, '');
  var rootDoc = specmap.contextTree.get([]).baseDoc;
  if (basePath === rootDoc && pointerIsAParent(safeParentPointer, pointer)) {
    return true;
  }
  var currPath = '';
  var hasIndirectCycle = parent.some(function (token) {
    var _context5;
    currPath = concat$2((_context5 = ''.concat(currPath, '/'))).call(
      _context5,
      escapeJsonPointerToken(token)
    );
    return (
      refs[currPath] &&
      refs[currPath].some(function (ref) {
        return (
          pointerIsAParent(ref, fullyQualifiedPointer) ||
          pointerIsAParent(fullyQualifiedPointer, ref)
        );
      })
    );
  });
  if (hasIndirectCycle) {
    return true;
  }
  refs[safeParentPointer] = concat$2(
    (_context6 = refs[safeParentPointer] || [])
  ).call(_context6, fullyQualifiedPointer);
  return void 0;
}
function patchValueAlreadyInPath(root2, patch) {
  var ancestors = [root2];
  patch.path.reduce(function (parent, p) {
    ancestors.push(parent[p]);
    return parent[p];
  }, root2);
  return pointToAncestor(patch.value);
  function pointToAncestor(obj) {
    return (
      lib.isObject(obj) &&
      (ancestors.indexOf(obj) >= 0 ||
        keys$6(obj).some(function (k) {
          return pointToAncestor(obj[k]);
        }))
    );
  }
}
var mapTag$6 = '[object Map]',
  setTag$6 = '[object Set]';
var objectProto$g = Object.prototype;
var hasOwnProperty$e = objectProto$g.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (
    isArrayLike_1(value) &&
    (isArray_1(value) ||
      typeof value == 'string' ||
      typeof value.splice == 'function' ||
      isBuffer_1(value) ||
      isTypedArray_1(value) ||
      isArguments_1(value))
  ) {
    return !value.length;
  }
  var tag = _getTag(value);
  if (tag == mapTag$6 || tag == setTag$6) {
    return !value.size;
  }
  if (_isPrototype(value)) {
    return !_baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$e.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_1 = isEmpty;
var allOf = {
  key: 'allOf',
  plugin: function plugin3(val, key, fullPath, specmap, patch) {
    if (patch.meta && patch.meta.$$ref) {
      return void 0;
    }
    var parent = slice$4(fullPath).call(fullPath, 0, -1);
    if (isFreelyNamed(parent)) {
      return void 0;
    }
    if (!Array.isArray(val)) {
      var err = new TypeError('allOf must be an array');
      err.fullPath = fullPath;
      return err;
    }
    var alreadyAddError = false;
    var originalDefinitionObj = patch.value;
    parent.forEach(function (part) {
      if (!originalDefinitionObj) return;
      originalDefinitionObj = originalDefinitionObj[part];
    });
    originalDefinitionObj = objectSpread2({}, originalDefinitionObj);
    if (isEmpty_1(originalDefinitionObj)) {
      return void 0;
    }
    delete originalDefinitionObj.allOf;
    var patches = [];
    patches.push(specmap.replace(parent, {}));
    val.forEach(function (toMerge, i) {
      if (!specmap.isObject(toMerge)) {
        if (alreadyAddError) {
          return null;
        }
        alreadyAddError = true;
        var _err = new TypeError('Elements in allOf must be objects');
        _err.fullPath = fullPath;
        return patches.push(_err);
      }
      patches.push(specmap.mergeDeep(parent, toMerge));
      var collapsedFullPath = slice$4(fullPath).call(fullPath, 0, -1);
      var absoluteRefPatches = generateAbsoluteRefPatches(
        toMerge,
        collapsedFullPath,
        {
          getBaseUrlForNodePath: function getBaseUrlForNodePath(nodePath) {
            var _context;
            return specmap.getContext(
              concat$2((_context = [])).call(
                _context,
                toConsumableArray(fullPath),
                [i],
                toConsumableArray(nodePath)
              )
            ).baseDoc;
          },
          specmap,
        }
      );
      patches.push.apply(patches, toConsumableArray(absoluteRefPatches));
      return void 0;
    });
    patches.push(specmap.mergeDeep(parent, originalDefinitionObj));
    if (!originalDefinitionObj.$$ref) {
      var _context2;
      patches.push(
        specmap.remove(
          concat$2((_context2 = [])).call(_context2, parent, '$$ref')
        )
      );
    }
    return patches;
  },
};
var parameters = {
  key: 'parameters',
  plugin: function plugin4(parameters2, key, fullPath, specmap) {
    if (Array.isArray(parameters2) && parameters2.length) {
      var val = assign$3([], parameters2);
      var opPath = slice$4(fullPath).call(fullPath, 0, -1);
      var op = objectSpread2({}, lib.getIn(specmap.spec, opPath));
      parameters2.forEach(function (param, i) {
        try {
          val[i].default = specmap.parameterMacro(op, param);
        } catch (e) {
          var err = new Error(e);
          err.fullPath = fullPath;
          return err;
        }
        return void 0;
      });
      return lib.replace(fullPath, val);
    }
    return lib.replace(fullPath, parameters2);
  },
};
var properties = {
  key: 'properties',
  plugin: function plugin5(properties2, key, fullPath, specmap) {
    var val = objectSpread2({}, properties2);
    for (var k in properties2) {
      try {
        val[k].default = specmap.modelPropertyMacro(val[k]);
      } catch (e) {
        var err = new Error(e);
        err.fullPath = fullPath;
        return err;
      }
    }
    var patch = lib.replace(fullPath, val);
    return patch;
  },
};
var ContextTree = /* @__PURE__ */ (function () {
  function ContextTree2(value) {
    classCallCheck(this, ContextTree2);
    this.root = createNode(value || {});
  }
  createClass(ContextTree2, [
    {
      key: 'set',
      value: function set2(path2, value) {
        var parent = this.getParent(path2, true);
        if (!parent) {
          updateNode(this.root, value, null);
          return;
        }
        var key = path2[path2.length - 1];
        var children = parent.children;
        if (children[key]) {
          updateNode(children[key], value, parent);
          return;
        }
        children[key] = createNode(value, parent);
      },
    },
    {
      key: 'get',
      value: function get2(path2) {
        path2 = path2 || [];
        if (path2.length < 1) {
          return this.root.value;
        }
        var branch = this.root;
        var child;
        var token;
        for (var i = 0; i < path2.length; i += 1) {
          token = path2[i];
          child = branch.children;
          if (!child[token]) {
            break;
          }
          branch = child[token];
        }
        return branch && branch.protoValue;
      },
    },
    {
      key: 'getParent',
      value: function getParent(path2, ensureExists) {
        if (!path2 || path2.length < 1) {
          return null;
        }
        if (path2.length < 2) {
          return this.root;
        }
        return slice$4(path2)
          .call(path2, 0, -1)
          .reduce(function (branch, token) {
            if (!branch) {
              return branch;
            }
            var children = branch.children;
            if (!children[token] && ensureExists) {
              children[token] = createNode(null, branch);
            }
            return children[token];
          }, this.root);
      },
    },
  ]);
  return ContextTree2;
})();
function createNode(value, parent) {
  return updateNode(
    {
      children: {},
    },
    value,
    parent
  );
}
function updateNode(node2, value, parent) {
  node2.value = value || {};
  node2.protoValue = parent
    ? objectSpread2(objectSpread2({}, parent.protoValue), node2.value)
    : node2.value;
  keys$6(node2.children).forEach(function (prop) {
    var child = node2.children[prop];
    node2.children[prop] = updateNode(child, child.value, node2);
  });
  return node2;
}
var HARD_LIMIT = 100;
var SpecMap = /* @__PURE__ */ (function () {
  function SpecMap2(opts) {
    var _this = this,
      _context,
      _context2;
    classCallCheck(this, SpecMap2);
    assign$3(
      this,
      {
        spec: '',
        debugLevel: 'info',
        plugins: [],
        pluginHistory: {},
        errors: [],
        mutations: [],
        promisedPatches: [],
        state: {},
        patches: [],
        context: {},
        contextTree: new ContextTree(),
        showDebug: false,
        allPatches: [],
        pluginProp: 'specMap',
        libMethods: assign$3(Object.create(this), lib, {
          getInstance: function getInstance() {
            return _this;
          },
        }),
        allowMetaPatches: false,
      },
      opts
    );
    this.get = this._get.bind(this);
    this.getContext = this._getContext.bind(this);
    this.hasRun = this._hasRun.bind(this);
    this.wrappedPlugins = filter$4(
      (_context = map$2((_context2 = this.plugins)).call(
        _context2,
        this.wrapPlugin.bind(this)
      ))
    ).call(_context, lib.isFunction);
    this.patches.push(lib.add([], this.spec));
    this.patches.push(lib.context([], this.context));
    this.updatePatches(this.patches);
  }
  createClass(
    SpecMap2,
    [
      {
        key: 'debug',
        value: function debug(level) {
          if (this.debugLevel === level) {
            var _console;
            for (
              var _len = arguments.length,
                args = new Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              args[_key - 1] = arguments[_key];
            }
            (_console = console).log.apply(_console, args);
          }
        },
      },
      {
        key: 'verbose',
        value: function verbose(header2) {
          if (this.debugLevel === 'verbose') {
            var _console2, _context3;
            for (
              var _len2 = arguments.length,
                args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                _key2 = 1;
              _key2 < _len2;
              _key2++
            ) {
              args[_key2 - 1] = arguments[_key2];
            }
            (_console2 = console).log.apply(
              _console2,
              concat$2((_context3 = ['['.concat(header2, ']   ')])).call(
                _context3,
                args
              )
            );
          }
        },
      },
      {
        key: 'wrapPlugin',
        value: function wrapPlugin(plugin6, name) {
          var pathDiscriminator = this.pathDiscriminator;
          var ctx = null;
          var fn;
          if (plugin6[this.pluginProp]) {
            ctx = plugin6;
            fn = plugin6[this.pluginProp];
          } else if (lib.isFunction(plugin6)) {
            fn = plugin6;
          } else if (lib.isObject(plugin6)) {
            fn = createKeyBasedPlugin(plugin6);
          }
          return assign$3(fn.bind(ctx), {
            pluginName: plugin6.name || name,
            isGenerator: lib.isGenerator(fn),
          });
          function createKeyBasedPlugin(pluginObj) {
            var isSubPath = function isSubPath2(path2, tested) {
              if (!Array.isArray(path2)) {
                return true;
              }
              return path2.every(function (val, i) {
                return val === tested[i];
              });
            };
            return /* @__PURE__ */ regenerator.mark(function generator(
              patches,
              specmap
            ) {
              var _marked, refCache, _iterator, _step, patch, traverse3;
              return regenerator.wrap(
                function generator$(_context5) {
                  while (1) {
                    switch ((_context5.prev = _context5.next)) {
                      case 0:
                        traverse3 = function _traverse(obj, path2, patch2) {
                          var parentIndex,
                            parent,
                            indexOfFirstProperties,
                            isRootProperties,
                            traversed,
                            _i,
                            _Object$keys,
                            key,
                            val,
                            updatedPath,
                            isObj,
                            objRef,
                            isWithinPathDiscriminator;
                          return regenerator.wrap(function traverse$(
                            _context4
                          ) {
                            while (1) {
                              switch ((_context4.prev = _context4.next)) {
                                case 0:
                                  if (lib.isObject(obj)) {
                                    _context4.next = 6;
                                    break;
                                  }
                                  if (
                                    !(pluginObj.key === path2[path2.length - 1])
                                  ) {
                                    _context4.next = 4;
                                    break;
                                  }
                                  _context4.next = 4;
                                  return pluginObj.plugin(
                                    obj,
                                    pluginObj.key,
                                    path2,
                                    specmap
                                  );
                                case 4:
                                  _context4.next = 30;
                                  break;
                                case 6:
                                  parentIndex = path2.length - 1;
                                  parent = path2[parentIndex];
                                  indexOfFirstProperties =
                                    path2.indexOf('properties');
                                  isRootProperties =
                                    parent === 'properties' &&
                                    parentIndex === indexOfFirstProperties;
                                  traversed =
                                    specmap.allowMetaPatches &&
                                    refCache[obj.$$ref];
                                  (_i = 0), (_Object$keys = keys$6(obj));
                                case 12:
                                  if (!(_i < _Object$keys.length)) {
                                    _context4.next = 30;
                                    break;
                                  }
                                  key = _Object$keys[_i];
                                  val = obj[key];
                                  updatedPath = concat$2(path2).call(
                                    path2,
                                    key
                                  );
                                  isObj = lib.isObject(val);
                                  objRef = obj.$$ref;
                                  if (traversed) {
                                    _context4.next = 22;
                                    break;
                                  }
                                  if (!isObj) {
                                    _context4.next = 22;
                                    break;
                                  }
                                  if (specmap.allowMetaPatches && objRef) {
                                    refCache[objRef] = true;
                                  }
                                  return _context4.delegateYield(
                                    traverse3(val, updatedPath, patch2),
                                    't0',
                                    22
                                  );
                                case 22:
                                  if (
                                    !(
                                      !isRootProperties && key === pluginObj.key
                                    )
                                  ) {
                                    _context4.next = 27;
                                    break;
                                  }
                                  isWithinPathDiscriminator = isSubPath(
                                    pathDiscriminator,
                                    path2
                                  );
                                  if (
                                    !(
                                      !pathDiscriminator ||
                                      isWithinPathDiscriminator
                                    )
                                  ) {
                                    _context4.next = 27;
                                    break;
                                  }
                                  _context4.next = 27;
                                  return pluginObj.plugin(
                                    val,
                                    key,
                                    updatedPath,
                                    specmap,
                                    patch2
                                  );
                                case 27:
                                  _i++;
                                  _context4.next = 12;
                                  break;
                                case 30:
                                case 'end':
                                  return _context4.stop();
                              }
                            }
                          },
                          _marked);
                        };
                        _marked = /* @__PURE__ */ regenerator.mark(traverse3);
                        refCache = {};
                        _iterator = createForOfIteratorHelper(
                          filter$4(patches).call(
                            patches,
                            lib.isAdditiveMutation
                          )
                        );
                        _context5.prev = 4;
                        _iterator.s();
                      case 6:
                        if ((_step = _iterator.n()).done) {
                          _context5.next = 11;
                          break;
                        }
                        patch = _step.value;
                        return _context5.delegateYield(
                          traverse3(patch.value, patch.path, patch),
                          't0',
                          9
                        );
                      case 9:
                        _context5.next = 6;
                        break;
                      case 11:
                        _context5.next = 16;
                        break;
                      case 13:
                        _context5.prev = 13;
                        _context5.t1 = _context5['catch'](4);
                        _iterator.e(_context5.t1);
                      case 16:
                        _context5.prev = 16;
                        _iterator.f();
                        return _context5.finish(16);
                      case 19:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                },
                generator,
                null,
                [[4, 13, 16, 19]]
              );
            });
          }
        },
      },
      {
        key: 'nextPlugin',
        value: function nextPlugin() {
          var _this2 = this;
          return find_1(this.wrappedPlugins, function (plugin6) {
            var mutations = _this2.getMutationsForPlugin(plugin6);
            return mutations.length > 0;
          });
        },
      },
      {
        key: 'nextPromisedPatch',
        value: function nextPromisedPatch() {
          if (this.promisedPatches.length > 0) {
            var _context6;
            return promise$5.race(
              map$2((_context6 = this.promisedPatches)).call(
                _context6,
                function (patch) {
                  return patch.value;
                }
              )
            );
          }
          return void 0;
        },
      },
      {
        key: 'getPluginHistory',
        value: function getPluginHistory(plugin6) {
          var name = this.constructor.getPluginName(plugin6);
          return this.pluginHistory[name] || [];
        },
      },
      {
        key: 'getPluginRunCount',
        value: function getPluginRunCount(plugin6) {
          return this.getPluginHistory(plugin6).length;
        },
      },
      {
        key: 'getPluginHistoryTip',
        value: function getPluginHistoryTip(plugin6) {
          var history = this.getPluginHistory(plugin6);
          var val = history && history[history.length - 1];
          return val || {};
        },
      },
      {
        key: 'getPluginMutationIndex',
        value: function getPluginMutationIndex(plugin6) {
          var mi = this.getPluginHistoryTip(plugin6).mutationIndex;
          return typeof mi !== 'number' ? -1 : mi;
        },
      },
      {
        key: 'updatePluginHistory',
        value: function updatePluginHistory(plugin6, val) {
          var name = this.constructor.getPluginName(plugin6);
          this.pluginHistory[name] = this.pluginHistory[name] || [];
          this.pluginHistory[name].push(val);
        },
      },
      {
        key: 'updatePatches',
        value: function updatePatches(patches) {
          var _this3 = this;
          lib.normalizeArray(patches).forEach(function (patch) {
            if (patch instanceof Error) {
              _this3.errors.push(patch);
              return;
            }
            try {
              if (!lib.isObject(patch)) {
                _this3.debug('updatePatches', 'Got a non-object patch', patch);
                return;
              }
              if (_this3.showDebug) {
                _this3.allPatches.push(patch);
              }
              if (lib.isPromise(patch.value)) {
                _this3.promisedPatches.push(patch);
                _this3.promisedPatchThen(patch);
                return;
              }
              if (lib.isContextPatch(patch)) {
                _this3.setContext(patch.path, patch.value);
                return;
              }
              if (lib.isMutation(patch)) {
                _this3.updateMutations(patch);
                return;
              }
            } catch (e) {
              console.error(e);
              _this3.errors.push(e);
            }
          });
        },
      },
      {
        key: 'updateMutations',
        value: function updateMutations(patch) {
          if (
            _typeof_1(patch.value) === 'object' &&
            !Array.isArray(patch.value) &&
            this.allowMetaPatches
          ) {
            patch.value = objectSpread2({}, patch.value);
          }
          var result = lib.applyPatch(this.state, patch, {
            allowMetaPatches: this.allowMetaPatches,
          });
          if (result) {
            this.mutations.push(patch);
            this.state = result;
          }
        },
      },
      {
        key: 'removePromisedPatch',
        value: function removePromisedPatch(patch) {
          var _context7;
          var index = this.promisedPatches.indexOf(patch);
          if (index < 0) {
            this.debug("Tried to remove a promisedPatch that isn't there!");
            return;
          }
          splice$3((_context7 = this.promisedPatches)).call(
            _context7,
            index,
            1
          );
        },
      },
      {
        key: 'promisedPatchThen',
        value: function promisedPatchThen(patch) {
          var _this4 = this;
          patch.value = patch.value
            .then(function (val) {
              var promisedPatch = objectSpread2(
                objectSpread2({}, patch),
                {},
                {
                  value: val,
                }
              );
              _this4.removePromisedPatch(patch);
              _this4.updatePatches(promisedPatch);
            })
            .catch(function (e) {
              _this4.removePromisedPatch(patch);
              _this4.updatePatches(e);
            });
          return patch.value;
        },
      },
      {
        key: 'getMutations',
        value: function getMutations(from2, to) {
          var _context8;
          from2 = from2 || 0;
          if (typeof to !== 'number') {
            to = this.mutations.length;
          }
          return slice$4((_context8 = this.mutations)).call(
            _context8,
            from2,
            to
          );
        },
      },
      {
        key: 'getCurrentMutations',
        value: function getCurrentMutations() {
          return this.getMutationsForPlugin(this.getCurrentPlugin());
        },
      },
      {
        key: 'getMutationsForPlugin',
        value: function getMutationsForPlugin(plugin6) {
          var tip = this.getPluginMutationIndex(plugin6);
          return this.getMutations(tip + 1);
        },
      },
      {
        key: 'getCurrentPlugin',
        value: function getCurrentPlugin() {
          return this.currentPlugin;
        },
      },
      {
        key: 'getLib',
        value: function getLib() {
          return this.libMethods;
        },
      },
      {
        key: '_get',
        value: function _get(path2) {
          return lib.getIn(this.state, path2);
        },
      },
      {
        key: '_getContext',
        value: function _getContext(path2) {
          return this.contextTree.get(path2);
        },
      },
      {
        key: 'setContext',
        value: function setContext(path2, value) {
          return this.contextTree.set(path2, value);
        },
      },
      {
        key: '_hasRun',
        value: function _hasRun(count) {
          var times = this.getPluginRunCount(this.getCurrentPlugin());
          return times > (count || 0);
        },
      },
      {
        key: 'dispatch',
        value: function dispatch() {
          var _this5 = this;
          var that = this;
          var plugin6 = this.nextPlugin();
          if (!plugin6) {
            var nextPromise = this.nextPromisedPatch();
            if (nextPromise) {
              return nextPromise
                .then(function () {
                  return _this5.dispatch();
                })
                .catch(function () {
                  return _this5.dispatch();
                });
            }
            var result = {
              spec: this.state,
              errors: this.errors,
            };
            if (this.showDebug) {
              result.patches = this.allPatches;
            }
            return promise$5.resolve(result);
          }
          that.pluginCount = that.pluginCount || {};
          that.pluginCount[plugin6] = (that.pluginCount[plugin6] || 0) + 1;
          if (that.pluginCount[plugin6] > HARD_LIMIT) {
            var _context9;
            return promise$5.resolve({
              spec: that.state,
              errors: concat$2((_context9 = that.errors)).call(
                _context9,
                new Error(
                  "We've reached a hard limit of ".concat(
                    HARD_LIMIT,
                    ' plugin runs'
                  )
                )
              ),
            });
          }
          if (plugin6 !== this.currentPlugin && this.promisedPatches.length) {
            var _context10;
            var promises = map$2((_context10 = this.promisedPatches)).call(
              _context10,
              function (p) {
                return p.value;
              }
            );
            return promise$5
              .all(
                map$2(promises).call(promises, function (promise2) {
                  return promise2.then(noop_1, noop_1);
                })
              )
              .then(function () {
                return _this5.dispatch();
              });
          }
          return executePlugin();
          function executePlugin() {
            that.currentPlugin = plugin6;
            var mutations = that.getCurrentMutations();
            var lastMutationIndex = that.mutations.length - 1;
            try {
              if (plugin6.isGenerator) {
                var _iterator2 = createForOfIteratorHelper(
                    plugin6(mutations, that.getLib())
                  ),
                  _step2;
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                    var yieldedPatches = _step2.value;
                    updatePatches(yieldedPatches);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              } else {
                var newPatches = plugin6(mutations, that.getLib());
                updatePatches(newPatches);
              }
            } catch (e) {
              console.error(e);
              updatePatches([
                assign$3(Object.create(e), {
                  plugin: plugin6,
                }),
              ]);
            } finally {
              that.updatePluginHistory(plugin6, {
                mutationIndex: lastMutationIndex,
              });
            }
            return that.dispatch();
          }
          function updatePatches(patches) {
            if (patches) {
              patches = lib.fullyNormalizeArray(patches);
              that.updatePatches(patches, plugin6);
            }
          }
        },
      },
    ],
    [
      {
        key: 'getPluginName',
        value: function getPluginName(plugin6) {
          return plugin6.pluginName;
        },
      },
      {
        key: 'getPatchesOfType',
        value: function getPatchesOfType(patches, fn) {
          return filter$4(patches).call(patches, fn);
        },
      },
    ]
  );
  return SpecMap2;
})();
function mapSpec(opts) {
  return new SpecMap(opts).dispatch();
}
var plugins = {
  refs: mod,
  allOf,
  parameters,
  properties,
};
var toLower = function toLower2(str) {
  return String.prototype.toLowerCase.call(str);
};
var escapeString = function escapeString2(str) {
  return str.replace(/[^\w]/gi, '_');
};
function isOAS3(spec) {
  var oasVersion = spec.openapi;
  if (!oasVersion) {
    return false;
  }
  return startsWith_1(oasVersion, '3');
}
function opId(operation, pathName) {
  var method =
    arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
  var _ref =
      arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {},
    v2OperationIdCompatibilityMode = _ref.v2OperationIdCompatibilityMode;
  if (!operation || _typeof_1(operation) !== 'object') {
    return null;
  }
  var idWithoutWhitespace = (operation.operationId || '').replace(/\s/g, '');
  if (idWithoutWhitespace.length) {
    return escapeString(operation.operationId);
  }
  return idFromPathMethod(pathName, method, {
    v2OperationIdCompatibilityMode,
  });
}
function idFromPathMethod(pathName, method) {
  var _context3;
  var _ref2 =
      arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    v2OperationIdCompatibilityMode = _ref2.v2OperationIdCompatibilityMode;
  if (v2OperationIdCompatibilityMode) {
    var _context, _context2;
    var res = concat$2((_context = ''.concat(method.toLowerCase(), '_')))
      .call(_context, pathName)
      .replace(/[\s!@#$%^&*()_+=[{\]};:<>|./?,\\'""-]/g, '_');
    res =
      res ||
      concat$2((_context2 = ''.concat(pathName.substring(1), '_'))).call(
        _context2,
        method
      );
    return res
      .replace(/((_){2,})/g, '_')
      .replace(/^(_)*/g, '')
      .replace(/([_])*$/g, '');
  }
  return concat$2((_context3 = ''.concat(toLower(method)))).call(
    _context3,
    escapeString(pathName)
  );
}
function legacyIdFromPathMethod(pathName, method) {
  var _context4;
  return concat$2((_context4 = ''.concat(toLower(method), '-'))).call(
    _context4,
    pathName
  );
}
function getOperationRaw(spec, id2) {
  if (!spec || !spec.paths) {
    return null;
  }
  return findOperation(spec, function (_ref3) {
    var pathName = _ref3.pathName,
      method = _ref3.method,
      operation = _ref3.operation;
    if (!operation || _typeof_1(operation) !== 'object') {
      return false;
    }
    var rawOperationId = operation.operationId;
    var operationId = opId(operation, pathName, method);
    var legacyOperationId = legacyIdFromPathMethod(pathName, method);
    return [operationId, legacyOperationId, rawOperationId].some(function (
      val
    ) {
      return val && val === id2;
    });
  });
}
function findOperation(spec, predicate) {
  return eachOperation(spec, predicate, true) || null;
}
function eachOperation(spec, cb3, find2) {
  if (
    !spec ||
    _typeof_1(spec) !== 'object' ||
    !spec.paths ||
    _typeof_1(spec.paths) !== 'object'
  ) {
    return null;
  }
  var paths = spec.paths;
  for (var pathName in paths) {
    for (var method in paths[pathName]) {
      if (method.toUpperCase() === 'PARAMETERS') {
        continue;
      }
      var operation = paths[pathName][method];
      if (!operation || _typeof_1(operation) !== 'object') {
        continue;
      }
      var operationObj = {
        spec,
        pathName,
        method: method.toUpperCase(),
        operation,
      };
      var cbValue = cb3(operationObj);
      if (find2 && cbValue) {
        return operationObj;
      }
    }
  }
  return void 0;
}
function normalizeSwagger(parsedSpec) {
  var spec = parsedSpec.spec;
  var paths = spec.paths;
  var map3 = {};
  if (!paths || spec.$$normalized) {
    return parsedSpec;
  }
  for (var pathName in paths) {
    var path2 = paths[pathName];
    if (!isObject_1(path2)) {
      continue;
    }
    var pathParameters = path2.parameters;
    var _loop = function _loop2(method2) {
      var operation = path2[method2];
      if (!isObject_1(operation)) {
        return 'continue';
      }
      var oid = opId(operation, pathName, method2);
      if (oid) {
        if (map3[oid]) {
          map3[oid].push(operation);
        } else {
          map3[oid] = [operation];
        }
        var opList = map3[oid];
        if (opList.length > 1) {
          opList.forEach(function (o, i) {
            var _context5;
            o.__originalOperationId = o.__originalOperationId || o.operationId;
            o.operationId = concat$2((_context5 = ''.concat(oid))).call(
              _context5,
              i + 1
            );
          });
        } else if (typeof operation.operationId !== 'undefined') {
          var obj = opList[0];
          obj.__originalOperationId =
            obj.__originalOperationId || operation.operationId;
          obj.operationId = oid;
        }
      }
      if (method2 !== 'parameters') {
        var inheritsList = [];
        var toBeInherit = {};
        for (var key in spec) {
          if (key === 'produces' || key === 'consumes' || key === 'security') {
            toBeInherit[key] = spec[key];
            inheritsList.push(toBeInherit);
          }
        }
        if (pathParameters) {
          toBeInherit.parameters = pathParameters;
          inheritsList.push(toBeInherit);
        }
        if (inheritsList.length) {
          var _iterator = createForOfIteratorHelper(inheritsList),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var inherits = _step.value;
              for (var inheritName in inherits) {
                if (!operation[inheritName]) {
                  operation[inheritName] = inherits[inheritName];
                } else if (inheritName === 'parameters') {
                  var _iterator2 = createForOfIteratorHelper(
                      inherits[inheritName]
                    ),
                    _step2;
                  try {
                    var _loop22 = function _loop23() {
                      var param = _step2.value;
                      var exists = operation[inheritName].some(function (
                        opParam
                      ) {
                        return (
                          (opParam.name && opParam.name === param.name) ||
                          (opParam.$ref && opParam.$ref === param.$ref) ||
                          (opParam.$$ref && opParam.$$ref === param.$$ref) ||
                          opParam === param
                        );
                      });
                      if (!exists) {
                        operation[inheritName].push(param);
                      }
                    };
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                      _loop22();
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    };
    for (var method in path2) {
      var _ret = _loop(method);
      if (_ret === 'continue') continue;
    }
  }
  spec.$$normalized = true;
  return parsedSpec;
}
function makeFetchJSON(http2) {
  var opts =
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var requestInterceptor = opts.requestInterceptor,
    responseInterceptor = opts.responseInterceptor;
  var credentials = http2.withCredentials ? 'include' : 'same-origin';
  return function (docPath) {
    return http2({
      url: docPath,
      loadSpec: true,
      requestInterceptor,
      responseInterceptor,
      headers: {
        Accept: ACCEPT_HEADER_VALUE_FOR_DOCUMENTS,
      },
      credentials,
    }).then(function (res) {
      return res.body;
    });
  };
}
function clearCache$1() {
  plugins.refs.clearCache();
}
function resolve2(obj) {
  var fetch2 = obj.fetch,
    spec = obj.spec,
    url3 = obj.url,
    mode = obj.mode,
    _obj$allowMetaPatches = obj.allowMetaPatches,
    allowMetaPatches =
      _obj$allowMetaPatches === void 0 ? true : _obj$allowMetaPatches,
    pathDiscriminator = obj.pathDiscriminator,
    modelPropertyMacro = obj.modelPropertyMacro,
    parameterMacro = obj.parameterMacro,
    requestInterceptor = obj.requestInterceptor,
    responseInterceptor = obj.responseInterceptor,
    skipNormalization = obj.skipNormalization,
    useCircularStructures = obj.useCircularStructures;
  var http$1 = obj.http,
    baseDoc = obj.baseDoc;
  baseDoc = baseDoc || url3;
  http$1 = fetch2 || http$1 || http;
  if (!spec) {
    return makeFetchJSON(http$1, {
      requestInterceptor,
      responseInterceptor,
    })(baseDoc).then(doResolve);
  }
  return doResolve(spec);
  function doResolve(_spec) {
    if (baseDoc) {
      plugins.refs.docCache[baseDoc] = _spec;
    }
    plugins.refs.fetchJSON = makeFetchJSON(http$1, {
      requestInterceptor,
      responseInterceptor,
    });
    var plugs = [plugins.refs];
    if (typeof parameterMacro === 'function') {
      plugs.push(plugins.parameters);
    }
    if (typeof modelPropertyMacro === 'function') {
      plugs.push(plugins.properties);
    }
    if (mode !== 'strict') {
      plugs.push(plugins.allOf);
    }
    return mapSpec({
      spec: _spec,
      context: {
        baseDoc,
      },
      plugins: plugs,
      allowMetaPatches,
      pathDiscriminator,
      parameterMacro,
      modelPropertyMacro,
      useCircularStructures,
    }).then(
      skipNormalization
        ? /* @__PURE__ */ (function () {
            var _ref = asyncToGenerator(
              /* @__PURE__ */ regenerator.mark(function _callee(a) {
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        return _context.abrupt('return', a);
                      case 1:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee);
              })
            );
            return function (_x) {
              return _ref.apply(this, arguments);
            };
          })()
        : normalizeSwagger
    );
  }
}
function resolveSubtree(_x, _x2) {
  return _resolveSubtree.apply(this, arguments);
}
function _resolveSubtree() {
  _resolveSubtree = asyncToGenerator(
    /* @__PURE__ */ regenerator.mark(function _callee(obj, path2) {
      var opts,
        returnEntireTree,
        baseDoc,
        requestInterceptor,
        responseInterceptor,
        parameterMacro,
        modelPropertyMacro,
        useCircularStructures,
        resolveOptions,
        _normalizeSwagger,
        normalized,
        result,
        _args = arguments;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              opts = _args.length > 2 && _args[2] !== void 0 ? _args[2] : {};
              (returnEntireTree = opts.returnEntireTree),
                (baseDoc = opts.baseDoc),
                (requestInterceptor = opts.requestInterceptor),
                (responseInterceptor = opts.responseInterceptor),
                (parameterMacro = opts.parameterMacro),
                (modelPropertyMacro = opts.modelPropertyMacro),
                (useCircularStructures = opts.useCircularStructures);
              resolveOptions = {
                pathDiscriminator: path2,
                baseDoc,
                requestInterceptor,
                responseInterceptor,
                parameterMacro,
                modelPropertyMacro,
                useCircularStructures,
              };
              (_normalizeSwagger = normalizeSwagger({
                spec: obj,
              })),
                (normalized = _normalizeSwagger.spec);
              _context.next = 6;
              return resolve2(
                objectSpread2(
                  objectSpread2({}, resolveOptions),
                  {},
                  {
                    spec: normalized,
                    allowMetaPatches: true,
                    skipNormalization: true,
                  }
                )
              );
            case 6:
              result = _context.sent;
              if (!returnEntireTree && Array.isArray(path2) && path2.length) {
                result.spec = get_1(result.spec, path2) || null;
              }
              return _context.abrupt('return', result);
            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _resolveSubtree.apply(this, arguments);
}
var nullFn = function nullFn2() {
  return null;
};
var normalizeArray$1 = function normalizeArray2(arg) {
  return Array.isArray(arg) ? arg : [arg];
};
var self$2 = {
  mapTagOperations,
  makeExecute,
};
function makeExecute() {
  var swaggerJs =
    arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  return function (_ref) {
    var pathName = _ref.pathName,
      method = _ref.method,
      operationId = _ref.operationId;
    return function (parameters2) {
      var opts =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return swaggerJs.execute(
        objectSpread2(
          objectSpread2(
            {
              spec: swaggerJs.spec,
            },
            pick_1(
              swaggerJs,
              'requestInterceptor',
              'responseInterceptor',
              'userFetch'
            )
          ),
          {},
          {
            pathName,
            method,
            parameters: parameters2,
            operationId,
          },
          opts
        )
      );
    };
  };
}
function makeApisTagOperation() {
  var swaggerJs =
    arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var cb3 = self$2.makeExecute(swaggerJs);
  return {
    apis: self$2.mapTagOperations({
      v2OperationIdCompatibilityMode: swaggerJs.v2OperationIdCompatibilityMode,
      spec: swaggerJs.spec,
      cb: cb3,
    }),
  };
}
function mapTagOperations(_ref2) {
  var spec = _ref2.spec,
    _ref2$cb = _ref2.cb,
    cb3 = _ref2$cb === void 0 ? nullFn : _ref2$cb,
    _ref2$defaultTag = _ref2.defaultTag,
    defaultTag = _ref2$defaultTag === void 0 ? 'default' : _ref2$defaultTag,
    v2OperationIdCompatibilityMode = _ref2.v2OperationIdCompatibilityMode;
  var operationIdCounter = {};
  var tagOperations = {};
  eachOperation(spec, function (_ref3) {
    var pathName = _ref3.pathName,
      method = _ref3.method,
      operation = _ref3.operation;
    var tags = operation.tags ? normalizeArray$1(operation.tags) : [defaultTag];
    tags.forEach(function (tag) {
      if (typeof tag !== 'string') {
        return;
      }
      tagOperations[tag] = tagOperations[tag] || {};
      var tagObj = tagOperations[tag];
      var id2 = opId(operation, pathName, method, {
        v2OperationIdCompatibilityMode,
      });
      var cbResult = cb3({
        spec,
        pathName,
        method,
        operation,
        operationId: id2,
      });
      if (operationIdCounter[id2]) {
        var _context;
        operationIdCounter[id2] += 1;
        tagObj[
          concat$2((_context = ''.concat(id2))).call(
            _context,
            operationIdCounter[id2]
          )
        ] = cbResult;
      } else if (typeof tagObj[id2] !== 'undefined') {
        var _context2, _context3;
        var originalCounterValue = operationIdCounter[id2] || 1;
        operationIdCounter[id2] = originalCounterValue + 1;
        tagObj[
          concat$2((_context2 = ''.concat(id2))).call(
            _context2,
            operationIdCounter[id2]
          )
        ] = cbResult;
        var temp = tagObj[id2];
        delete tagObj[id2];
        tagObj[
          concat$2((_context3 = ''.concat(id2))).call(
            _context3,
            originalCounterValue
          )
        ] = temp;
      } else {
        tagObj[id2] = cbResult;
      }
    });
  });
  return tagOperations;
}
var $indexOf = arrayIncludes.indexOf;
var nativeIndexOf = [].indexOf;
var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', {
  ACCESSORS: true,
  1: 0,
});
_export(
  {
    target: 'Array',
    proto: true,
    forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$6,
  },
  {
    indexOf: function indexOf2(searchElement) {
      return NEGATIVE_ZERO
        ? nativeIndexOf.apply(this, arguments) || 0
        : $indexOf(
            this,
            searchElement,
            arguments.length > 1 ? arguments[1] : void 0
          );
    },
  }
);
var indexOf$1 = entryVirtual('Array').indexOf;
var ArrayPrototype$9 = Array.prototype;
var indexOf_1 = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype$9 ||
    (it instanceof Array && own === ArrayPrototype$9.indexOf)
    ? indexOf$1
    : own;
};
var indexOf$2 = indexOf_1;
var indexOf$3 = indexOf$2;
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = keys$3(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (indexOf$3(excluded).call(excluded, key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (getOwnPropertySymbols$2) {
    var sourceSymbolKeys = getOwnPropertySymbols$2(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (indexOf$3(excluded).call(excluded, key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var objectWithoutProperties = _objectWithoutProperties;
var objectTag$4 = '[object Object]';
var funcProto$2 = Function.prototype,
  objectProto$h = Object.prototype;
var funcToString$2 = funcProto$2.toString;
var hasOwnProperty$f = objectProto$h.hasOwnProperty;
var objectCtorString = funcToString$2.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$4) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$f.call(proto, 'constructor') && proto.constructor;
  return (
    typeof Ctor == 'function' &&
    Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString
  );
}
var isPlainObject_1 = isPlainObject;
var SWAGGER2_PARAMETER_BUILDERS = {
  body: bodyBuilder,
  header: headerBuilder,
  query: queryBuilder,
  path: pathBuilder,
  formData: formDataBuilder,
};
function bodyBuilder(_ref) {
  var req = _ref.req,
    value = _ref.value;
  req.body = value;
}
function formDataBuilder(_ref2) {
  var req = _ref2.req,
    value = _ref2.value,
    parameter = _ref2.parameter;
  if (value || parameter.allowEmptyValue) {
    req.form = req.form || {};
    req.form[parameter.name] = {
      value,
      allowEmptyValue: parameter.allowEmptyValue,
      collectionFormat: parameter.collectionFormat,
    };
  }
}
function headerBuilder(_ref3) {
  var req = _ref3.req,
    parameter = _ref3.parameter,
    value = _ref3.value;
  req.headers = req.headers || {};
  if (typeof value !== 'undefined') {
    req.headers[parameter.name] = value;
  }
}
function pathBuilder(_ref4) {
  var req = _ref4.req,
    value = _ref4.value,
    parameter = _ref4.parameter;
  req.url = req.url
    .split('{'.concat(parameter.name, '}'))
    .join(encodeURIComponent(value));
}
function queryBuilder(_ref5) {
  var req = _ref5.req,
    value = _ref5.value,
    parameter = _ref5.parameter;
  req.query = req.query || {};
  if (value === false && parameter.type === 'boolean') {
    value = 'false';
  }
  if (value === 0 && ['number', 'integer'].indexOf(parameter.type) > -1) {
    value = '0';
  }
  if (value) {
    req.query[parameter.name] = {
      collectionFormat: parameter.collectionFormat,
      value,
    };
  } else if (parameter.allowEmptyValue && value !== void 0) {
    var paramName = parameter.name;
    req.query[paramName] = req.query[paramName] || {};
    req.query[paramName].allowEmptyValue = true;
  }
}
function serialize(value, mediaType) {
  if (includes$4(mediaType).call(mediaType, 'application/json')) {
    if (typeof value === 'string') {
      return value;
    }
    return stringify$2(value);
  }
  return value.toString();
}
function path$1(_ref) {
  var req = _ref.req,
    value = _ref.value,
    parameter = _ref.parameter;
  var name = parameter.name,
    style = parameter.style,
    explode = parameter.explode,
    content = parameter.content;
  if (content) {
    var effectiveMediaType = keys$6(content)[0];
    req.url = req.url.split('{'.concat(name, '}')).join(
      encodeDisallowedCharacters(serialize(value, effectiveMediaType), {
        escape: true,
      })
    );
    return;
  }
  var styledValue = stylize({
    key: parameter.name,
    value,
    style: style || 'simple',
    explode: explode || false,
    escape: true,
  });
  req.url = req.url.split('{'.concat(name, '}')).join(styledValue);
}
function query(_ref2) {
  var req = _ref2.req,
    value = _ref2.value,
    parameter = _ref2.parameter;
  req.query = req.query || {};
  if (parameter.content) {
    var effectiveMediaType = keys$6(parameter.content)[0];
    req.query[parameter.name] = serialize(value, effectiveMediaType);
    return;
  }
  if (value === false) {
    value = 'false';
  }
  if (value === 0) {
    value = '0';
  }
  if (value) {
    req.query[parameter.name] = {
      value,
      serializationOption: pick_1(parameter, [
        'style',
        'explode',
        'allowReserved',
      ]),
    };
  } else if (parameter.allowEmptyValue && value !== void 0) {
    var paramName = parameter.name;
    req.query[paramName] = req.query[paramName] || {};
    req.query[paramName].allowEmptyValue = true;
  }
}
var PARAMETER_HEADER_BLACKLIST = ['accept', 'authorization', 'content-type'];
function header(_ref3) {
  var req = _ref3.req,
    parameter = _ref3.parameter,
    value = _ref3.value;
  req.headers = req.headers || {};
  if (PARAMETER_HEADER_BLACKLIST.indexOf(parameter.name.toLowerCase()) > -1) {
    return;
  }
  if (parameter.content) {
    var effectiveMediaType = keys$6(parameter.content)[0];
    req.headers[parameter.name] = serialize(value, effectiveMediaType);
    return;
  }
  if (typeof value !== 'undefined') {
    req.headers[parameter.name] = stylize({
      key: parameter.name,
      value,
      style: parameter.style || 'simple',
      explode:
        typeof parameter.explode === 'undefined' ? false : parameter.explode,
      escape: false,
    });
  }
}
function cookie2(_ref4) {
  var req = _ref4.req,
    parameter = _ref4.parameter,
    value = _ref4.value;
  req.headers = req.headers || {};
  var type = _typeof_1(value);
  if (parameter.content) {
    var _context;
    var effectiveMediaType = keys$6(parameter.content)[0];
    req.headers.Cookie = concat$2(
      (_context = ''.concat(parameter.name, '='))
    ).call(_context, serialize(value, effectiveMediaType));
    return;
  }
  if (type !== 'undefined') {
    var prefix =
      type === 'object' && !Array.isArray(value) && parameter.explode
        ? ''
        : ''.concat(parameter.name, '=');
    req.headers.Cookie =
      prefix +
      stylize({
        key: parameter.name,
        value,
        escape: false,
        style: parameter.style || 'form',
        explode:
          typeof parameter.explode === 'undefined' ? false : parameter.explode,
      });
  }
}
var OAS3_PARAMETER_BUILDERS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  path: path$1,
  query,
  header,
  cookie: cookie2,
});
function buildRequest(options, req) {
  var operation = options.operation,
    requestBody = options.requestBody,
    securities = options.securities,
    spec = options.spec,
    attachContentTypeForEmptyPayload = options.attachContentTypeForEmptyPayload;
  var requestContentType = options.requestContentType;
  req = applySecurities({
    request: req,
    securities,
    operation,
    spec,
  });
  var requestBodyDef = operation.requestBody || {};
  var requestBodyMediaTypes = keys$6(requestBodyDef.content || {});
  var isExplicitContentTypeValid =
    requestContentType &&
    requestBodyMediaTypes.indexOf(requestContentType) > -1;
  if (requestBody || attachContentTypeForEmptyPayload) {
    if (requestContentType && isExplicitContentTypeValid) {
      req.headers['Content-Type'] = requestContentType;
    } else if (!requestContentType) {
      var firstMediaType = requestBodyMediaTypes[0];
      if (firstMediaType) {
        req.headers['Content-Type'] = firstMediaType;
        requestContentType = firstMediaType;
      }
    }
  } else if (requestContentType && isExplicitContentTypeValid) {
    req.headers['Content-Type'] = requestContentType;
  }
  if (!options.responseContentType && operation.responses) {
    var _context;
    var mediaTypes = filter$4((_context = entries$5(operation.responses)))
      .call(_context, function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        var code = parseInt(key, 10);
        return code >= 200 && code < 300 && isPlainObject_1(value.content);
      })
      .reduce(function (acc, _ref3) {
        var _ref4 = slicedToArray(_ref3, 2),
          value = _ref4[1];
        return concat$2(acc).call(acc, keys$6(value.content));
      }, []);
    if (mediaTypes.length > 0) {
      req.headers.accept = mediaTypes.join(', ');
    }
  }
  if (requestBody) {
    if (requestContentType) {
      if (requestBodyMediaTypes.indexOf(requestContentType) > -1) {
        if (
          requestContentType === 'application/x-www-form-urlencoded' ||
          requestContentType === 'multipart/form-data'
        ) {
          if (_typeof_1(requestBody) === 'object') {
            var encoding =
              (requestBodyDef.content[requestContentType] || {}).encoding || {};
            req.form = {};
            keys$6(requestBody).forEach(function (k) {
              req.form[k] = {
                value: requestBody[k],
                encoding: encoding[k] || {},
              };
            });
          } else {
            req.form = requestBody;
          }
        } else {
          req.body = requestBody;
        }
      }
    } else {
      req.body = requestBody;
    }
  }
  return req;
}
function applySecurities(_ref5) {
  var request = _ref5.request,
    _ref5$securities = _ref5.securities,
    securities = _ref5$securities === void 0 ? {} : _ref5$securities,
    _ref5$operation = _ref5.operation,
    operation = _ref5$operation === void 0 ? {} : _ref5$operation,
    spec = _ref5.spec;
  var result = assign_1({}, request);
  var _securities$authorize = securities.authorized,
    authorized = _securities$authorize === void 0 ? {} : _securities$authorize;
  var security = operation.security || spec.security || [];
  var isAuthorized = authorized && !!keys$6(authorized).length;
  var securityDef = get_1(spec, ['components', 'securitySchemes']) || {};
  result.headers = result.headers || {};
  result.query = result.query || {};
  if (
    !keys$6(securities).length ||
    !isAuthorized ||
    !security ||
    (Array.isArray(operation.security) && !operation.security.length)
  ) {
    return request;
  }
  security.forEach(function (securityObj) {
    keys$6(securityObj).forEach(function (key) {
      var auth = authorized[key];
      var schema = securityDef[key];
      if (!auth) {
        return;
      }
      var value = auth.value || auth;
      var type = schema.type;
      if (auth) {
        if (type === 'apiKey') {
          if (schema.in === 'query') {
            result.query[schema.name] = value;
          }
          if (schema.in === 'header') {
            result.headers[schema.name] = value;
          }
          if (schema.in === 'cookie') {
            result.cookies[schema.name] = value;
          }
        } else if (type === 'http') {
          if (/^basic$/i.test(schema.scheme)) {
            var _context2;
            var username = value.username || '';
            var password = value.password || '';
            var encoded = btoa2(
              concat$2((_context2 = ''.concat(username, ':'))).call(
                _context2,
                password
              )
            );
            result.headers.Authorization = 'Basic '.concat(encoded);
          }
          if (/^bearer$/i.test(schema.scheme)) {
            result.headers.Authorization = 'Bearer '.concat(value);
          }
        } else if (type === 'oauth2' || type === 'openIdConnect') {
          var _context3;
          var token = auth.token || {};
          var tokenName = schema['x-tokenName'] || 'access_token';
          var tokenValue = token[tokenName];
          var tokenType = token.token_type;
          if (!tokenType || tokenType.toLowerCase() === 'bearer') {
            tokenType = 'Bearer';
          }
          result.headers.Authorization = concat$2(
            (_context3 = ''.concat(tokenType, ' '))
          ).call(_context3, tokenValue);
        }
      }
    });
  });
  return result;
}
function buildRequest$1(options, req) {
  var spec = options.spec,
    operation = options.operation,
    securities = options.securities,
    requestContentType = options.requestContentType,
    responseContentType = options.responseContentType,
    attachContentTypeForEmptyPayload = options.attachContentTypeForEmptyPayload;
  req = applySecurities$1({
    request: req,
    securities,
    operation,
    spec,
  });
  if (req.body || req.form || attachContentTypeForEmptyPayload) {
    var _context, _context2;
    if (requestContentType) {
      req.headers['Content-Type'] = requestContentType;
    } else if (Array.isArray(operation.consumes)) {
      var _operation$consumes = slicedToArray(operation.consumes, 1);
      req.headers['Content-Type'] = _operation$consumes[0];
    } else if (Array.isArray(spec.consumes)) {
      var _spec$consumes = slicedToArray(spec.consumes, 1);
      req.headers['Content-Type'] = _spec$consumes[0];
    } else if (
      operation.parameters &&
      filter$4((_context = operation.parameters)).call(_context, function (p) {
        return p.type === 'file';
      }).length
    ) {
      req.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      operation.parameters &&
      filter$4((_context2 = operation.parameters)).call(
        _context2,
        function (p) {
          return p.in === 'formData';
        }
      ).length
    ) {
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  } else if (requestContentType) {
    var _context3, _context4;
    var isBodyParamPresent =
      operation.parameters &&
      filter$4((_context3 = operation.parameters)).call(
        _context3,
        function (p) {
          return p.in === 'body';
        }
      ).length > 0;
    var isFormDataParamPresent =
      operation.parameters &&
      filter$4((_context4 = operation.parameters)).call(
        _context4,
        function (p) {
          return p.in === 'formData';
        }
      ).length > 0;
    if (isBodyParamPresent || isFormDataParamPresent) {
      req.headers['Content-Type'] = requestContentType;
    }
  }
  if (
    !responseContentType &&
    Array.isArray(operation.produces) &&
    operation.produces.length > 0
  ) {
    req.headers.accept = operation.produces.join(', ');
  }
  return req;
}
function applySecurities$1(_ref) {
  var request = _ref.request,
    _ref$securities = _ref.securities,
    securities = _ref$securities === void 0 ? {} : _ref$securities,
    _ref$operation = _ref.operation,
    operation = _ref$operation === void 0 ? {} : _ref$operation,
    spec = _ref.spec;
  var result = assign_1({}, request);
  var _securities$authorize = securities.authorized,
    authorized = _securities$authorize === void 0 ? {} : _securities$authorize,
    _securities$specSecur = securities.specSecurity,
    specSecurity =
      _securities$specSecur === void 0 ? [] : _securities$specSecur;
  var security = operation.security || specSecurity;
  var isAuthorized = authorized && !!keys$6(authorized).length;
  var securityDef = spec.securityDefinitions;
  result.headers = result.headers || {};
  result.query = result.query || {};
  if (
    !keys$6(securities).length ||
    !isAuthorized ||
    !security ||
    (Array.isArray(operation.security) && !operation.security.length)
  ) {
    return request;
  }
  security.forEach(function (securityObj) {
    keys$6(securityObj).forEach(function (key) {
      var auth = authorized[key];
      if (!auth) {
        return;
      }
      var token = auth.token;
      var value = auth.value || auth;
      var schema = securityDef[key];
      var type = schema.type;
      var tokenName = schema['x-tokenName'] || 'access_token';
      var oauthToken = token && token[tokenName];
      var tokenType = token && token.token_type;
      if (auth) {
        if (type === 'apiKey') {
          var inType = schema.in === 'query' ? 'query' : 'headers';
          result[inType] = result[inType] || {};
          result[inType][schema.name] = value;
        } else if (type === 'basic') {
          if (value.header) {
            result.headers.authorization = value.header;
          } else {
            var _context5;
            var username = value.username || '';
            var password = value.password || '';
            value.base64 = btoa2(
              concat$2((_context5 = ''.concat(username, ':'))).call(
                _context5,
                password
              )
            );
            result.headers.authorization = 'Basic '.concat(value.base64);
          }
        } else if (type === 'oauth2' && oauthToken) {
          var _context6;
          tokenType =
            !tokenType || tokenType.toLowerCase() === 'bearer'
              ? 'Bearer'
              : tokenType;
          result.headers.authorization = concat$2(
            (_context6 = ''.concat(tokenType, ' '))
          ).call(_context6, oauthToken);
        }
      }
    });
  });
  return result;
}
var _excluded = [
  'http',
  'fetch',
  'spec',
  'operationId',
  'pathName',
  'method',
  'parameters',
  'securities',
];
var arrayOrEmpty = function arrayOrEmpty2(ar) {
  return Array.isArray(ar) ? ar : [];
};
var OperationNotFoundError = createErrorType(
  'OperationNotFoundError',
  function cb2(message, extra, oriError) {
    this.originalError = oriError;
    assign$3(this, extra || {});
  }
);
var findParametersWithName = function findParametersWithName2(
  name,
  parameters2
) {
  return filter$4(parameters2).call(parameters2, function (p) {
    return p.name === name;
  });
};
var deduplicateParameters = function deduplicateParameters2(parameters2) {
  var paramsMap = {};
  parameters2.forEach(function (p) {
    if (!paramsMap[p.in]) {
      paramsMap[p.in] = {};
    }
    paramsMap[p.in][p.name] = p;
  });
  var dedupedParameters = [];
  keys$6(paramsMap).forEach(function (i) {
    keys$6(paramsMap[i]).forEach(function (p) {
      dedupedParameters.push(paramsMap[i][p]);
    });
  });
  return dedupedParameters;
};
var self$3 = {
  buildRequest: buildRequest$2,
};
function execute(_ref) {
  var userHttp = _ref.http,
    fetch2 = _ref.fetch,
    spec = _ref.spec,
    operationId = _ref.operationId,
    pathName = _ref.pathName,
    method = _ref.method,
    parameters2 = _ref.parameters,
    securities = _ref.securities,
    extras = objectWithoutProperties(_ref, _excluded);
  var http$1 = userHttp || fetch2 || http;
  if (pathName && method && !operationId) {
    operationId = legacyIdFromPathMethod(pathName, method);
  }
  var request = self$3.buildRequest(
    objectSpread2(
      {
        spec,
        operationId,
        parameters: parameters2,
        securities,
        http: http$1,
      },
      extras
    )
  );
  if (
    request.body &&
    (isPlainObject_1(request.body) || isArray_1(request.body))
  ) {
    request.body = stringify$2(request.body);
  }
  return http$1(request);
}
function buildRequest$2(options) {
  var _context, _context2;
  var spec = options.spec,
    operationId = options.operationId,
    responseContentType = options.responseContentType,
    scheme = options.scheme,
    requestInterceptor = options.requestInterceptor,
    responseInterceptor = options.responseInterceptor,
    contextUrl = options.contextUrl,
    userFetch = options.userFetch,
    server = options.server,
    serverVariables = options.serverVariables,
    http2 = options.http;
  var parameters2 = options.parameters,
    parameterBuilders = options.parameterBuilders;
  var specIsOAS3 = isOAS3(spec);
  if (!parameterBuilders) {
    if (specIsOAS3) {
      parameterBuilders = OAS3_PARAMETER_BUILDERS;
    } else {
      parameterBuilders = SWAGGER2_PARAMETER_BUILDERS;
    }
  }
  var credentials = http2 && http2.withCredentials ? 'include' : 'same-origin';
  var req = {
    url: '',
    credentials,
    headers: {},
    cookies: {},
  };
  if (requestInterceptor) {
    req.requestInterceptor = requestInterceptor;
  }
  if (responseInterceptor) {
    req.responseInterceptor = responseInterceptor;
  }
  if (userFetch) {
    req.userFetch = userFetch;
  }
  var operationRaw = getOperationRaw(spec, operationId);
  if (!operationRaw) {
    throw new OperationNotFoundError(
      'Operation '.concat(operationId, ' not found')
    );
  }
  var _operationRaw$operati = operationRaw.operation,
    operation = _operationRaw$operati === void 0 ? {} : _operationRaw$operati,
    method = operationRaw.method,
    pathName = operationRaw.pathName;
  req.url += baseUrl({
    spec,
    scheme,
    contextUrl,
    server,
    serverVariables,
    pathName,
    method,
  });
  if (!operationId) {
    delete req.cookies;
    return req;
  }
  req.url += pathName;
  req.method = ''.concat(method).toUpperCase();
  parameters2 = parameters2 || {};
  var path2 = spec.paths[pathName] || {};
  if (responseContentType) {
    req.headers.accept = responseContentType;
  }
  var combinedParameters = deduplicateParameters(
    concat$2(
      (_context = concat$2((_context2 = [])).call(
        _context2,
        arrayOrEmpty(operation.parameters)
      ))
    ).call(_context, arrayOrEmpty(path2.parameters))
  );
  combinedParameters.forEach(function (parameter) {
    var builder = parameterBuilders[parameter.in];
    var value;
    if (
      parameter.in === 'body' &&
      parameter.schema &&
      parameter.schema.properties
    ) {
      value = parameters2;
    }
    value = parameter && parameter.name && parameters2[parameter.name];
    if (typeof value === 'undefined') {
      var _context3;
      value =
        parameter &&
        parameter.name &&
        parameters2[
          concat$2((_context3 = ''.concat(parameter.in, '.'))).call(
            _context3,
            parameter.name
          )
        ];
    } else if (
      findParametersWithName(parameter.name, combinedParameters).length > 1
    ) {
      var _context4;
      console.warn(
        concat$2(
          (_context4 = "Parameter '".concat(
            parameter.name,
            "' is ambiguous because the defined spec has more than one parameter with the name: '"
          ))
        ).call(
          _context4,
          parameter.name,
          "' and the passed-in parameter values did not define an 'in' value."
        )
      );
    }
    if (value === null) {
      return;
    }
    if (
      typeof parameter.default !== 'undefined' &&
      typeof value === 'undefined'
    ) {
      value = parameter.default;
    }
    if (
      typeof value === 'undefined' &&
      parameter.required &&
      !parameter.allowEmptyValue
    ) {
      throw new Error(
        'Required parameter '.concat(parameter.name, ' is not provided')
      );
    }
    if (
      specIsOAS3 &&
      parameter.schema &&
      parameter.schema.type === 'object' &&
      typeof value === 'string'
    ) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        throw new Error(
          'Could not parse object parameter value string as JSON'
        );
      }
    }
    if (builder) {
      builder({
        req,
        parameter,
        value,
        operation,
        spec,
      });
    }
  });
  var versionSpecificOptions = objectSpread2(
    objectSpread2({}, options),
    {},
    {
      operation,
    }
  );
  if (specIsOAS3) {
    req = buildRequest(versionSpecificOptions, req);
  } else {
    req = buildRequest$1(versionSpecificOptions, req);
  }
  if (req.cookies && keys$6(req.cookies).length) {
    var cookieString = keys$6(req.cookies).reduce(function (prev, cookieName) {
      var cookieValue = req.cookies[cookieName];
      var prefix = prev ? '&' : '';
      var stringified = cookie$1.serialize(cookieName, cookieValue);
      return prev + prefix + stringified;
    }, '');
    req.headers.Cookie = cookieString;
  }
  if (req.cookies) {
    delete req.cookies;
  }
  mergeInQueryOrForm(req);
  return req;
}
var stripNonAlpha = function stripNonAlpha2(str) {
  return str ? str.replace(/\W/g, '') : null;
};
function baseUrl(obj) {
  var specIsOAS3 = isOAS3(obj.spec);
  return specIsOAS3 ? oas3BaseUrl(obj) : swagger2BaseUrl(obj);
}
function oas3BaseUrl(_ref2) {
  var spec = _ref2.spec,
    pathName = _ref2.pathName,
    method = _ref2.method,
    server = _ref2.server,
    contextUrl = _ref2.contextUrl,
    _ref2$serverVariables = _ref2.serverVariables,
    serverVariables =
      _ref2$serverVariables === void 0 ? {} : _ref2$serverVariables;
  var servers =
    get_1(spec, ['paths', pathName, (method || '').toLowerCase(), 'servers']) ||
    get_1(spec, ['paths', pathName, 'servers']) ||
    get_1(spec, ['servers']);
  var selectedServerUrl = '';
  var selectedServerObj = null;
  if (server && servers && servers.length) {
    var serverUrls = map$2(servers).call(servers, function (srv) {
      return srv.url;
    });
    if (serverUrls.indexOf(server) > -1) {
      selectedServerUrl = server;
      selectedServerObj = servers[serverUrls.indexOf(server)];
    }
  }
  if (!selectedServerUrl && servers && servers.length) {
    selectedServerUrl = servers[0].url;
    var _servers = slicedToArray(servers, 1);
    selectedServerObj = _servers[0];
  }
  if (selectedServerUrl.indexOf('{') > -1) {
    var varNames = getVariableTemplateNames(selectedServerUrl);
    varNames.forEach(function (vari) {
      if (selectedServerObj.variables && selectedServerObj.variables[vari]) {
        var variableDefinition = selectedServerObj.variables[vari];
        var variableValue = serverVariables[vari] || variableDefinition.default;
        var re2 = new RegExp('{'.concat(vari, '}'), 'g');
        selectedServerUrl = selectedServerUrl.replace(re2, variableValue);
      }
    });
  }
  return buildOas3UrlWithContext(selectedServerUrl, contextUrl);
}
function buildOas3UrlWithContext() {
  var ourUrl =
    arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
  var contextUrl =
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
  var parsedUrl =
    ourUrl && contextUrl
      ? url2.parse(url2.resolve(contextUrl, ourUrl))
      : url2.parse(ourUrl);
  var parsedContextUrl = url2.parse(contextUrl);
  var computedScheme =
    stripNonAlpha(parsedUrl.protocol) ||
    stripNonAlpha(parsedContextUrl.protocol) ||
    '';
  var computedHost = parsedUrl.host || parsedContextUrl.host;
  var computedPath = parsedUrl.pathname || '';
  var res;
  if (computedScheme && computedHost) {
    var _context5;
    res = concat$2((_context5 = ''.concat(computedScheme, '://'))).call(
      _context5,
      computedHost + computedPath
    );
  } else {
    res = computedPath;
  }
  return res[res.length - 1] === '/' ? slice$4(res).call(res, 0, -1) : res;
}
function getVariableTemplateNames(str) {
  var results = [];
  var re2 = /{([^}]+)}/g;
  var text;
  while ((text = re2.exec(str))) {
    results.push(text[1]);
  }
  return results;
}
function swagger2BaseUrl(_ref3) {
  var spec = _ref3.spec,
    scheme = _ref3.scheme,
    _ref3$contextUrl = _ref3.contextUrl,
    contextUrl = _ref3$contextUrl === void 0 ? '' : _ref3$contextUrl;
  var parsedContextUrl = url2.parse(contextUrl);
  var firstSchemeInSpec = Array.isArray(spec.schemes) ? spec.schemes[0] : null;
  var computedScheme =
    scheme ||
    firstSchemeInSpec ||
    stripNonAlpha(parsedContextUrl.protocol) ||
    'http';
  var computedHost = spec.host || parsedContextUrl.host || '';
  var computedPath = spec.basePath || '';
  var res;
  if (computedScheme && computedHost) {
    var _context6;
    res = concat$2((_context6 = ''.concat(computedScheme, '://'))).call(
      _context6,
      computedHost + computedPath
    );
  } else {
    res = computedPath;
  }
  return res[res.length - 1] === '/' ? slice$4(res).call(res, 0, -1) : res;
}
Swagger.http = http;
Swagger.makeHttp = makeHttp.bind(null, Swagger.http);
Swagger.resolve = resolve2;
Swagger.resolveSubtree = resolveSubtree;
Swagger.execute = execute;
Swagger.serializeRes = serializeRes;
Swagger.serializeHeaders = serializeHeaders;
Swagger.clearCache = clearCache$1;
Swagger.makeApisTagOperation = makeApisTagOperation;
Swagger.buildRequest = buildRequest$2;
Swagger.helpers = {
  opId,
};
Swagger.getBaseUrl = baseUrl;
function Swagger(url3) {
  var _this = this;
  var opts =
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (typeof url3 === 'string') {
    opts.url = url3;
  } else {
    opts = url3;
  }
  if (!(this instanceof Swagger)) {
    return new Swagger(opts);
  }
  assign_1(this, opts);
  var prom = this.resolve().then(function () {
    if (!_this.disableInterfaces) {
      assign_1(_this, Swagger.makeApisTagOperation(_this));
    }
    return _this;
  });
  prom.client = this;
  return prom;
}
Swagger.prototype = {
  http,
  execute: function execute2(options) {
    this.applyDefaults();
    return Swagger.execute(
      objectSpread2(
        {
          spec: this.spec,
          http: this.http,
          securities: {
            authorized: this.authorizations,
          },
          contextUrl: typeof this.url === 'string' ? this.url : void 0,
          requestInterceptor: this.requestInterceptor || null,
          responseInterceptor: this.responseInterceptor || null,
        },
        options
      )
    );
  },
  resolve: function resolve3() {
    var _this2 = this;
    var options =
      arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return Swagger.resolve(
      objectSpread2(
        {
          spec: this.spec,
          url: this.url,
          http: this.http || this.fetch,
          allowMetaPatches: this.allowMetaPatches,
          useCircularStructures: this.useCircularStructures,
          requestInterceptor: this.requestInterceptor || null,
          responseInterceptor: this.responseInterceptor || null,
          skipNormalization: this.skipNormalization || false,
        },
        options
      )
    ).then(function (obj) {
      _this2.originalSpec = _this2.spec;
      _this2.spec = obj.spec;
      _this2.errors = obj.errors;
      return _this2;
    });
  },
};
Swagger.prototype.applyDefaults = function applyDefaults() {
  var spec = this.spec;
  var specUrl = this.url;
  if (specUrl && startsWith_1(specUrl, 'http')) {
    var parsed = url2.parse(specUrl);
    if (!spec.host) {
      spec.host = parsed.host;
    }
    if (!spec.schemes) {
      spec.schemes = [parsed.protocol.replace(':', '')];
    }
    if (!spec.basePath) {
      spec.basePath = '/';
    }
  }
};
var helpers = Swagger.helpers;
export default Swagger;
export { helpers };
