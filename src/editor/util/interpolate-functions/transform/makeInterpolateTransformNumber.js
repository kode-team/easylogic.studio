import { makeInterpolateBoolean } from "../makeInterpolateBoolean";
import { makeInterpolateLength } from "../makeInterpolateLength";
import { makeInterpolateNumber } from "../makeInterpolateNumber";
import { Length } from "../../../unit/Length";

export function makeInterpolateTransformNumber (layer, property, startValue, endValue) {

    var obj = {
        type: makeInterpolateBoolean(layer, property, startValue.type, endValue.type)
    }

    var value = [] 
    var max = Math.max(startValue.value.length, endValue.value.length);

    for(var i = 0; i < max; i++) {
        var s = startValue.value[i]
        var e = endValue.value[i];

        if (s && e) {
            value.push(makeInterpolateNumber(layer, property, s.value, e.value))
        } else {
            var ss = startValue.value[i].value || startValue.value[i-1].value || startValue.value[i-2].value;
            var ee = endValue.value[i].value || endValue.value[i-1].value || startValue.value[i-2].value
            value.push(makeInterpolateNumber(layer, property, ss,ee))
        }

    }

    obj.value = value; 



    return (rate, t) => {

        var value = obj.value.map(it => it(rate, t))

        var type = obj.type(rate, t);

        if (type.includes('matrix') || type.includes('scale')) {
            value = value.map(it => {
                return Length.number(it)
            })
        }

        return { type, value }
    } 
}
