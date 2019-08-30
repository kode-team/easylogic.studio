import { ClipPath } from "../../css-property/ClipPath";
import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateClipPathCircle } from "./clip-path/makeInterpolateClipPathCircle";
import { makeInterpolateClipPathEllipse } from "./clip-path/makeInterpolateClipPathEllipse";
import { makeInterpolateClipPathPolygon } from "./clip-path/makeInterpolateClipPathPolygon";
import { makeInterpolateClipPathInset } from "./clip-path/makeInterpolateClipPathInset";

export function makeInterpolateClipPath(layer, property, startValue, endValue) {

    var startObject = ClipPath.parseStyle(startValue);
    var endObject = ClipPath.parseStyle(endValue);

    var obj = {
        type: makeInterpolateBoolean(layer, property, startObject.type, startObject.type),
        value: makeInterpolateBoolean(layer, property, startValue, endValue)
    }

    if (startObject.type == endObject.type && startObject != 'none')  {
        switch(startObject.type) {
        case 'circle':
            startObject.value = ClipPath.parseStyleForCircle(startObject.value);
            endObject.value = ClipPath.parseStyleForCircle(endObject.value);

            obj.value = makeInterpolateClipPathCircle(layer, property, startObject.value, endObject.value);

            break; 
        case 'ellipse':
            startObject.value = ClipPath.parseStyleForEllipse(startObject.value);
            endObject.value = ClipPath.parseStyleForEllipse(endObject.value);

            obj.value = makeInterpolateClipPathEllipse(layer, property, startObject.value, endObject.value);            
            break;  
        case 'inset': // 구현 해야함 
            startObject.value = ClipPath.parseStyleForInset(startObject.value);
            endObject.value = ClipPath.parseStyleForInset(endObject.value);

            obj.value = makeInterpolateClipPathInset(layer, property, startObject.value, endObject.value);
            break;
        case 'polygon': // 구현 해야함 
            startObject.value = ClipPath.parseStyleForPolygon(startObject.value);
            endObject.value = ClipPath.parseStyleForPolygon(endObject.value);

            obj.value = makeInterpolateClipPathPolygon(layer, property, startObject.value, endObject.value);
            break;
        case 'path':  // 구현 해야함 
            startObject.value = ClipPath.parseStyleForPath(startObject.value);
            endObject.value = ClipPath.parseStyleForPath(endObject.value);

            obj.value = makeInterpolateClipPathPath(layer, property, startObject.value, endObject.value);        
            break;
        }
    }


    return (rate, t) => {

        var type = obj.type(rate, t);
        var value = obj.value(rate, t);

        if (type === 'none') {
            return type; 
        }

        return  `${type}(${value})`
    }

}
