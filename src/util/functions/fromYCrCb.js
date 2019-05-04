export function YCrCbtoRGB(y, cr, cb, bit) {

    if (arguments.length == 1) {
        var { y, cr, cb, bit } = arguments[0];
        bit = bit || 0;
    }
    const R = y + 1.402 * (cr - bit);
    const G = y - 0.344 * (cb - bit) - 0.714 * (cr - bit);
    const B = y + 1.772 * (cb - bit);

    return { r: Math.ceil(R), g: Math.ceil(G), b: Math.ceil(B) }
}