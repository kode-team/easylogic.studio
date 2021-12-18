import { isBoolean, isNotUndefined, isObject, isUndefined } from "el/sapa/functions/func";
import { getPredefinedCubicBezier } from "./bezier";
import { randomNumber } from "./create";

export function randomItem(...args) {
    return args[randomNumber(0, args.length - 1)];
}


export function repeat(count) {
    return [...Array(count)];
}



export function CSS_TO_STRING(style, postfix = '') {
    var newStyle = style || {};

    return Object.keys(newStyle)
        .filter(key => isNotUndefined(newStyle[key]))
        .map(key => `${key}: ${newStyle[key]}`)
        .join(";" + postfix);
}


export function STRING_TO_CSS(str = '', splitChar = ';', keySplitChar = ':') {

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

export function OBJECT_TO_PROPERTY(obj) {
    const target = obj || {};

    return Object.keys(target).map(key => {

        if (key === 'class') {
            if (isObject(obj[key])) {
                return `${key}="${OBJECT_TO_CLASS(obj[key])}"`
            }
        }

        if (key === 'style') {
            if (isObject(obj[key])) {
                return `${key}="${CSS_TO_STRING(obj[key])}"`
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

export function OBJECT_TO_CLASS(obj) {
    return Object.keys(obj).filter(k => obj[k]).map(key => {
        return key
    }).join(' ');
}

export function TAG_TO_STRING(str) {
    return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
}

export function mapjoin(arr, callback, joinString = '') {
    return arr.map(callback).join(joinString);
}

export function isArrayEquals(A, B) {
    const s = new Set([...A, ...B])

    return s.size === A.length && s.size === B.length;
}

export const curveToPath = (timingFunction, width = 30, height = 30) => {
    const currentBezier = getPredefinedCubicBezier(timingFunction)

    return `
        M0 ${width} 
        C 
        ${currentBezier[0] * width} ${currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height},
        ${currentBezier[2] * width} ${currentBezier[3] == 1 ? 0 : (1 - currentBezier[3]) * height},
        ${width} 0
    `
}

export const curveToPointLine = (timingFunction, width = 30, height = 30) => {
    const currentBezier = getPredefinedCubicBezier(timingFunction)

    return `
        M 0 ${width} 
        L ${currentBezier[0] * width} ${currentBezier[1] == 0 ? height : (1 - currentBezier[1]) * height}
        M ${width} 0
        L ${currentBezier[2] * width} ${currentBezier[3] == 1 ? 0 : (1 - currentBezier[3]) * height}
    `
}