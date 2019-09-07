import { editor } from "../../editor";
import PathParser from "../../parse/PathParser";
import makeInterpolateOffset from "./offset-path/makeInterpolateOffset";
import { Length } from "../../unit/Length";
import { resultGenerator } from "../../css-property/SVGFilter";
import { calculateAngle } from "../../../util/functions/math";

export function makeInterpolateOffsetPath(layer, property, startValue, endValue) {

    var artboard = editor.selection.currentArtboard
    var innerInterpolate = (rate, t) => {
        return { x, y }
    }

    var screenX = 0, screenY = 0

    if (artboard) {
        var pathLayer = artboard.searchById(startValue);

        var parser = new PathParser(pathLayer.d);
        // parser.translate(pathLayer.screenX.value, pathLayer.screenY.value)
        screenX = pathLayer.screenX.value
        screenY = pathLayer.screenY.value        

        var interpolateList = makeInterpolateOffset(parser.segments); 

        innerInterpolate = (rate, t, timing) => {
            var obj = interpolateList[0]    
            if (t === 0) {
                obj = interpolateList[0]    
            } else if (t === 1) {
                obj = interpolateList[interpolateList.length-1]    
            }

            var arr = interpolateList.find(it => {
                return it.startT <= t && t < it.endT
            });

            if (arr) {
                obj = arr
            }

            // console.log(obj);
            
            var newT = (t - obj.startT)/(obj.endT - obj.startT)
            var newRate = timing(newT)

            // console.log(newT, newRate, t, obj.startT, obj.endT);

            return {
                ...obj.interpolate(newRate, newT, timing),
                totalLength: obj.totalLength
            }
        }

    }

    return (rate, t, timing) => {

        // apply tranform-origin in real time 

        var arr = (layer['transform-origin'] || '50% 50%').split(' ').map(it => Length.parse(it))
        var tx = arr[0].toPx(layer.width.value);
        var ty = arr[1].toPx(layer.height.value);

        var obj = innerInterpolate(rate, t, timing); 

        var results = {
            x: obj.x + screenX - tx.value,
            y: obj.y + screenY - ty.value
        }

        // console.log(results, rate, t);

        layer.setScreenX(results.x)
        layer.setScreenY(results.y)

        var current = obj
        var next = innerInterpolate(rate + 1/obj.totalLength, t + 1/obj.totalLength, timing); 

        var angle = calculateAngle(next.x - current.x, next.y - current.y)

        layer.rotate = Length.deg(angle);

        return results;
    }

}
