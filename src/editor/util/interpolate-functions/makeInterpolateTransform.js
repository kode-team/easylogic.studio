import { ClipPath } from "../../css-property/ClipPath";
import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { Transform } from "../../css-property/Transform";
import { makeInterpolateIdentity } from "./makeInterpolateIdentity";
import { makeInterpolateTransformLength } from "./transform/makeInterpolateTransformLength";
import { makeInterpolateTransformNumber } from "./transform/makeInterpolateTransformNumber";
import { makeInterpolateTransformRotate } from "./transform/makeInterpolateTransformRotate";

export function makeInterpolateTransform(layer, property, startValue, endValue) {
    var startObject = Transform.parseStyle(startValue.trim());
    var endObject = Transform.parseStyle(endValue.trim());

    var max = Math.max(startObject.length, endObject.length);

    var list = [] 
    for(var i = 0; i < max; i++) {
        var s = startObject[i]
        var e = endObject[i]

        if (s && !e) {
            list.push(makeInterpolateIdentity(layer, property, s))
        } else if (!s && e) {
            list.push(makeInterpolateIdentity(layer, property, e))
        } else if (s.type != e.type) {
            list.push(makeInterpolateBoolean(layer, property, s, e))
        } else {
            switch(s.type) {
            case 'skewX': 
            case 'skewY': 
            case 'translate': 
            case 'translateX': 
            case 'translateY': 
            case 'translateZ': 
            case 'translate3d': 
            case 'perspective': 
                list.push(makeInterpolateTransformLength(layer, property, s, e)); 
                break; 
            case 'rotate': 
            case 'rotateX': 
            case 'rotateY': 
            case 'rotateZ': 
            case 'rotate3d': 
                list.push(makeInterpolateTransformRotate(layer, property, s, e));
                break;  
            case 'scale': 
            case 'scaleX': 
            case 'scaleY': 
            case 'scaleZ': 
            case 'scale3d': 
            case 'matrix': 
            case 'matrix3d': 
                list.push(makeInterpolateTransformNumber(layer, property, s, e)); 
                break; 
            }
        }
    }

    return (rate, t) => {
        var results = Transform.join(list.map(it => {
            return it(rate, t)
        }))

        return results;
    }

}
