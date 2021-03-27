import Color from "@sapa/Color";
import { interpolateRGB } from "@sapa/functions/mixin";

export function makeInterpolateColor (layer, property, startColor, endColor) {
    var s = Color.parse(startColor || 'rgba(0, 0, 0, 1)');
    var e = Color.parse(endColor || 'rgba(0, 0, 0, 1)');

    return (rate, t) => {

        if (t === 0) {
            return startColor; 
        } else if (t === 1) {
            return endColor;
        }

        return interpolateRGB(s, e, rate, 'rgb')
    } 
}
