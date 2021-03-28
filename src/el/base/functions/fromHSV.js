import { round } from './math'
import { RGBtoHSL } from './fromRGB'

/**
 * @method HSVtoRGB
 *
 * convert hsv to rgb
 *
 * 		color.HSVtoRGB(0,0,1) === #FFFFF === { r : 255, g : 0, b : 0 }
 *
 * @param {Number} H  hue color number  (min : 0, max : 360)
 * @param {Number} S  Saturation number  (min : 0, max : 1)
 * @param {Number} V  Value number 		(min : 0, max : 1 )
 * @returns {Object}
 */
export function HSVtoRGB(h, s, v) {

    if (arguments.length == 1) {
        var { h, s, v } = arguments[0];
    }

    var H = h;
    var S = s;
    var V = v;

    if (H >= 360) {
        H = 0;
    }

    const C = S * V;
    const X = C * (1 - Math.abs((H / 60) % 2 - 1));
    const m = V - C;

    let temp = [];

    if (0 <= H && H < 60) { temp = [C, X, 0]; }
    else if (60 <= H && H < 120) { temp = [X, C, 0]; }
    else if (120 <= H && H < 180) { temp = [0, C, X]; }
    else if (180 <= H && H < 240) { temp = [0, X, C]; }
    else if (240 <= H && H < 300) { temp = [X, 0, C]; }
    else if (300 <= H && H < 360) { temp = [C, 0, X]; }

    return {
        r: round((temp[0] + m) * 255),
        g: round((temp[1] + m) * 255),
        b: round((temp[2] + m) * 255)
    };
}

export function HSVtoHSL(h, s, v) {

    if (arguments.length == 1) {
        var { h, s, v } = arguments[0];
    }

    const rgb = HSVtoRGB(h, s, v);

    return RGBtoHSL(rgb.r, rgb.g, rgb.b);
}