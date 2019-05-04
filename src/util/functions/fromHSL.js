import { RGBtoHSV } from './fromRGB'
import { round } from './math'

export function HUEtoRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

export function HSLtoHSV(h, s, l) {

    if (arguments.length == 1) {
        var { h, s, l } = arguments[0];
    }
    const rgb = HSLtoRGB(h, s, l);

    return RGBtoHSV(rgb.r, rgb.g, rgb.b);
}

export function HSLtoRGB(h, s, l) {

    if (arguments.length == 1) {
        var { h, s, l } = arguments[0];
    }

    var r, g, b;

    h /= 360;
    s /= 100;
    l /= 100;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = HUEtoRGB(p, q, h + 1 / 3);
        g = HUEtoRGB(p, q, h);
        b = HUEtoRGB(p, q, h - 1 / 3);
    }

    return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
}