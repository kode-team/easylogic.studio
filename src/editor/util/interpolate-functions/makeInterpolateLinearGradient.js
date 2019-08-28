import { makeInterpolateRotate } from "./makeInterpolateRotate";
import { LinearGradient } from "../../image-resource/LinearGradient";
import { makeInterpolateColorStepList } from "./makeInterpolateColorStepList";
import { makeInterpolateString } from "./makeInterpolateString";

export function makeInterpolateLinearGradient (layer, property, s, e) {

    // angle 이랑 
    // colorsteps 

    var obj = {
        angle: makeInterpolateRotate(layer, property, s.angle, e.angle),
        colorsteps: makeInterpolateColorStepList(layer, property, s.colorsteps, e.colorsteps)
    }

    return (rate, t) => {
        var colorsteps = obj.colorsteps(rate, t);

        return new LinearGradient({
            angle: obj.angle(rate, t),
            colorsteps
        })
    } 
}
