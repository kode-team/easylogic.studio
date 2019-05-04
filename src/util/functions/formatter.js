import { isUndefined, isArray } from "./func";

/**
 * @method format
 *
 * convert color to format string
 *
 *     // hex
 *     color.format({ r : 255, g : 255, b : 255 }, 'hex')  // #FFFFFF
 *
 *     // rgb
 *     color.format({ r : 255, g : 255, b : 255 }, 'rgb') // rgba(255, 255, 255, 0.5);
 *
 *     // rgba
 *     color.format({ r : 255, g : 255, b : 255, a : 0.5 }, 'rgb') // rgba(255, 255, 255, 0.5);
 *
 * @param {Object} obj  obj has r, g, b and a attributes
 * @param {"hex"/"rgb"} type  format string type
 * @returns {*}
 */
export function format(obj, type, defaultColor = 'rgba(0, 0, 0, 0)') {

    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] }
    }

    if (type == 'hex') {
        return hex(obj);
    } else if (type == 'rgb') {
        return rgb(obj, defaultColor);
    } else if (type == 'hsl') {
        return hsl(obj);
    }

    return obj;
}

export function hex(obj) {
    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] }
    }

    var r = obj.r.toString(16);
    if (obj.r < 16) r = "0" + r;

    var g = obj.g.toString(16);
    if (obj.g < 16) g = "0" + g;

    var b = obj.b.toString(16);
    if (obj.b < 16) b = "0" + b;

    return `#${r}${g}${b}`;
}

export function rgb (obj, defaultColor = 'rgba(0, 0, 0, 0)') {
    if (isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] }
    }

    if (isUndefined( obj ) ) {
        return undefined;
    }

    if (obj.a == 1 || isUndefined( obj.a ) ) {
        if (isNaN(obj.r)) {
            return defaultColor;
        }
        return `rgb(${obj.r},${obj.g},${obj.b})`;
    } else {
        return `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;
    }
}

export function hsl (obj) {
    if (isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] }
    }

    if (obj.a == 1 || isUndefined( obj.a )) {
        return `hsl(${obj.h},${obj.s}%,${obj.l}%)`;
    } else {
        return `hsla(${obj.h},${obj.s}%,${obj.l}%,${obj.a})`;
    }

}