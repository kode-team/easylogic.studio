import ColorNames from '../ColorNames'

import { RGBtoHSL } from './fromRGB'
import { HSLtoRGB } from './fromHSL'
import { isString, isNumber } from './func';

const color_regexp = /(#(?:[\da-f]{3}){1,2}|#(?:[\da-f]{8})|rgb\((?:\s*\d{1,3},\s*){2}\d{1,3}\s*\)|rgba\((?:\s*\d{1,3},\s*){3}\d*\.?\d+\s*\)|hsl\(\s*\d{1,3}(?:,\s*\d{1,3}%){2}\s*\)|hsla\(\s*\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\s*\)|([\w_\-]+))/gi;

export function getColorIndexString(it, prefix = '@' ) {
    return `${prefix}${it.startIndex}`.padEnd(10, '0');
}

export function isColor (str) {
    const results = matches(str);

    return !!results.length
}

export function matches (str) {
    const matches = str.match(color_regexp);
    let result = [];

    if (!matches) {
        return result;
    }

    for (var i = 0, len = matches.length; i < len; i++) {

        if (matches[i].indexOf('#') > -1 || matches[i].indexOf('rgb') > -1 || matches[i].indexOf('hsl') > -1) {
            result.push({ color: matches[i] });
        } else {
            var nameColor = ColorNames.getColorByName(matches[i]);

            if (nameColor) {
                result.push({ color: matches[i], nameColor: nameColor });
            }
        }
    }

    var pos = { next: 0 }
    result.forEach(item => {
        const startIndex = str.indexOf(item.color, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.color.length;

        pos.next = item.endIndex;
    });

    return result;
}

export function convertMatches (str) {
    const m = matches(str); 

    m.forEach(it => {
        str = str.replace(it.color, getColorIndexString(it))
    })

    return { str, matches: m }
}


export function convertMatchesArray (str, splitStr = ',') {
    const ret = convertMatches(str);
    return ret.str.split(splitStr).map((it, index) => {
        it = trim(it);

        if (ret.matches[index]) {
            it = it.replace(getColorIndexString(ret.matches[index]), ret.matches[index].color)
        }

        return it 
    })
}

export function reverseMatches (str, matches) {
    matches.forEach(it => {
        str = str.replace(getColorIndexString(it), it.color)
    })

    return str;
}

const REG_TRIM = /^\s+|\s+$/g
export function trim (str) {
    return str.replace(REG_TRIM, '');
}

/**
 * @method rgb
 *
 * parse string to rgb color
 *
 * 		color.parse("#FF0000") === { r : 255, g : 0, b : 0 }
 * 		color.parse("#FF0000FF") === { r : 255, g : 0, b : 0, a: 1 }
 *
 * 		color.parse("rgb(255, 0, 0)") == { r : 255, g : 0, b :0 }
 * 		color.parse(0xff0000) == { r : 255, g : 0, b : 0 }
 * 		color.parse(0xff000000) == { r : 255, g : 0, b : 0, a: 0 }
 *
 * @param {String} str color string
 * @returns {Object}  rgb object
 */
export function parse(str) {
    if (isString(str)) {

        if (ColorNames.isColorName(str)) {
            str = ColorNames.getColorByName(str);
        }

        if (str.indexOf("rgb(") > -1) {
            var arr = str.replace("rgb(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i] = parseInt(trim(arr[i]), 10);
            }

            var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: 1 };

            obj = {...obj, ...RGBtoHSL(obj)};

            return obj;
        } else if (str.indexOf("rgba(") > -1) {
            var arr = str.replace("rgba(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {

                if (len - 1 == i) {
                    arr[i] = parseFloat(trim(arr[i]));
                } else {
                    arr[i] = parseInt(trim(arr[i]), 10);
                }
            }

            var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: arr[3] };

            obj = {...obj, ...RGBtoHSL(obj)};

            return obj;

        } else if (str.indexOf("hsl(") > -1) {
            var arr = str.replace("hsl(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i] = parseFloat(trim(arr[i]));
            }

            var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: 1 };

            obj = {...obj, ...HSLtoRGB(obj)};

            return obj;
        } else if (str.indexOf("hsla(") > -1) {
            var arr = str.replace("hsla(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {

                if (len - 1 == i) {
                    arr[i] = parseFloat(trim(arr[i]));
                } else {
                    arr[i] = parseInt(trim(arr[i]), 10);
                }
            }

            var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: arr[3] };

            obj = {...obj, ...HSLtoRGB(obj)};

            return obj;
        } else if (str.indexOf("#") == 0) {

            str = str.replace("#", "");
            var arr = [];
            var a = 1; 
            if (str.length == 3) {
                for (var i = 0, len = str.length; i < len; i++) {
                    var char = str.substr(i, 1);
                    arr.push(parseInt(char + char, 16));
                }
            } else if (str.length === 8) {
                for (var i = 0, len = str.length; i < len; i += 2) {
                    arr.push(parseInt(str.substr(i, 2), 16));
                }

                a = arr.pop() / 255             
            } else {
                for (var i = 0, len = str.length; i < len; i += 2) {
                    arr.push(parseInt(str.substr(i, 2), 16));
                }
            }

            var obj = { type: 'hex', r: arr[0], g: arr[1], b: arr[2], a };

            obj = {...obj, ...RGBtoHSL(obj)};

            return obj;
        }
    } else if (isNumber( str )) {
        if (0x000000 <= str && str <= 0xffffff) {
            const r = (str & 0xff0000) >> 16;
            const g = (str & 0x00ff00) >> 8;
            const b = (str & 0x0000ff) >> 0;

            var obj = { type: 'hex', r, g, b, a: 1 };
            obj = { ...obj, ...RGBtoHSL(obj)};
            return obj;
        } else if (0x00000000 <= str && str <= 0xffffffff) {
            const r = (str & 0xff000000) >> 24;
            const g = (str & 0x00ff0000) >> 16;
            const b = (str & 0x0000ff00) >> 8;
            const a = (str & 0x000000ff) / 255;

            var obj = { type: 'hex', r, g, b, a };
            obj = {...obj, ...RGBtoHSL(obj)};
            
            return obj;
        }
    }

    return str;

}

