import { parse, convertMatchesArray, parseGradient } from './parser'
import { round } from './math' 
import { format } from './formatter' 
import { RGBtoHSV } from './fromRGB'
import { HSVtoRGB } from './fromHSV'
import { isString, isUndefined } from './func';

/**
 * @deprecated 
 * 
 * instead of this,  use blend function 
 *  
 * @param {*} startColor 
 * @param {*} endColor 
 * @param {*} t 
 */
export function interpolateRGB(startColor, endColor, t = 0.5, exportFormat = 'hex') {
    var obj = interpolateRGBObject(startColor, endColor, t);

    return format(obj, exportFormat);

}

export function interpolateRGBObject(startColor, endColor, t = 0.5) {
    const startColorAlpha = isUndefined(startColor.a) ? 1 : startColor.a;
    const endColorAlpha = isUndefined(endColor.a) ? 1 : endColor.a;
    return {
        r: round(startColor.r + (endColor.r - startColor.r) * t),
        g: round(startColor.g + (endColor.g - startColor.g) * t),
        b: round(startColor.b + (endColor.b - startColor.b) * t),
        a: round(startColorAlpha + (endColorAlpha - startColorAlpha) * t, 100 )
    };  
}

export function scale(scale, count = 5) {
    if (!scale) return [];

    if (isString(scale)) {
        scale = convertMatchesArray(scale);
    }

    scale = scale || [];
    var len = scale.length;

    var colors = [];
    for (var i = 0; i < len - 1; i++) {
        for (var index = 0; index < count; index++) {
            colors.push(blend(scale[i], scale[i + 1], (index / count)));
        }

    }
    return colors;
}

export function blend(startColor, endColor, ratio = 0.5, format = 'hex') {
    var s = parse(startColor);
    var e = parse(endColor);

    return interpolateRGB(s, e, ratio, format);
}

export function mix(startcolor, endColor, ratio = 0.5, format = 'hex') {
    return blend(startcolor, endColor, ratio, format);
}

/**
 * 
 * @param {Color|String} c 
 */
export function contrast(c) {
    c = parse(c);
    return (Math.round(c.r * 299) + Math.round(c.g * 587) + Math.round(c.b * 114)) / 1000;
}

export function contrastColor (c) {
    return contrast(c) >= 128 ? 'black' : 'white'
}

export function gradient(colors, count = 10) {
    colors = parseGradient(colors);

    let newColors = [] 
    let maxCount = count - (colors.length - 1)
    let allCount = maxCount

    for (var i = 1, len = colors.length; i < len; i++) {

        var startColor = colors[i-1][0]
        var endColor = colors[i][0]

        var rate = i == 1 ? colors[i][1] : colors[i][1] - colors[i-1][1]

        var colorCount = (i == colors.length - 1) ? allCount : Math.floor(rate * maxCount)

        newColors = newColors.concat(scale([startColor, endColor], colorCount), [endColor])

        allCount -= colorCount
    }
    return newColors;
}

export function scaleHSV(color, target = 'h', count = 9, exportFormat = 'rgb', min = 0, max = 1, dist = 100) {
    var colorObj = parse(color);
    var hsv = RGBtoHSV(colorObj);
    var unit = ((max - min) * dist / count);

    var results = [];
    for (var i = 1; i <= count; i++) {
        hsv[target] = Math.abs((dist - unit * i) / dist);
        results.push(format(HSVtoRGB(hsv), exportFormat));
    }

    return results;
}

export function scaleH(color, count = 9, exportFormat = 'rgb', min = 0, max = 360) {
    return scaleHSV(color, 'h', count, exportFormat, min, max, 1);
}

export function scaleS(color, count = 9, exportFormat = 'rgb', min = 0, max = 1) {
    return scaleHSV(color, 's', count, exportFormat, min, max, 100);
}

export function scaleV(color, count = 9, exportFormat = 'rgb', min = 0, max = 1) {
    return scaleHSV(color, 'v', count, exportFormat, min, max, 100);
}


/* predefined scale colors */
scale.parula = function (count) {
    return scale(['#352a87', '#0f5cdd', '#00b5a6', '#ffc337', '#fdff00'], count);
};

scale.jet = function (count) {
    return scale(['#00008f', '#0020ff', '#00ffff', '#51ff77', '#fdff00', '#ff0000', '#800000'], count);
}

scale.hsv = function (count) {
    return scale(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'], count);
}

scale.hot = function (count) {
    return scale(['#0b0000', '#ff0000', '#ffff00', '#ffffff'], count);
}
scale.pink = function (count) {
    return scale(['#1e0000', '#bd7b7b', '#e7e5b2', '#ffffff'], count);
}

scale.bone = function (count) {
    return scale(['#000000', '#4a4a68', '#a6c6c6', '#ffffff'], count);
}

scale.copper = function (count) {
    return scale(['#000000', '#3d2618', '#9d623e', '#ffa167', '#ffc77f'], count);
}