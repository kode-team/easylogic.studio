import Color from "../../../util/Color";
import { interpolateRGB } from "../../../util/functions/mixin";

export function makeInterpolateColor (layer, property, startColor, endColor) {
    var s = Color.parse(startColor);
    var e = Color.parse(endColor);

    return (rate, t) => {

        if (t === 0) {
            return startColor; 
        } else if (t === 1) {
            return endColor;
        }

        return interpolateRGB(s, e, rate, 'rgb')
    } 
}
