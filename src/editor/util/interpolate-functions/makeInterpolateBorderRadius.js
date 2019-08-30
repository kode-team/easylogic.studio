import { makeInterpolateLength } from "./makeInterpolateLength";
import { STRING_TO_CSS, CSS_TO_STRING } from "../../../util/functions/func";

export function makeInterpolateBorderRadius(layer, property, startValue, endValue) {
    var s = STRING_TO_CSS(startValue);
    var e = STRING_TO_CSS(endValue);

    var list = [] 
    Object.keys(s).forEach(key => {
        list.push({ key,  value: makeInterpolateLength(layer, property, s[key], e[key]) })
    })

    return (rate, t) => {
        var obj = {}  
        list.forEach(it => {
            obj[it.key] = it.value(rate, t);
        })

        return CSS_TO_STRING(obj);
    }
}


