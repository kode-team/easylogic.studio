import { makeInterpolateColorStepList } from "./makeInterpolateColorStepList";
import { makeInterpolateLength } from "../makeInterpolateLength";
import { ConicGradient } from "../../../image-resource/ConicGradient";
import { makeInterpolateNumber } from "../makeInterpolateNumber";

export function makeInterpolateConicGradient (layer, property, s, e) {

    var obj = {
        angle: makeInterpolateNumber(layer, property, s.angle, e.angle),
        radialPositionX: makeInterpolateLength(layer, property, s.radialPosition[0], e.radialPosition[0], 'width', 'self'),
        radialPositionY: makeInterpolateLength(layer, property, s.radialPosition[1], e.radialPosition[1], 'height', 'self'),
        colorsteps: makeInterpolateColorStepList(layer, property, s.colorsteps, e.colorsteps)
    }

    return (rate, t) => {
        return new ConicGradient({
            angle: obj.angle(rate, t),
            radialPosition: [ obj.radialPositionX(rate, t), obj.radialPositionY(rate, t) ],
            colorsteps: obj.colorsteps(rate, t)
        })
    } 
}
