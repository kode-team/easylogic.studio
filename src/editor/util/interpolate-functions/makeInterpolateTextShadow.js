import { makeInterpolateLength } from "./makeInterpolateLength";
import { makeInterpolateColor } from "./makeInterpolateColor";
import { TextShadow } from "../../css-property/TextShadow";

export function makeInterpolateTextShadow(layer, property, startValue, endValue) {
    var s = TextShadow.parseStyle(startValue);
    var e = TextShadow.parseStyle(endValue);

    var totalLength = Math.max(s.length, e.length)

    var list = [] 
    for(var i = 0, len = totalLength; i < len; i++) {
        var startObject = s[i] || TextShadow.parseStyle('0px 0px 0px rgba(0, 0, 0, 0)')[0];
        var endObject = e[i] || TextShadow.parseStyle('0px 0px 0px rgba(0, 0, 0, 0)')[0];

        list.push({
            offsetX: makeInterpolateLength(layer, property, startObject.offsetX, endObject.offsetX, 'width', 'self'),
            offsetY: makeInterpolateLength(layer, property, startObject.offsetY, endObject.offsetY, 'height', 'self'),
            blurRadius: makeInterpolateLength(layer, property, startObject.blurRadius, endObject.blurRadius, 'radius'),
            color: makeInterpolateColor(layer, property, startObject.color, endObject.color)
        })
    }

    return (rate, t) => {
        return TextShadow.join(list.map(it => {
            return {
                offsetX: it.offsetX(rate, t), 
                offsetY: it.offsetY(rate, t), 
                blurRadius: it.blurRadius(rate, t), 
                color: it.color(rate, t)
            }
        }))
    }

}
