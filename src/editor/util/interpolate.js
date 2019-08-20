import { createBezierForPattern } from "../../util/functions/bezier";
import { makeInterpolateNumber } from "./interpolate-functions/makeInterpolateNumber";
import { makeInterpolateBorderRadius } from "./interpolate-functions/makeInterpolateBorderRadius";
import { makeInterpolateBoxShadow } from "./interpolate-functions/makeInterpolateBoxShadow";
import { makeInterpolateColor } from "./interpolate-functions/makeInterpolateColor";
import { makeInterpolateString } from "./interpolate-functions/makeInterpolateString";


function makeInterpolate (layer, property, startValue, endValue) {
    switch(property) {
    case 'width':
    case 'x':
    case 'opacity':
    case 'rotate':
        return makeInterpolateNumber(layer, property, startValue, endValue);
    case 'height':
    case 'y':
        return makeInterpolateNumber(layer, property, startValue, endValue, 'height');
    case 'border-radius':
        return makeInterpolateBorderRadius(layer, property, startValue, endValue);
    case 'box-shadow':
        return makeInterpolateBoxShadow(layer, property, startValue, endValue);        
    case 'background-color':
    case 'color':
        return makeInterpolateColor(layer, property, startValue, endValue);
    case 'mix-blend-mode':
        return makeInterpolateString(layer, property, startValue, endValue);
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