function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function (path, base) {
      return commonjsRequire(path, base === undefined || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */


var FUNC_ERROR_TEXT = 'Expected a function';
/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED = '__lodash_hash_undefined__';
/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;
/** `Object#toString` result references. */

var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';
/** Used to match property names within property paths. */

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to match backslashes in property paths. */

var reEscapeChar = /\\(\\)?/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used to detect unsigned integer values. */

var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function getValue(object, key) {
  return object == null ? undefined : object[key];
}
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */


function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;

  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }

  return result;
}
/** Used for built-in method references. */


var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;
/** Used to detect overreaching core-js shims. */

var coreJsData = root['__core-js_shared__'];
/** Used to detect methods masquerading as native. */

var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/** Used to resolve the decompiled source of functions. */


var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/** Used to detect if a method is native. */

var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/** Built-in value references. */

var Symbol = root.Symbol,
    splice = arrayProto.splice;
/* Built-in method references that are verified to be native. */

var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');
/** Used to convert symbols to primitives and strings. */

var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */


function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function hashGet(key) {
  var data = this.__data__;

  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */


function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
} // Add methods to `Hash`.


Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */


function listCacheClear() {
  this.__data__ = [];
}
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }

  return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */


function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
} // Add methods to `ListCache`.


ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */


function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */


function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
} // Add methods to `MapCache`.


MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */


function assocIndexOf(array, key) {
  var length = array.length;

  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */


function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }

  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */


function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }

  path = isKey(path, object) ? [path] : castPath(path);
  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;

      if (newValue === undefined) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
      }
    }

    assignValue(nested, key, newValue);
    nested = nested[key];
  }

  return object;
}
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */


function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */


function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */


function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */


function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */


function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */


function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */


function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */


