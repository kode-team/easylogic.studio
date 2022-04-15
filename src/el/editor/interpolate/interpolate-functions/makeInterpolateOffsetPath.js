import {PathParser} from 'el/editor/parser/PathParser';
import makeInterpolateOffset from "./offset-path/makeInterpolateOffset";
import { Length } from "el/editor/unit/Length";
import { calculateAngle } from "el/utils/math";
import { Transform } from "../../property-parser/Transform";

export function makeInterpolateOffsetPath(layer, property, startValue, endValue, artboard) {

    var [id, distance, rotateStatus, rotate] = startValue.split(',').map(it =>it.trim());

    var startObject = {id, distance: Length.parse(distance || '0%'), rotateStatus: rotateStatus || 'auto', rotate: Length.parse(rotate || '0deg') }

    var innerInterpolate = (rate, t) => {
        return { x, y }
    }

    var innerInterpolateAngle = (rotateStatus, currentAngle) => {

        var resultAngle = 0; 

        switch (rotateStatus) {
        case 'angle': 
            resultAngle =  startObject.rotate.value; 
            break; 
        case 'auto angle': 
            resultAngle =  currentAngle + startObject.rotate.value; 
            break; 
        case 'reverse': 
            resultAngle = currentAngle + 180;
            break; 
        case 'auto' : 
            resultAngle = currentAngle;
            break; 
        }

        return resultAngle;
    }

    var screenX = 0, screenY = 0

    if (artboard) {
        var pathLayer = artboard.searchById(startObject.id);

        if (pathLayer) {
            screenX = pathLayer.screenX.value
            screenY = pathLayer.screenY.value        
        }


        innerInterpolate = (rate, t, timing) => {
            var parser = new PathParser(pathLayer.d || '');            
            var {totalLength, interpolateList} = makeInterpolateOffset(parser.segments); 

            var distance = startObject.distance.toPx(totalLength)
            var dt = distance / totalLength;

            t = (t + dt )

            if (t > 1) {
                t -= 1; 
            }

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
            
            var newT = (t - obj.startT)/(obj.endT - obj.startT)
            var newRate = timing(newT)

            return {
                ...obj.interpolate(newRate, newT, timing),
                totalLength: obj.totalLength
            }
        }

    }

    return (rate, t, timing) => {

        // apply tranform-origin in real time 

        var arr = (layer['transform-origin'] || '50% 50%').split(' ').map(it => Length.parse(it))
        var tx = arr[0].toPx(layer.width);
        var ty = arr[1].toPx(layer.height);

        var obj = innerInterpolate(rate, t, timing); 

        var results = {
            x: obj.x + screenX - tx.value,
            y: obj.y + screenY - ty.value
        }

        layer.setScreenX(results.x)
        layer.setScreenY(results.y)

        if (startObject.rotateStatus === 'element') {
            // NOOP 
        } else {
            var current = obj
            var distValue = 0; 

            if (t < 1) {
                distValue = 1/obj.totalLength
            }
            var next = innerInterpolate(rate + distValue, t + distValue, timing); 
            var angle = calculateAngle(next.x - current.x, next.y - current.y)


            var newAngle = Length.deg(innerInterpolateAngle(startObject.rotateStatus, angle))

            layer.reset({
                transform: Transform.rotate(layer.transform, newAngle)
            })

        }


        return results;
    }

}
