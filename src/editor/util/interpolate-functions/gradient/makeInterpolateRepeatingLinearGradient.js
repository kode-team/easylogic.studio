import { makeInterpolateLinearGradient } from "./makeInterpolateLinearGradient";
import { RepeatingLinearGradient } from "../../../image-resource/RepeatingLinearGradient";

export function makeInterpolateRepeatingLinearGradient (layer, property, s, e) {

    var func = makeInterpolateLinearGradient(layer, property, s, e);

    return (rate, t) => {
        var obj = func(rate, t);
        var results = new RepeatingLinearGradient({
            angle: obj.angle,
            colorsteps: obj.colorsteps
        })

        console.log(results); 

        return results
    } 
}
