import { makeInterpolateNumber } from "./makeInterpolateNumber";

export function makeInterpolateStrokeDashArrray(layer, property, startValue, endValue) {

    var s = startValue.split(' ').map(it => +it);
    var e = endValue.split(' ').map(it => +it);

    var max = Math.max(s.length, e.length);

    var list = [] 
    for(var i = 0; i < max; i++) {
        var startPos = s[i];
        var endPos = e[i];

        list.push(makeInterpolateNumber(layer, property, startPos, endPos))
    }

    return (rate, t) => {
        var results = list.map(it => it(rate,t)).join(' ');
            
        return results;
    }

}
