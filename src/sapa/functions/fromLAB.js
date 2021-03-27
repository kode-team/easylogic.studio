import { round } from './math'

export function ReverseXyz(n) {
    return (Math.pow(n, 3) > 0.008856) ? Math.pow(n, 3) : (n - 16 / 116) / 7.787;
}

export function ReverseRGB(n) {
    return (n > 0.0031308) ? 1.055 * (Math.pow(n, (1 / 2.4))) - 0.055 : 12.92 * n;
}

export function XYZtoRGB(x, y, z) {
    if (arguments.length == 1) {
        var { x, y, z } = arguments[0];
    }
    //X, Y and Z input refer to a D65/2° standard illuminant.
    //sR, sG and sB (standard RGB) output range = 0 ÷ 255

    let X = x / 100.0
    let Y = y / 100.0
    let Z = z / 100.0

    let R = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
    let G = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
    let B = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

    R = ReverseRGB(R);
    G = ReverseRGB(G);
    B = ReverseRGB(B);

    const r = round(R * 255);
    const g = round(G * 255);
    const b = round(B * 255);

    return { r, g, b };
}

export function LABtoXYZ(l, a, b) {
    if (arguments.length == 1) {
        var { l, a, b } = arguments[0];
    }
    //Reference-X, Y and Z refer to specific illuminants and observers.
    //Common reference values are available below in this same page.

    let Y = (l + 16) / 116
    let X = a / 500 + Y
    let Z = Y - b / 200

    Y = ReverseXyz(Y);
    X = ReverseXyz(X);
    Z = ReverseXyz(Z);

    const x = X * 95.047
    const y = Y * 100.000
    const z = Z * 108.883

    return { x, y, z };
}

export function PivotXyz(n) {
    return (n > 0.008856) ? Math.pow(n, (1 / 3)) : (7.787 * n + 16) / 116;
}


export function XYZtoLAB(x, y, z) {
    if (arguments.length == 1) {
        var { x, y, z } = arguments[0];
    }

    //Reference-X, Y and Z refer to specific illuminants and observers.
    //Common reference values are available below in this same page.
    // Observer= 2°, Illuminant= D65

    let X = x / 95.047;
    let Y = y / 100.00;
    let Z = z / 108.883;

    X = PivotXyz(X);
    Y = PivotXyz(Y);
    Z = PivotXyz(Z);

    const l = (116 * Y) - 16;
    const a = 500 * (X - Y);
    const b = 200 * (Y - Z);

    return { l, a, b };
}

export function LABtoRGB(l, a, b) {
    if (arguments.length == 1) {
        var { l, a, b } = arguments[0];
    }
    return XYZtoRGB(LABtoXYZ(l, a, b));
}