export function parseGradient (colors) {
    if (isString( colors )) {
        colors = convertMatchesArray(colors);
    }

    colors = colors.map(it => {
        if (isString( it )) {
            const ret = convertMatches(it)
            let arr = trim(ret.str).split(' ');

            if (arr[1]) {
                if (arr[1].indexOf('%') > -1) {
                    arr[1] = parseFloat(arr[1].replace(/%/, ''))/100
                } else {
                    arr[1] = parseFloat(arr[1])
                }

            } else {
                arr[1] = '*'
            }

            arr[0] = reverseMatches(arr[0], ret.matches)

            return arr;
        } else if (Array.isArray(it)) {

            if (!it[1]) {
                it[1] = '*'
            } else if (isString( it[1] ) ) {
                if (it[1].indexOf('%') > -1) {
                    it[1] = parseFloat(it[1].replace(/%/, ''))/100
                } else {
                    it[1] = +it[1]
                }
            }

            return [...it]; 
        }
    })

    const count = colors.filter(it => {
        return it[1] === '*'
    }).length

    if (count > 0) {
        const sum = colors.filter(it => {
            return it[1] != '*' && it[1] != 1
        }).map(it => it[1]).reduce((total, cur) => {
            return total + cur
        } , 0)
        
        const dist = (1 - sum) / count  
        colors.forEach((it, index) => {
            if (it[1] == '*' && index > 0) {
                if (colors.length - 1 == index) {
                    // it[1] = 1 
                } else {
                    it[1] = dist 
                }
            }
        })

    }

    return colors; 
}