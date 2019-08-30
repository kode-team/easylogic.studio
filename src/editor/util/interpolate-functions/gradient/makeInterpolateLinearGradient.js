import { LinearGradient } from "../../../image-resource/LinearGradient";
import { makeInterpolateColorStepList } from "./makeInterpolateColorStepList";
import { makeInterpolateNumber } from "../makeInterpolateNumber";

export function makeInterpolateLinearGradient (layer, property, s, e) {

    // angle 이랑 
    // colorsteps 

    var obj = {
        angle: makeInterpolateNumber(layer, property, s.angle, e.angle),
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
