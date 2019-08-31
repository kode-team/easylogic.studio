import { Length } from "../../unit/Length";
import { makeInterpolateLength } from "./makeInterpolateLength";

export function makeInterpolatePerspectiveOrigin(layer, property, startValue, endValue) {

    var s = startValue.split(' ').map(it => Length.parse(it));
    var e = endValue.split(' ').map(it => Length.parse(it));

    var max = Math.max(s.length, e.length);

    var list = [] 
    for(var i = 0; i < max; i++) {
        var startPos = s[i];
        var endPos = e[i];

        list.push(makeInterpolateLength(layer, property, startPos, endPos, 'perspective-origin'))
    }

    return (rate, t) => {
        var results = list.map(it => it(rate,t)).join(' ');
            
        return results;
    }

}
