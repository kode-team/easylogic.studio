import { makeInterpolateIdentity } from "../makeInterpolateIdentity";
import { makeInterpolateLength } from "../makeInterpolateLength";

export function makeInterpolateClipPathPolygon (layer, property, s, e) {
    var max = Math.max(s.length, e.length)
    var list = [] 

    for(var i = 0; i < max; i++) {
        var startPos = s[i];
        var endPos = e[i];

        if (startPos && !endPos) {
            list.push({
                x: makeInterpolateIdentity(layer, property, startPos.x),
                y: makeInterpolateIdentity(layer, property, startPos.y),
            })
        } else if (!startPos && endPos) {
            list.push({
                x: makeInterpolateIdentity(layer, property, endPos.x),
                y: makeInterpolateIdentity(layer, property, endPos.y),
            })
        } else {
            list.push({
                x: makeInterpolateLength(layer, property, startPos.x, endPos.x, 'width', 'self'),
                y: makeInterpolateLength(layer, property, startPos.y, endPos.y, 'height', 'self')
            })
        }
        
    }

    return (rate, t) => {
        return list.map(it => {
            return `${it.x(rate, t)} ${it.y(rate, t)}`
        }).join(',')
    } 
}
