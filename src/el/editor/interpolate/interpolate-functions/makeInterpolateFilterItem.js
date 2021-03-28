import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateLength } from "./makeInterpolateLength";
import { makeInterpolateString } from "./makeInterpolateString";
import { makeInterpolateNumber } from "./makeInterpolateNumber";
import { makeInterpolateColor } from "./makeInterpolateColor";

export function makeInterpolateFilterItem(layer, property, startValue, endValue) {

    var obj = {
        type: makeInterpolateString(layer, property, startValue.type, endValue.type),
        value: makeInterpolateBoolean(layer, property, startValue.value, endValue.value)
    } 

    switch(startValue.type) {
    case 'blur': 
        obj.value = makeInterpolateLength(layer, property, startValue.value, endValue.value);
        break;     
    case 'grayscale':
    case 'invert':
    case 'brightness':
    case 'contrast':
    case 'opacity':
    case 'saturate':
    case 'sepia':
    case 'hue-rotate':        
        obj.value = makeInterpolateNumber(layer, property, startValue.value.value, endValue.value.value, startValue.value.unit);
        break;        
    case 'drop-shadow':
        obj.offsetX = makeInterpolateLength(layer, property, startValue.offsetX, endValue.offsetX, 'width', 'self')
        obj.offsetY = makeInterpolateLength(layer, property, startValue.offsetY, endValue.offsetY, 'height', 'self')
        obj.blurRadius = makeInterpolateLength(layer, property, startValue.blurRadius, endValue.blurRadius, 'width', 'self')
        obj.spreadRadius = makeInterpolateLength(layer, property, startValue.spreadRadius, endValue.spreadRadius, 'width', 'self')
        obj.color = makeInterpolateColor(layer, property, startValue.color, endValue.color)
        break; 
    }

    return (rate, t) => {

        var type =  obj.type(rate, t)

        if (type === 'drop-shadow') {

            return {
                type: obj.type(rate, t),
                offsetX: obj.offsetX(rate, t),
                offsetY: obj.offsetY(rate, t),
                blurRadius: obj.blurRadius(rate, t),
                spreadRadius: obj.spreadRadius(rate, t),
                color: obj.color(rate, t)
            }
        } else {

            return {
                type: obj.type(rate, t),
                value: obj.value(rate, t)
            }
        }

    }

}
