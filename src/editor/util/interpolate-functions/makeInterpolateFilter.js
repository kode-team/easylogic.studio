import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { Filter } from "../../css-property/Filter";
import { makeInterpolateIdentity } from "./makeInterpolateIdentity";
import { makeInterpolateFilterItem } from "./makeInterpolateFilterItem";

export function makeInterpolateFilter(layer, property, startValue, endValue) {
    var s = Filter.parseStyle(startValue);
    var e = Filter.parseStyle(endValue);

    var totalLength = Math.max(s.length, e.length)

    var list = [] 
    for(var i = 0, len = totalLength; i < len; i++) {
        var startObject = s[i]
        var endObject = e[i]

        if (startObject && !endObject) {
            list.push(makeInterpolateIdentity(layer, property, startObject)) 
        } else if (!startObject && endObject) {
            list.push(makeInterpolateIdentity(layer, property, endObject)) 
        } else {

            if (startObject.type != endObject.type || startObject.type === 'svg' || endObject.type === 'svg') {
                list.push(makeInterpolateBoolean(layer, property, startObject, endObject))
            } else {
                list.push(makeInterpolateFilterItem(layer, property, startObject, endObject))
            }

        }

    }

    return (rate, t) => {
        return Filter.join(list.map(it => it(rate, t)))
    }

}
