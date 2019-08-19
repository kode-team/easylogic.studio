import { interpolateRGB } from "../../util/functions/mixin";
import { Length } from "../unit/Length";
import { createBezierForPattern } from "../../util/functions/bezier";
import Color from "../../util/Color";


function getRealAttributeValue (layer, property, value) {
    switch(property) {
    case 'width':
    case 'x':         
        return value.toPx(layer.parent.width.value)
    case 'height':
    case 'y':         
        return value.toPx(layer.parent.height.value)
    }

    return value; 
}

function makeInterpolateNumber(layer, property, startNumber, endNumber) {
    var s = Length.parse(startNumber);
    var e = Length.parse(endNumber);

    return (rate, t) => {
        var realStartValue = getRealAttributeValue(layer, property, s);
        var realEndValue = getRealAttributeValue(layer, property, e);

        if (t === 0) {
            return realStartValue;
        } else if (t === 1) {
            return realEndValue;
        }


        return new Length(realStartValue.value + (realEndValue.value - realStartValue.value) * rate, realStartValue.unit);
    }
}

function makeInterpolateColor (layer, property, startColor, endColor) {
    var s = Color.parse(startColor);
    var e = Color.parse(endColor);

    return (ratio, t) => {

        if (t === 0) {
            return startColor;
        } else if (t === 1) {
            return endColor;
        }

        return interpolateRGB(s, e, ratio, 'rgb')
    } 
}


function makeInterpolate (layer, property, startValue, endValue) {
    switch(property) {
    case 'width':
    case 'height': 
    case 'x':
    case 'y':
        return makeInterpolateNumber(layer, property, startValue, endValue);
    case 'background-color':
    case 'color':
        return makeInterpolateColor(layer, property, startValue, endValue);
    }

}


export function createInterpolateFunction (layer, property, startValue, endValue) {
    return makeInterpolate(layer, property, startValue, endValue);
}

export function createCurveFunction (timing) {
    var func = createBezierForPattern(timing);
    return (rate) => {
        return func(rate).y;
    }
}