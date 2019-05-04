import { round } from './math'
import { XYZtoLAB } from './fromLAB';

/**
 * @method RGBtoHSV
 *
 * convert rgb to hsv
 *
 * 		color.RGBtoHSV(0, 0, 255) === { h : 240, s : 1, v : 1 } === '#FFFF00'
 *
 * @param {Number} R  red color value
 * @param {Number} G  green color value
 * @param {Number} B  blue color value
 * @return {Object}  hsv color code
 */
export function RGBtoHSV(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }

    const R1 = r / 255;
    const G1 = g / 255;
    const B1 = b / 255;

    const MaxC = Math.max(R1, G1, B1);
    const MinC = Math.min(R1, G1, B1);

    const DeltaC = MaxC - MinC;

    var H = 0;

    if (DeltaC == 0) { H = 0; }
    else if (MaxC == R1) {
        H = 60 * (((G1 - B1) / DeltaC) % 6);
    } else if (MaxC == G1) {
        H = 60 * (((B1 - R1) / DeltaC) + 2);
    } else if (MaxC == B1) {
        H = 60 * (((R1 - G1) / DeltaC) + 4);
    }

    if (H < 0) {
        H = 360 + H;
    }

    var S = 0;

    if (MaxC == 0) S = 0;
    else S = DeltaC / MaxC;

    var V = MaxC;

    return { h: H, s: S, v: V };
}


export function RGBtoCMYK(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }

    const R1 = r / 255;
    const G1 = g / 255;
    const B1 = b / 255;

    const K = 1 - Math.max(R1, G1, B1);
    const C = (1 - R1 - K) / (1 - K);
    const M = (1 - G1 - K) / (1 - K);
    const Y = (1 - B1 - K) / (1 - K);

    return { c: C, m: M, y: Y, k: K };
}


export function RGBtoHSL(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: round(h * 360), s: round(s * 100), l: round(l * 100) };
}

export function c(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }
    return gray((r + g + b) / 3 > 90 ? 0 : 255);
}

export function gray(gray) {
    return { r: gray, g: gray, b: gray };
}

export function RGBtoSimpleGray(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }
    return gray(Math.ceil((r + g + b) / 3));
}


export function RGBtoGray(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }
    return gray(RGBtoYCrCb(r, g, b).y);
}


export function brightness(r, g, b) {
        return Math.ceil(r * 0.2126 + g * 0.7152 + b * 0.0722);
}


export function RGBtoYCrCb(r, g, b) {

    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }
    const Y = brightness(r, g, b);
    const Cb = 0.564 * (b - Y)
    const Cr = 0.713 * (r - Y)

    return { y: Y, cr: Cr, cb: Cb };
}

export function PivotRGB(n) {
    return ((n > 0.04045) ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100;
}

export function RGBtoXYZ(r, g, b) {
    //sR, sG and sB (Standard RGB) input range = 0 ÷ 255
    //X, Y and Z output refer to a D65/2° standard illuminant.
    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }

    let R = (r / 255)
    let G = (g / 255)
    let B = (b / 255)

    R = PivotRGB(R);
    G = PivotRGB(G);
    B = PivotRGB(B);

    const x = R * 0.4124 + G * 0.3576 + B * 0.1805;
    const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    return { x, y, z }
}
    
export function RGBtoLAB(r, g, b) {
    if (arguments.length == 1) {
        var { r, g, b } = arguments[0];
    }
    return XYZtoLAB(RGBtoXYZ(r, g, b));
}