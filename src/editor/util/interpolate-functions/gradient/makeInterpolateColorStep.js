import { makeInterpolateBoolean } from "../makeInterpolateBoolean";
import { makeInterpolateColor } from "../makeInterpolateColor";
import { ColorStep } from "../../../image-resource/ColorStep";
import { makeInterpolateString } from "../makeInterpolateString";
import { makeInterpolateNumber } from "../makeInterpolateNumber";

export function makeInterpolateColorStep(layer, property, startColorStep, endColorStep) {

    
    var obj = {
        cut: makeInterpolateBoolean(layer, property, startColorStep.cut, endColorStep.cut),
        percent: makeInterpolateNumber(layer, property, startColorStep.percent, endColorStep.percent),
        px: makeInterpolateNumber(layer, property, startColorStep.px, endColorStep.px),
        em: makeInterpolateNumber(layer, property, startColorStep.em, endColorStep.em), 
        unit: makeInterpolateString(layer, property, startColorStep.unit, endColorStep.unit),
        color: makeInterpolateColor(layer, property, startColorStep.color, endColorStep.color)
    }

    // console.log(startColorStep.color, endColorStep.color)

    return (rate, t) => {
        
        return new ColorStep({
            cut: obj.cut(rate,t),
            percent: obj.percent(rate, t),
            px: obj.px(rate, t),
            em: obj.em(rate, t),
            unit: obj.unit(rate, t),
            color: obj.color(rate, t)
        })
    }
}
