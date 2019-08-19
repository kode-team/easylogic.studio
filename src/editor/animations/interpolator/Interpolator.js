import Color from "../../../util/Color";
import { interpolateRGBObject } from "../../../util/functions/mixin";
import { createBezierForPattern } from "../../../util/functions/bezier";

export function makeTimingFunction (startTime, endTime, func = 'linear') {
    var timingFunction = createBezierForPattern(func);

    return (time) => {
        return timingFunction((time - endTime) / (startTime - endTime));
    }
}

export  function makeNumberInterpolator (fromValue, toValue, timingFunction) {

    fromValue = +fromValue;
    toValue = +toValue;

    return (time) => {
        return fromValue + (toValue - fromValue) * timingFunction(time);
    } 

}

export function makeColorInterpolator (fromValue, toValue, timingFunction) {
    fromValue = Color.parse(fromValue);
    toValue = Color.parse(toValue);

    return (time) => {
        var obj = interpolateRGBObject(fromValue, toValue, timingFunction(time));

        return `rgba(${obj.r}, ${obj.g}, ${obj.b}, ${obj.a})`
    } 
}