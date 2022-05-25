/**
 * property 수집하기
 * 상위 클래스의 모든 property 를 수집해서 리턴한다.
 *
 * @param {Object} root  상속관계에 있는 인스턴스
 * @param {function} {filterFunction}  예외 필터
 * @returns {string[]} 나의 상위 모든 메소드를 수집해서 리턴한다.
 */
export function collectProps(root, filterFunction = () => true) {
  let p = root;
  let results = [];
  do {
    const isObject = p instanceof Object;

    if (isObject === false) {
      break;
    }

    const names = Object.getOwnPropertyNames(p).filter(filterFunction);

    results.push.apply(results, names);
  } while ((p = Object.getPrototypeOf(p)));

  return results;
}

export function debounce(callback, delay = 0) {
  if (delay === 0) {
    return callback;
  }

  var t = undefined;

  return function ($1, $2, $3, $4, $5) {
    if (t) {
      window.clearTimeout(t);
    }

    t = window.setTimeout(function () {
      callback($1, $2, $3, $4, $5);
    }, delay || 300);
  };
}

export function throttle(callback, delay) {
  var t = undefined;

  return function ($1, $2, $3, $4, $5) {
    if (!t) {
      t = window.setTimeout(function () {
        callback($1, $2, $3, $4, $5);
        t = null;
      }, delay || 300);
    }
  };
}

export function ifCheck(callback, context, checkMethods) {
  return (...args) => {
    const ifResult = checkMethods.every((check) => {
      return context[check].apply(context, args);
    });

    if (ifResult) {
      callback.apply(context, args);
    }
  };
}

export function makeRequestAnimationFrame(callback, context) {
  return (...args) => {
    window.requestAnimationFrame(() => {
      callback.apply(context, args);
    });
  };
}

export function keyEach(obj, callback) {
  Object.keys(obj).forEach((key, index) => {
    callback(key, obj[key], index);
  });
}

export function keyMap(obj, callback) {
  return Object.keys(obj).map((key, index) => {
    return callback(key, obj[key], index);
  });
}

export function keyMapJoin(obj, callback, joinString = "") {
  return keyMap(obj, callback).join(joinString);
}

export function get(obj, key, callback) {
  var returnValue = defaultValue(obj[key], key);

  if (isFunction(callback)) {
    return callback(returnValue);
  }

  return returnValue;
}

export function defaultValue(value, defaultValue) {
  return typeof value == "undefined" ? defaultValue : value;
}

export function isUndefined(value) {
  return typeof value == "undefined";
}

export function isNotUndefined(value) {
  return !isUndefined(value);
}

export function isBoolean(value) {
  return typeof value == "boolean";
}

export function isString(value) {
  return typeof value == "string";
}

export function isNotString(value) {
  return !isString(value);
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return (
    typeof value == "object" &&
    !Array.isArray(value) &&
    !isNumber(value) &&
    !isString(value) &&
    value !== null
  );
}

export function isFunction(value) {
  return typeof value == "function";
}

export function isNumber(value) {
  return typeof value == "number";
}

export function isZero(num) {
  return num === 0;
}

export function isNotZero(num) {
  return !isZero(num);
}

// const checkStructuredClone = typeof structuredClone !== 'undefined';
// const CLONE_FUNCTION = checkStructuredClone && isFunction(structuredClone) ? structuredClone : (obj) => JSON.parse(JSON.stringify(obj));
const CLONE_FUNCTION = (obj) => JSON.parse(JSON.stringify(obj));

export function clone(obj) {
  if (isUndefined(obj)) return undefined;

  return CLONE_FUNCTION(obj);
}

export function combineKeyArray(obj) {
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].join(", ");
    }
  });

  return obj;
}

/**
 * classnames('a', 'b') => 'a b'
 * classnames('a', {'b': false}) => 'a'
 * classnames('a', {'b': true}) => 'a b'
 * classnames('a', {'b': true, 'c': false}) => 'a b'
 * classnames('a', {'b': true, 'c': true}) => 'a b c'
 * classnames('a', ['10', 'value', { yellow: true }],{'b': true, 'c': true, 'd': 'foo'}) => 'a 10 value yellow b c d'
 *
 * @param  {...(string|object)} args
 * @returns
 */
export function classnames(...args) {
  const result = [];

  args.filter(Boolean).forEach((it) => {
    if (isArray(it)) {
      result.push(classnames(...it));
    } else if (isObject(it)) {
      Object.keys(it)
        .filter((k) => Boolean(it[k]))
        .forEach((key) => {
          result.push(key);
        });
    } else if (isString(it)) {
      result.push(it);
    }
  });

  return result.join(" ");
}
