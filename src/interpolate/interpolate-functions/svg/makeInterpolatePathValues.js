import { makeInterpolateNumber } from "../makeInterpolateNumber";

export function makeInterpolatePathValues (layer, property, s, e) {

    var max = Math.max(s.length, e.length)

    var list = [] 

    var startLastPos = s[s.length-1]; 
    var endLastPos = e[e.length-1]; 

    for(var i = 0; i < max; i++) {
        var startPos = s[i];
        var endPos = e[i];

        if (startPos && !endPos) {
            list.push(makeInterpolateNumber(layer, property, startPos, endLastPos))
        } else if (!startPos && endPos) {
            list.push(makeInterpolateNumber(layer, property, startLastPos, endPos))            
        } else {
            list.push(makeInterpolateNumber(layer, property, startPos, endPos))
        }
        
    }

    return (rate, t) => {
        return list.map(it => it(rate, t));
    } 
}
