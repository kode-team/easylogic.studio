
import { FuncType, GradientType, TimingFunction } from "el/editor/types/model";
import { Length } from "el/editor/unit/Length";
import { clone, isArray } from "el/sapa/functions/func";
import Color from "./Color";
import ColorNames from "./ColorNames";

// order is very important (number, length, 8 digit color, 6 digit color, 3 digit color, keyword, color name)
const CSS_FUNC_REGEXP = /(([\-]?[\d.]+)(px|pt|fr|r?em|deg|vh|vw|m?s|%|g?rad|turn)?)|#(?:[\da-f]{8})|(#(?:[\da-f]{3}){1,2}|([a-z_\-]+)\([^\(\)]+\)|([a-z_\-]+))/gi;
const CSS_LENGTH_REGEXP = /^[\-]?([\d.]+)(px|pt|fr|r?em|deg|vh|vw|m?s|%|g?rad|turn)?$/gi;
const CSS_KEYWORD_REGEXP = /^[a-z_\-]+$/gi;

const GRADIENT_LIST = [
    GradientType.STATIC,
    GradientType.LINEAR,
    GradientType.RADIAL,
    GradientType.CONIC,
    GradientType.REPEATING_CONIC,
    GradientType.REPEATING_LINEAR,
    GradientType.REPEATING_RADIAL
];

const TIMIING_LIST = [
    TimingFunction.LINEAR,
    TimingFunction.EASE,
    TimingFunction.EASE_IN,
    TimingFunction.EASE_OUT,
    TimingFunction.EASE_IN_OUT,
]


const CSS_FUNC_MATCHES = (str) => {
    if (str.indexOf('#') === 0) {
        return 'hex';
    } else if (ColorNames.isColorName(str)) {
        return 'color-name';
    } else if (GRADIENT_LIST.includes(str) || TIMIING_LIST.includes(str)) {
        return str;
    } else if (str.match(CSS_LENGTH_REGEXP)) {
        return "length"
    } else if (str.match(CSS_KEYWORD_REGEXP)) {
        return "keyword";
    }
}

const findFunctionEndIndex = (allString, startIndex, funcStartCharacter = '(', funcEndCharacter = ')') => {

    const result = []
    for (var i = startIndex; i < allString.length; i++) {
        const it = allString[i];

        if (it === funcStartCharacter) {
            result.push(funcStartCharacter)
        } else if (it === funcEndCharacter) {
            result.pop();

            if (result.length === 0) {
                break;
            }
        }

    }

    return i + 1;
}

const makeFuncType = (type) => {

    if (GRADIENT_LIST.includes(type)) {
        return FuncType.GRADIENT;
    } else if (TIMIING_LIST.includes(type)) {
        return FuncType.TIMING;
    } else if (type === 'color-name') {
        return FuncType.COLOR;
    } else if (type === 'hex') {
        return FuncType.COLOR;
    } else if (type === 'length') {
        return FuncType.LENGTH;
    }

    return type;
}

/**
 * group function으로 묶어서 반환한다. 
 * 
 * parameters 를 자동으로 파싱해준다. 
 * 
 * @param {string} type  group functio name
 * @returns 
 */
const makeGroupFunction = (type) => (item, allString, funcStartCharacter = '(', funcEndCharacter = ')', parameterSaparator = ',') => {

    const matchedString = allString.substring(item.startIndex, findFunctionEndIndex(allString, item.endIndex, funcStartCharacter, funcEndCharacter))
    const matchedStringIndex = matchedString.indexOf(funcStartCharacter) + funcStartCharacter.length;
    const args = allString.substring(matchedStringIndex, matchedString.lastIndexOf(funcEndCharacter));

    const startIndex = item.startIndex;
    const endIndex = item.startIndex + matchedString.length;

    const newParsed = parseValue(args).map(it => {
        return {
            ...it,

            fullTextStartIndex: item.startIndex + matchedStringIndex + it.startIndex,
            fullTextEndIndex: item.startIndex + matchedStringIndex + it.endIndex
        }
    })

    // console.log(newParsed);

    let parameters = []

    // parameterSaparator 로 구분되어진, 특정 파라미터 구간을 얻기 위해서 
    // 개별 item 의 startIndex 를 기준으로 문자열을 특정 키로 (@@startIndex:endIndex@@)  재조합 한다. 
    let tempArgsStartIndex = 0;
    let tempArgsResults = [];
    newParsed.forEach((it, index) => {
        const startString = args.substring(tempArgsStartIndex, it.startIndex)

        tempArgsResults.push(startString);
        tempArgsResults.push(`@@${it.startIndex}:${it.endIndex}@@`);

        tempArgsStartIndex = it.endIndex;
    })

    tempArgsResults.push(args.substring(tempArgsStartIndex));

    const tempArgs = tempArgsResults.join('');

    parameters = tempArgs.split(parameterSaparator).map((it) => {
        newParsed.forEach(item => {
            it = it.replace(`@@${item.startIndex}:${item.endIndex}@@`, item.matchedString);
        })

        return it.trim();
    });

    return {
        convert: true,
        funcType: makeFuncType(type),
        type,
        startIndex,
        endIndex,
        matchedString,
        args,
        parameters,
        parsed: newParsed,
        parsedParameters: parameters.map(it => {
            return parseValue(it);
        })
    };
}