var stringToPath = memoize(function (string) {
  string = toString(string);
  var result = [];

  if (reLeadingDot.test(string)) {
    result.push('');
  }

  string.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */


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
/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */


function memoize(func, resolver) {
  if (typeof func != 'function' || resolver && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var memoized = function () {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };

  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
} // Assign cache to `_.memoize`.


memoize.Cache = MapCache;
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

function eq(value, other) {
  return value === other || value !== value && other !== other;
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */


var isArray = Array.isArray;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */


function toString(value) {
  return value == null ? '' : baseToString(value);
}
/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */


function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

var lodash_set = set;
var FastPriorityQueue_1 = createCommonjsModule(function (module) {
  var defaultcomparator = function (a, b) {
    return a < b;
  }; // the provided comparator function should take a, b and return *true* when a < b


  function FastPriorityQueue(comparator) {
    if (!(this instanceof FastPriorityQueue)) return new FastPriorityQueue(comparator);
    this.array = [];
    this.size = 0;
    this.compare = comparator || defaultcomparator;
  } // copy the priority queue into another, and return it. Queue items are shallow-copied.
  // Runs in `O(n)` time.


  FastPriorityQueue.prototype.clone = function () {
    var fpq = new FastPriorityQueue(this.compare);
    fpq.size = this.size;

    for (var i = 0; i < this.size; i++) {
      fpq.array.push(this.array[i]);
    }

    return fpq;
  }; // Add an element into the queue
  // runs in O(log n) time


  FastPriorityQueue.prototype.add = function (myval) {
    var i = this.size;
    this.array[this.size] = myval;
    this.size += 1;
    var p;
    var ap;

    while (i > 0) {
      p = i - 1 >> 1;
      ap = this.array[p];

      if (!this.compare(myval, ap)) {
        break;
      }

      this.array[i] = ap;
      i = p;
    }

    this.array[i] = myval;
  }; // replace the content of the heap by provided array and "heapify it"


  FastPriorityQueue.prototype.heapify = function (arr) {
    this.array = arr;
    this.size = arr.length;
    var i;

    for (i = this.size >> 1; i >= 0; i--) {
      this._percolateDown(i);
    }
  }; // for internal use


  FastPriorityQueue.prototype._percolateUp = function (i, force) {
    var myval = this.array[i];
    var p;
    var ap;

    while (i > 0) {
      p = i - 1 >> 1;
      ap = this.array[p]; // force will skip the compare

      if (!force && !this.compare(myval, ap)) {
        break;
      }

      this.array[i] = ap;
      i = p;
    }

    this.array[i] = myval;
  }; // for internal use


  FastPriorityQueue.prototype._percolateDown = function (i) {
    var size = this.size;
    var hsize = this.size >>> 1;
    var ai = this.array[i];
    var l;
    var r;
    var bestc;

    while (i < hsize) {
      l = (i << 1) + 1;
      r = l + 1;
      bestc = this.array[l];

      if (r < size) {
        if (this.compare(this.array[r], bestc)) {
          l = r;
          bestc = this.array[r];
        }
      }

      if (!this.compare(bestc, ai)) {
        break;
      }

      this.array[i] = bestc;
      i = l;
    }

    this.array[i] = ai;
  }; // internal
  // _removeAt(index) will remove the item at the given index from the queue,
  // retaining balance. returns the removed item, or undefined if nothing is removed.


  FastPriorityQueue.prototype._removeAt = function (index) {
    if (index > this.size - 1 || index < 0) return undefined; // impl1:
    //this.array.splice(index, 1);
    //this.heapify(this.array);
    // impl2:

    this._percolateUp(index, true);

    return this.poll();
  }; // remove(myval) will remove an item matching the provided value from the
  // queue, checked for equality by using the queue's comparator.
  // return true if removed, false otherwise.


  FastPriorityQueue.prototype.remove = function (myval) {
    for (var i = 0; i < this.size; i++) {
      if (!this.compare(this.array[i], myval) && !this.compare(myval, this.array[i])) {
        // items match, comparator returns false both ways, remove item
        this._removeAt(i);

        return true;
      }
    }

    return false;
  }; // internal
  // removes and returns items for which the callback returns true.


  FastPriorityQueue.prototype._batchRemove = function (callback, limit) {
    // initialize return array with max size of the limit or current queue size
    var retArr = new Array(limit ? limit : this.size);
    var count = 0;

    if (typeof callback === 'function' && this.size) {
      var i = 0;

      while (i < this.size && count < retArr.length) {
        if (callback(this.array[i])) {
          retArr[count] = this._removeAt(i);
          count++; // move up a level in the heap if we remove an item

          i = i >> 1;
        } else {
          i++;
        }
      }
    }

    retArr.length = count;
    return retArr;
  }; // removeOne(callback) will execute the callback function for each item of the queue
  // and will remove the first item for which the callback will return true.
  // return the removed item, or undefined if nothing is removed.


  FastPriorityQueue.prototype.removeOne = function (callback) {
    var arr = this._batchRemove(callback, 1);

    return arr.length > 0 ? arr[0] : undefined;
  }; // remove(callback[, limit]) will execute the callback function for each item of
  // the queue and will remove each item for which the callback returns true, up to
  // a max limit of removed items if specified or no limit if unspecified.
  // return an array containing the removed items.


  FastPriorityQueue.prototype.removeMany = function (callback, limit) {
    return this._batchRemove(callback, limit);
  }; // Look at the top of the queue (one of the smallest elements) without removing it
  // executes in constant time
  //
  // Calling peek on an empty priority queue returns
  // the "undefined" value.
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
  //


  FastPriorityQueue.prototype.peek = function () {
    if (this.size == 0) return undefined;
    return this.array[0];
  }; // remove the element on top of the heap (one of the smallest elements)
  // runs in logarithmic time
  //
  // If the priority queue is empty, the function returns the
  // "undefined" value.
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
  //
  // For long-running and large priority queues, or priority queues
  // storing large objects, you may  want to call the trim function
  // at strategic times to recover allocated memory.


  FastPriorityQueue.prototype.poll = function () {
    if (this.size == 0) return undefined;
    var ans = this.array[0];

    if (this.size > 1) {
      this.array[0] = this.array[--this.size];

      this._percolateDown(0);
    } else {
      this.size -= 1;
    }

    return ans;
  }; // This function adds the provided value to the heap, while removing
  // and returning one of the smallest elements (like poll). The size of the queue
  // thus remains unchanged.


  FastPriorityQueue.prototype.replaceTop = function (myval) {
    if (this.size == 0) return undefined;
    var ans = this.array[0];
    this.array[0] = myval;

    this._percolateDown(0);

    return ans;
  }; // recover unused memory (for long-running priority queues)


  FastPriorityQueue.prototype.trim = function () {
    this.array = this.array.slice(0, this.size);
  }; // Check whether the heap is empty


  FastPriorityQueue.prototype.isEmpty = function () {
    return this.size === 0;
  }; // iterate over the items in order, pass a callback that receives (item, index) as args.
  // TODO once we transpile, uncomment
  // if (Symbol && Symbol.iterator) {
  //   FastPriorityQueue.prototype[Symbol.iterator] = function*() {
  //     if (this.isEmpty()) return;
  //     var fpq = this.clone();
  //     while (!fpq.isEmpty()) {
  //       yield fpq.poll();
  //     }
  //   };
  // }


  FastPriorityQueue.prototype.forEach = function (callback) {
    if (this.isEmpty() || typeof callback != 'function') return;
    var i = 0;
    var fpq = this.clone();

    while (!fpq.isEmpty()) {
      callback(fpq.poll(), i++);
    }
  }; // return the k 'smallest' elements of the queue
  // runs in O(k log k) time
  // this is the equivalent of repeatedly calling poll, but
  // it has a better computational complexity, which can be
  // important for large data sets.


  FastPriorityQueue.prototype.kSmallest = function (k) {
    if (this.size == 0) return [];
    var comparator = this.compare;
    var arr = this.array;
    var fpq = new FastPriorityQueue(function (a, b) {
      return comparator(arr[a], arr[b]);
    });
    k = Math.min(this.size, k);
    var smallest = new Array(k);
    var j = 0;
    fpq.add(0);

    while (j < k) {
      var small = fpq.poll();
      smallest[j++] = this.array[small];
      var l = (small << 1) + 1;
      var r = l + 1;
      if (l < this.size) fpq.add(l);
      if (r < this.size) fpq.add(r);
    }

    return smallest;
  }; // just for illustration purposes


  var main = function () {
    // main code
    var x = new FastPriorityQueue(function (a, b) {
      return a < b;
    });
    x.add(1);
    x.add(0);
    x.add(5);
    x.add(4);
    x.add(3);

    while (!x.isEmpty()) {
      console.log(x.poll());
    }
  };

  if (commonjsRequire.main === module) {
    main();
  }

  module.exports = FastPriorityQueue;
});
/**
 * @constant {Number} RSS Feed fetch interval in ms
 */

const FETCH_INTERVAL = 5 * 60 * 1000; // waff-query flavored utils

const q = s => document.querySelector(s);

const qq = s => [...document.querySelectorAll(s)]; // NOTE: See https://github.com/wvffle/waff-query/blob/master/lib/util/selector.js for fast selector parser


const ps = s => {
  const [, tag = 'div', id, classes = ''] = s.match(/^([a-z][a-z-0-9]*)?(?:#([a-z][a-z-0-9]*))?(?:\.([a-z][a-z-0-9\.]*))?$/);
  return {
    tag,
    id,
    className: classes.replace(/\./g, '')
  };
};

const e = (s, ...c) => {
  const {
    tag,
    id,
    className
  } = ps(s);
  const el = document.createElement(tag);

  if (id) {
    el.id = id;
  }

  el.className = className;

  for (const child of c) {
    if (child === undefined) {
      continue;
    }

    el.appendChild(child instanceof HTMLElement ? child : document.createTextNode(child.toString()));
  }

  return el;
}; // NOTE: Overwriting parseURL method to automatically bypass CORS


RSSParser.prototype._parseURL = RSSParser.prototype.parseURL;

RSSParser.prototype.parseURL = function (url) {
  return this._parseURL(`https://cors-anywhere.herokuapp.com/${url}`);
}; // RSS parser


const parser = new RSSParser();
/**
 * Random utils
 */

class Random {
  /**
   * Random id
   */
  static get Id() {
    return 'x' + (Math.random() * 1e4 ^ 0).toString(16);
  }

}

class Renderer {
  constructor(rootSelector = '#app') {
    _items.set(this, {
      writable: true,
      value: new FastPriorityQueue_1((a, b) => a.date > b.date)
    });

    this.root = q(rootSelector);
  }

  add(...items) {
    for (const item of items) {
      _classPrivateFieldGet(this, _items).add(item);
    }
  }

  render() {
    for (const el of this.root.children) {
      el.remove();
    }

    _classPrivateFieldGet(this, _items).forEach(item => {
      this.root.appendChild(item.render());
    });
  }

}
/**
 * Class responsible for serialization/deserialization
 */


var _items = new WeakMap();

class Serializable {
  constructor(value) {
    this.value = value;
  }
  /**
   * Method used to serialize instance into JSON compatible object
   * @returns {Object|String|Number}
   */


  serializer() {
    return this.value;
  }
  /**
   * Method used to deserialize serialized data into a new instance
   * @returns {Serializable}
   */


  static deserializer(data) {
    return new Serializable(data);
  }
  /**
   * Serialize data
   * @returns String
   */


  serialize() {
    const className = this.value instanceof Serializable ? this.value.constructor.name : undefined;
    const value = className === undefined ? this.value : value.serializer();
    return JSON.stringify({
      className,
      value
    });
  }
  /**
   * Deserialize data
   * @returns {Object|Serializable}
   */


  static deserialize(string) {
    if (string === undefined) {
      return undefined;
    }

    const data = JSON.parse(string);

    if (data.className) {
      return core[data.className].deserializer(data.value);
    }

    return data.value;
  }

}
/**
 * Global store
 */


class Store {
  constructor() {
    this.cache = {}; // NOTE: Yeah, javascript pretty much allows to return from a constructor.
    //       I've done some crazy stuff with that in the past.

    return new Proxy(this, {
      get(target, prop) {
        if (prop[0] === '$') {
          return target[prop];
        }

        return target.cache[prop] || Serializable.deserialize(localStorage[prop]);
      },

      set(target, prop, value) {
        return target.cache = localStorage[prop] = new Serializable(value).serialize();
      }

    });
  }
  /**
   * Method called when non-primitive values is updated
   */


  $update(key) {
    this[key] = this[key];
  }

  $set(key, index, value) {
    lodash_set(this[key], index, value);
    this.$update(key);
  }

}

class RSSFeed extends Serializable {
  constructor(data) {
    super();
    this.data = data;
    this.date = new Date(data.pubDate);
  }

  render() {
    return e(`#${Random.Id}.feed`, e('h1', this.data.title), e('.text-gray-500', this.date.toLocaleString()), e('.content', this.data.content));
  }

  serializer() {
    const {
      data
    } = this;
    return {
      data
    };
  }

  static deserialize({
    data
  }) {
    return new this.constructor(data);
  }

}

class RSSFetcher {
  constructor(store) {
    if (!store.feedTypes) {
      store.feedTypes = [];
    }

    this.store = store;
  }

  addFeed(regex, Feed) {
    this.store.$set('feedTypes', store.feedTypes.length, {
      regex,
      Feed
    });
  }
  /**
   * Fetch rss feed
   */


  async fetch(url) {
    const data = await parser.parseURL(url);
    let FeedClass = RSSFeed;

    for (const {
      regex,
      Feed
    } of this.store.feedTypes) {
      if (regex.test(url)) {
        FeedClass = Feed;
        break;
      }
    }

    return data.items.map(item => new FeedClass(item));
  }

}

export { FETCH_INTERVAL, RSSFeed, RSSFetcher, Random, Renderer, Serializable, Store, e, parser, ps, q, qq };
