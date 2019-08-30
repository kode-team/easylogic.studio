import { makeInterpolateBoolean } from "../makeInterpolateBoolean";
import { makeInterpolateColorStep } from "./makeInterpolateColorStep";

export function makeInterpolateColorStepList(layer, property, startColorsteps = [], endColorsteps = []) {

    var max = Math.max(startColorsteps.length, endColorsteps.length)

    var list = []
    for(var i = 0; i < max; i++) {
        var s = startColorsteps[i];
        var e = endColorsteps[i];

        if (s && e) {
            list[i] = makeInterpolateColorStep(layer, property, s, e);
        } else {
            list[i] = makeInterpolateBoolean(layer, property, s, e); 
        }
    }


    return (rate, t) => {
        
        return list.map(it => it(rate, t))
    }
}