const CSS_FUNC_PARSER_MAP = {
    "length": (item) => Length.parse(item.matchedString),
    "hex": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "rgb": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "rgba": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "hsl": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "hsla": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "color-name": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    'steps': (item) => ({
        funcType: FuncType.TIMING,
        name: 'steps',
        count: +item.parameters[0],
        direction: item.parameters[1]
    }),
    'linear-gradient': makeGroupFunction('linear-gradient'),
    'radial-gradient': makeGroupFunction('radial-gradient'),
    'conic-gradient': makeGroupFunction('conic-gradient'),
    'repeating-linear-gradient': makeGroupFunction('repeating-linear-gradient'),
    'repeating-radial-gradient': makeGroupFunction('repeating-radial-gradient'),
    'repeating-conic-gradient': makeGroupFunction('repeating-conic-gradient'),
    'cubic-bezier': (item) => ({
        funcType: FuncType.TIMING,
        name: 'cubic-bezier',
        matchedString: item.matchedString,
        x1: +item.parameters[0],
        y1: +item.parameters[1],
        x2: +item.parameters[2],
        y2: +item.parameters[3]
    }),
    'ease': (item) => ({ funcType: FuncType.TIMING, name: 'ease', matchedString: item.matchedString, x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 }),
    'ease-in': (item) => ({ funcType: FuncType.TIMING, name: 'ease-in', matchedString: item.matchedString, x1: 0.42, y1: 0, x2: 1, y2: 1 }),
    'ease-out': (item) => ({ funcType: FuncType.TIMING, name: 'ease-out', matchedString: item.matchedString, x1: 0, y1: 0, x2: 0.58, y2: 1 }),
    'ease-in-out': (item) => ({ funcType: FuncType.TIMING, name: 'ease-in-out', matchedString: item.matchedString, x1: 0.42, y1: 0, x2: 0.58, y2: 1 }),
    'linear': (item) => ({ funcType: FuncType.TIMING, name: 'linear', matchedString: item.matchedString, x1: 0, y1: 0, x2: 1, y2: 1 }),
}

export function makeIndexString(it, prefix = '@') {
    return `${prefix}${it.startIndex}`.padEnd(10, '0');
}

export function parseValue(str, {
    funcStartCharacter = '(',
    funcEndCharacter = ')',
    parameterSaparator = ',',
    customFuncMap = {}
} = {}) {
    const matches = str.match(CSS_FUNC_REGEXP);
    let result = [];

    if (!matches) {
        return result;
    }

    function checkParsedResult(startIndex, endIndex, matchedString) {
        return result.some(it => {

            if (it.parsed && isArray(it.parsed)) {
                return it.parsed.some(parsedIt => {
                    if (parsedIt.startIndex === startIndex && parsedIt.endIndex === endIndex && matchedString === parsedIt.matchedString) {
                        return true;
                    }

                    return false;
                })
            }

            if (it.startIndex === startIndex && it.endIndex === endIndex && matchedString === it.matchedString) {
                return true;
            }

            return false;
        })
    }

    var pos = { next: 0 }
    for (var i = 0, len = matches.length; i < len; i++) {
        const matchedString = matches[i];

        let parsedFunc = CSS_FUNC_MATCHES(matchedString);

        let item = {
            matchedString,
        }

        const startIndex = str.indexOf(item.matchedString, pos.next);

        if (startIndex < 0) {
            continue;
        }

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.matchedString.length;

        if (checkParsedResult(item.startIndex, item.endIndex, item.matchedString)) {
            continue;
        }


        if (parsedFunc) {
            // NOOP 
            // 매칭 되는 문자열은 자체 파서를 가진다. 
            item = {
                ...item,
                func: parsedFunc,
            }
        } else {
            const [func, rest] = matchedString.split(funcStartCharacter)
            const [args] = rest.split(funcEndCharacter);

            item = {
                ...item,
                func,
                args,
                parameters: args.split(parameterSaparator).map(it => it.trim()),
            }
            parsedFunc = func;
        }


        if (CSS_FUNC_PARSER_MAP[parsedFunc]) {
            item.parsed = CSS_FUNC_PARSER_MAP[parsedFunc].call(null, item, str, funcStartCharacter, funcEndCharacter, parameterSaparator);

            if (item.parsed?.convert) {
                item = {
                    ...item,
                    ...item.parsed
                }

                delete item.convert;
            }
        } else if (customFuncMap[parsedFunc]) {
            item.parsed = customFuncMap[parsedFunc].call(null, item, str, funcStartCharacter, funcEndCharacter, parameterSaparator);
            if (item.parsed?.convert) {
                item = {
                    ...item,
                    ...item.parsed
                }

                delete item.convert;
            }
        }

        result.push(item);
        pos.next = item.endIndex;
        // i = item.endIndex - 1;
    }

    return result;
}

export function parseOneValue(str) {
    return parseValue(str)[0]
}

export function parseGroupValue(str, customMapFuncName = 'temp') {
    return parseValue(`${customMapFuncName}(${str})`, {
        customFuncMap: {
            [customMapFuncName]: makeGroupFunction(customMapFuncName)
        }

    });
}

