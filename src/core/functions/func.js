import { randomNumber } from "./create";
import { getPredefinedCubicBezier } from "./bezier";


/**
 * property 수집하기
 * 상위 클래스의 모든 property 를 수집해서 리턴한다.
 * 
 * @param {Object} root  상속관계에 있는 인스턴스 
 * @param {Object} expectMethod 제외될 필드 리스트 { [field]: true }
 * @returns {string[]} 나의 상위 모든 메소드를 수집해서 리턴한다. 
 */
export function collectProps(root, expectMethod = {}) {

    let p = root.__proto__;
    let results = [];
    do {
      const isObject = p instanceof Object;

      if (isObject === false) {
        break;
      }
      const names = Object.getOwnPropertyNames(p).filter(name => {
        return root && isFunction(root[name]) && !expectMethod[name];
      });

      results.push.apply(results, names);
      p = p.__proto__;
    } while (p);

    return results;
  }

export function debounce (callback, delay = 0) {

    if (delay === 0) {
        return callback;
    }

    var t = undefined;

    return function ($1, $2, $3, $4, $5) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback($1, $2, $3, $4, $5);
        }, delay || 300);
    }
}
  

export function throttle (callback, delay) {

    var t = undefined;

    return function ($1, $2, $3, $4, $5) {
        if (!t) {
            t = setTimeout(function () {
                callback($1, $2, $3, $4, $5);
                t = null; 
            }, delay || 300);
        }

    }
}

export function keyEach (obj, callback) {
    Object.keys(obj).forEach( (key, index) => {
        callback (key, obj[key], index);
    })
}

export function keyMap (obj, callback) {
    return Object.keys(obj).map( (key, index) => {
        return callback (key, obj[key], index);
    })
}

export function keyMapJoin (obj, callback, joinString = '') {
    return keyMap(obj, callback).join(joinString);
}

export function get(obj, key, callback) {
    
    var returnValue = defaultValue(obj[key], key);

    if (isFunction( callback ) ) {
        return callback(returnValue);
    }

    return returnValue; 
}

export function defaultValue (value, defaultValue) {
    return typeof value == 'undefined' ? defaultValue : value;
}

export function isUndefined (value) {
    return typeof value == 'undefined' || value === null;
}

export function isNotUndefined (value) {
    return isUndefined(value) === false;
}

export function isArray (value) {
    return Array.isArray(value);
}

export function isBoolean (value) {
    return typeof value == 'boolean'
}

export function isString (value) {
    return typeof value == 'string'
}

export function isNotString (value) {
    return isString(value) === false;
}

export function isObject (value) {
    return typeof value == 'object' && !isArray(value) && !isNumber(value) && !isString(value)  && value !== null; 
}

export function isFunction (value) {
    return typeof value == 'function'
}

export function isNumber (value) {
    return typeof value == 'number';
}

export function isZero (num) {
    return num === 0;
}

export function isNotZero (num) {
    return !isZero(num);
}

export function clone (obj) {
    if (isUndefined(obj)) return undefined;
    return JSON.parse(JSON.stringify(obj));
}

export function cleanObject (obj) {
    var realObject = {}
    Object.keys(obj).filter(key => {
        return !!obj[key]
    }).forEach(key => {
        realObject[key] = obj[key]
    });

    return realObject;
}

export function combineKeyArray (obj) {
    Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].join(', ')
        }
    })

    return obj;
}

export function repeat (count) {
    return [...Array(count)];
}

export function randomItem (...args) {
    return args[randomNumber(0, args.length-1)];
}


const short_tag_regexp = /\<(\w*)([^\>]*)\/\>/gim;

const HTML_TAG = {
    'image': true,
    'input': true,
    'br': true,
    'path': true,
    'line': true,
    'circle': true,
    'rect': true,
    'path': true, 
    'polygon': true,
    'polyline': true,
    'use': true
}


export const html = (strings, ...args) => {

    var results =  strings.map((it, index) => {
        
        var results = args[index] || ''

        if (isFunction(results)) {
            results = results()
        }

        if (!isArray(results)) {
            results = [results]
        }

        results = results.join('')

        return it + results;
    }).join('');

    results = results.replace(short_tag_regexp, function (match, p1) {
        if (HTML_TAG[p1.toLowerCase()]) {
            return match;
        } else {
            return match.replace('/>', `></${p1}>`)
        }
    })

    return results; 
}

export function CSS_TO_STRING(style, postfix = '') {
    var newStyle = style || {};
  
    return Object.keys(newStyle)
      .filter(key => isNotUndefined(newStyle[key]))
      .map(key => `${key}: ${newStyle[key]}`)
      .join(";" + postfix);
}
  

export function STRING_TO_CSS (str = '', splitChar = ';', keySplitChar = ':') {

    str = str + "";

    var style = {}

    if (str === '') return style;

    str.split(splitChar).forEach(it => {
       var [key, ...value] = it.split(keySplitChar).map(it => it.trim())
       if (key != '') {
        style[key] = value.join(keySplitChar); 
       }
    })

    return style;
}

export function OBJECT_TO_PROPERTY (obj) {
    return Object.keys(obj).map(key => {

        if (key === 'class') {
            if (isObject(obj[key])) {
                return `${key}="${OBJECT_TO_CLASS(obj[key])}"`
            }
        }

        if (isBoolean(obj[key]) || isUndefined(obj[key]) || obj[key] === 'undefined') {
            if (obj[key]) {
                return key;
            } else {
                return '';
            }
        } 

        return `${key}="${obj[key]}"`
    }).join(' ');
}

export function OBJECT_TO_CLASS (obj) {
    return Object.keys(obj).filter(k => obj[k]).map(key => {
        return key
    }).join(' ');
}

export function TAG_TO_STRING (str) {
    return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 
}

export function mapjoin(arr, callback, joinString = '') {
    return arr.map(callback).join(joinString);
}

export function isArrayEquals (A, B) {
    const s = new Set([...A, ...B])

    return s.size === A.length && s.size === B.length;
}

/**
 * 전체 문자열에서 특정 키워드 함수를 사용하는 패턴을 찾아 리턴해준다. 
 * 
 * @param {string[]} arr 
 * @param {string} keyword 
 */
export const splitMethodByKeyword = (arr, keyword) => {
    const filterKeys = arr.filter(code => code.indexOf(`${keyword}(`) > -1);
    const filterMaps = filterKeys.map(code => {
      const [target, param] = code
        .split(`${keyword}(`)[1]
        .split(")")[0]
        .trim()
        .split(" ");
  
      return { target, param };
    });
  
    return [filterKeys, filterMaps];
};

export const curveToPath = (timingFunction, width = 30, height = 30) => {
    const currentBezier = getPredefinedCubicBezier(timingFunction)
    
    return `
        M0 ${width} 
        C 
        ${currentBezier[0] * width} ${currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height},
        ${currentBezier[2] * width} ${currentBezier[3] == 1 ? 0 : (1 - currentBezier[3] ) * height},
        ${width} 0
    `
}

export const curveToPointLine = (timingFunction, width = 30, height = 30) => {
    const currentBezier = getPredefinedCubicBezier(timingFunction)
    
    return `
        M 0 ${width} 
        L ${currentBezier[0] * width} ${currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height}
        M ${width} 0
        L ${currentBezier[2] * width} ${currentBezier[3] == 1 ? 0 : (1 - currentBezier[3] ) * height}
    `
}