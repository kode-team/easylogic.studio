
import { FuncType, GradientType, TimingFunction } from "el/editor/types/model";
import { Length } from "el/editor/unit/Length";
import { clone, isArray } from "el/sapa/functions/func";
import Color from "./Color";
import ColorNames from "./ColorNames";

// order is very important (number, length, 8 digit color, 6 digit color, 3 digit color, keyword, color name)
const CSS_FUNC_REGEXP = /(([\-]?[\d.]+)(px|pt|fr|r?em|deg|vh|vw|m?s|%|g?rad|turn)?)|#(?:[\da-f]{8})|(#(?:[\da-f]{3}){1,2}|([a-z_\-]+)\([^\(\)]+\)|([a-z_\-]+))|(\,)/gi;
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
    if (str === ',') {
        return 'comma';
    } else if (str.indexOf('#') === 0) {
        return 'hex';
    } else if (ColorNames.isColorName(str)) {
        return 'color';
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

    if (result.length > 0) {
        return -1;
    }

    return i + 1;
}

const makeFuncType = (type) => {

    if (GRADIENT_LIST.includes(type)) {
        return FuncType.GRADIENT;
    } else if (TIMIING_LIST.includes(type)) {
        return FuncType.TIMING;
    } else if (type === 'color') {
        return FuncType.COLOR;
    } else if (type === 'hex') {
        return FuncType.COLOR;
    } else if (type === 'length') {
        return FuncType.LENGTH;
    } else if (type === 'comma') {
        return FuncType.COMMA;
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
export const makeGroupFunction = (type) => (item, allString, funcStartCharacter = '(', funcEndCharacter = ')', parameterSaparator = ',') => {

    const lastIndex = findFunctionEndIndex(allString, item.startIndex, funcStartCharacter, funcEndCharacter);

    if (lastIndex === -1) {
        return {
            convert: true,
            funcType: makeFuncType(type),
            matchedString: allString,
            type,
            startIndex: item.startIndex,
            endIndex: item.startIndex + allString.length,
        };
    }

    const matchedString = allString.substring(item.startIndex, lastIndex)
    const matchedStringIndex = matchedString.indexOf(funcStartCharacter) + funcStartCharacter.length;
    const args = allString.substring(item.startIndex + matchedStringIndex, item.startIndex + matchedString.lastIndexOf(funcEndCharacter));

    const startIndex = item.startIndex;
    const endIndex = item.startIndex + matchedString.length;

    const newParsed = parseValue(args).map(it => {
        return {
            ...it,

            fullTextStartIndex: item.startIndex + matchedStringIndex + it.startIndex,
            fullTextEndIndex: item.startIndex + matchedStringIndex + it.endIndex
        }
    })


    let parameters = []
    let commaIndex = 0;

    newParsed.forEach((it, index) => {

        if (it.func === FuncType.COMMA) {
            commaIndex++;
        } else {
            if (!parameters[commaIndex]) parameters[commaIndex] = [];
            parameters[commaIndex].push(it);
        }

    })

    return {
        convert: true,
        funcType: makeFuncType(type),
        type,
        startIndex,
        endIndex,
        matchedString,
        args,
        parameters: parameters
    };
}

const CSS_FUNC_PARSER_MAP = {
    "length": (item) => Length.parse(item.matchedString),
    "hex": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "rgb": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "rgba": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "hsl": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "hsla": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    "color": (item) => ({ funcType: FuncType.COLOR, ...Color.parse(item.matchedString) }),
    'steps': (item) => ({
        funcType: FuncType.TIMING,
        name: TimingFunction.STEPS,
        count: +item.parameters[0],
        direction: item.parameters[1]
    }),
    'path': (item) => ({
        funcType: FuncType.TIMING,
        name: TimingFunction.PATH,
        d: item.args
    }),
    'static-gradient': makeGroupFunction('static-gradient'),
    'linear-gradient': makeGroupFunction('linear-gradient'),
    'radial-gradient': makeGroupFunction('radial-gradient'),
    'conic-gradient': makeGroupFunction('conic-gradient'),
    'repeating-linear-gradient': makeGroupFunction('repeating-linear-gradient'),
    'repeating-radial-gradient': makeGroupFunction('repeating-radial-gradient'),
    'repeating-conic-gradient': makeGroupFunction('repeating-conic-gradient'),
    'cubic-bezier': (item) => ({
        funcType: FuncType.TIMING,
        name: TimingFunction.CUBIC_BEZIER,
        matchedString: item.matchedString,
        x1: +item.parameters[0],
        y1: +item.parameters[1],
        x2: +item.parameters[2],
        y2: +item.parameters[3]
    }),
    'ease': (item) => ({ funcType: FuncType.TIMING, name: TimingFunction.EASE, matchedString: item.matchedString, x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 }),
    'ease-in': (item) => ({ funcType: FuncType.TIMING, name: TimingFunction.EASE_IN, matchedString: item.matchedString, x1: 0.42, y1: 0, x2: 1, y2: 1 }),
    'ease-out': (item) => ({ funcType: FuncType.TIMING, name: TimingFunction.EASE_OUT, matchedString: item.matchedString, x1: 0, y1: 0, x2: 0.58, y2: 1 }),
    'ease-in-out': (item) => ({ funcType: FuncType.TIMING, name: TimingFunction.EASE_IN_OUT, matchedString: item.matchedString, x1: 0.42, y1: 0, x2: 0.58, y2: 1 }),
    'linear': (item) => ({ funcType: FuncType.TIMING, name: TimingFunction.LINEAR, matchedString: item.matchedString, x1: 0, y1: 0, x2: 1, y2: 1 }),
}

export function parseValue(str, {
    funcStartCharacter = '(',
    funcEndCharacter = ')',
    parameterSaparator = ',',
    customFuncMap = {}
} = {}) {
    let matches = str.match(CSS_FUNC_REGEXP);
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

    // 실행되는 그룹을 위한 시간 설정 
    var point = Date.now();

    // 파싱된 text 들의 개별 시작점 위치를 배열에 저장 
    matches = matches.map(matchedString => {
        const startIndex = str.indexOf(matchedString, pos.next);

        pos.next = startIndex + matchedString.length;
        return {index: startIndex, matchedString}
    })

    pos.next = 0;

    for (var i = 0, len = matches.length; i < len; i++) {
        const {matchedString, index} = matches[i];

        // index 가 point.next 보다 작으면 그냥 넘어감
        // 이미 group 파싱이나 다른 것으로 인해서 파싱 된 상태 이므로 넘어감
        if (index < pos.next) continue;

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

        const isContinue = checkParsedResult(item.startIndex, item.endIndex, item.matchedString)

        if (isContinue) {
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

        // 미리 정의된 custom 함수를 찾는다. 
        let customFunctionCallback;
        if (CSS_FUNC_PARSER_MAP[parsedFunc]) {
            customFunctionCallback = CSS_FUNC_PARSER_MAP[parsedFunc] || CSS_FUNC_PARSER_MAP[item.matchedString]
        } else if (customFuncMap[parsedFunc] || customFuncMap[item.matchedString]) {
            customFunctionCallback = customFuncMap[parsedFunc] || customFuncMap[item.matchedString]
        }

        if (customFunctionCallback) {
            const parsed = customFunctionCallback.call(null, item, str, funcStartCharacter, funcEndCharacter, parameterSaparator);

            if (parsed?.convert) {
                item = {
                    ...item,
                    ...parsed
                }
    
                delete item.convert;
            } else {
                item = {
                    ...item,
                    parsed
                }
            }
    
        }

        result.push(item);
        pos.next = item.endIndex;
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
    })[0]?.parameters;
}

