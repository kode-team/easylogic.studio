import { makeInterpolateBoolean } from "../makeInterpolateBoolean";
import { makeInterpolateLength } from "../makeInterpolateLength";

export function makeInterpolateTransformLength (layer, property, startValue, endValue) {

    var obj = {
        type: makeInterpolateBoolean(layer, property, startValue.type, endValue.type)
    }

    var value = [] 
    var max = Math.max(startValue.value.length, endValue.value.length);

    for(var i = 0; i < max; i++) {
        var s = startValue.value[i]
        var e = endValue.value[i];

        if (s && e) {

            value.push(makeInterpolateLength(layer, property, s, e, startValue.type))
        } else {
            value.push(
                makeInterpolateLength(
                    layer, 
                    property, 
                    startValue.value[i] || startValue.value[i-1] || startValue.value[i-2],
                    endValue.value[i] || endValue.value[i-1] || startValue.value[i-2], 
                    startValue.type
                )
            )
        }

    }

    obj.value = value; 

    return (rate, t) => {

        return {
            type: obj.type(rate, t),
            value: obj.value.map(it => it(rate, t))
        }
    } 
}
