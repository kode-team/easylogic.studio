import { BoxShadow } from "../../css-property/BoxShadow";
import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateNumber } from "./makeInterpolateNumber";
import { makeInterpolateColor } from "./makeInterpolateColor";

export function makeInterpolateBoxShadow(layer, property, startValue, endValue) {
    var s = BoxShadow.parseStyle(startValue);
    var e = BoxShadow.parseStyle(endValue);

    var totalLength = Math.max(s.length, e.length)

    var list = [] 
    for(var i = 0, len = totalLength; i < len; i++) {
        var startBoxShaodw = s[i] || BoxShadow.parseStyle('0px 0px 0px 0px rgba(0, 0, 0, 0)')[0];
        var endBoxShaodw = e[i] || BoxShadow.parseStyle('0px 0px 0px 0px rgba(0, 0, 0, 0)')[0];

        list.push({
            inset: makeInterpolateBoolean(layer, property, startBoxShaodw.inset, endBoxShaodw.inset),
            offsetX: makeInterpolateNumber(layer, property, startBoxShaodw.offsetX, endBoxShaodw.offsetX),
            offsetY: makeInterpolateNumber(layer, property, startBoxShaodw.offsetY, endBoxShaodw.offsetY),
            blurRadius: makeInterpolateNumber(layer, property, startBoxShaodw.blurRadius, endBoxShaodw.blurRadius),
            spreadRadius: makeInterpolateNumber(layer, property, startBoxShaodw.spreadRadius, endBoxShaodw.spreadRadius),
            color: makeInterpolateColor(layer, property, startBoxShaodw.color, endBoxShaodw.color)
        })
    }

    return (rate, t) => {
        return BoxShadow.join(list.map(it => {
            return {
                inset: it.inset(rate, t), 
                offsetX: it.offsetX(rate, t), 
                offsetY: it.offsetY(rate, t), 
                blurRadius: it.blurRadius(rate, t), 
                spreadRadius: it.spreadRadius(rate, t),
                color: it.color(rate, t)
            }
        }))
    }

}
