
export function CMYKtoRGB(c, m, y, k) {

    if (arguments.length == 1) {
        var { c, m, y, k } = arguments[0];
    }

    const R = 255 * (1 - c) * (1 - k);
    const G = 255 * (1 - m) * (1 - k);
    const B = 255 * (1 - y) * (1 - k);

    return { r: R, g: G, b: B }
}