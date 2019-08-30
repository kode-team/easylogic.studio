import { makeInterpolateConicGradient } from "./makeInterpolateConicGradient";
import { RepeatingConicGradient } from "../../../image-resource/RepeatingConicGradient";

export function makeInterpolateRepeatingConicGradient (layer, property, s, e) {

    var func = makeInterpolateConicGradient(layer, property, s, e);

    return (rate, t) => {
        var obj = func(rate, t);
        return new RepeatingConicGradient({
            angle: obj.angle,
            radialPosition: obj.radialPosition,
            colorsteps: obj.colorsteps
        })
    } 
}
