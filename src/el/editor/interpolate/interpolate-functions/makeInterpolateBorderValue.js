import Border from "../../property-parser/Border";
import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateLength } from "./makeInterpolateLength";
import { makeInterpolateColor } from "./makeInterpolateColor";

export function makeInterpolateBorderValue(layer, property, startValue, endValue) {
    var s = Border.parseValue(startValue);
    var e = Border.parseValue(endValue);

    var results = {
        width: makeInterpolateLength(layer, property, s.width, e.width, 'border'),
        style: makeInterpolateBoolean(layer, property, s.style, e.style),
        color: makeInterpolateColor(layer, property, s.color, e.color)
    }

    return (rate, t) => {


        return Border.joinValue({
            width: results.width(rate, t),
            style: results.style(rate, t),
            color: results.color(rate, t)
        });
    }
}


