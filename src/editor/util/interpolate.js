import { createBezierForPattern } from "../../util/functions/bezier";
import { makeInterpolateLength } from "./interpolate-functions/makeInterpolateLength";
import { makeInterpolateBorderRadius } from "./interpolate-functions/makeInterpolateBorderRadius";
import { makeInterpolateBoxShadow } from "./interpolate-functions/makeInterpolateBoxShadow";
import { makeInterpolateColor } from "./interpolate-functions/makeInterpolateColor";
import { makeInterpolateString } from "./interpolate-functions/makeInterpolateString";
import timingFunctions from "./timing-functions";
import { makeInterpolateRotate } from "./interpolate-functions/makeInterpolateRotate";
import { makeInterpolateTextShadow } from "./interpolate-functions/makeInterpolateTextShadow";
import { makeInterpolateBackgroundImage } from "./interpolate-functions/makeInterpolateBackgroundImage";
import { makeInterpolateFilter } from "./interpolate-functions/makeInterpolateFilter";



function makeInterpolate (layer, property, startValue, endValue) {
    switch(property) {
    case 'width':
    case 'x':
    case 'opacity':
        return makeInterpolateLength(layer, property, startValue, endValue);        
    case 'rotate':
        return makeInterpolateRotate(layer, property, startValue, endValue);
    case 'height':
    case 'y':
        return makeInterpolateLength(layer, property, startValue, endValue, 'height');
    case 'border-radius':
        return makeInterpolateBorderRadius(layer, property, startValue, endValue);
    case 'box-shadow':
        return makeInterpolateBoxShadow(layer, property, startValue, endValue);        
    case 'text-shadow':
        return makeInterpolateTextShadow(layer, property, startValue, endValue);
    case 'background-image':
        return makeInterpolateBackgroundImage(layer, property, startValue, endValue); 
    case 'filter':
    case 'backdrop-filter':
        return makeInterpolateFilter(layer, property, startValue, endValue);
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


export function createTimingFunction(timing) {

    var [funcName, params] = timing.split('(').map(it => it.trim())
    params = (params || '').split(')')[0].trim()

    var func = timingFunctions[funcName];

    if (func) {
        
        var args = timing.split('(')[1].split(')')[0].split(',').map(it => it.trim())
        return func(...args);
    } else {
        return createCurveFunction(timing);
    }
}

export function createCurveFunction (timing) {
    var func = createBezierForPattern(timing);
    return (rate) => {
        return func(rate).y;
    }
}


