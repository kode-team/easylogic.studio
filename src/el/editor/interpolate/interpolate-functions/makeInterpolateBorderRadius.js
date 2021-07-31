import { makeInterpolateLength } from "./makeInterpolateLength";
import { STRING_TO_CSS, CSS_TO_STRING } from "el/sapa/functions/func";
import BorderRadius from "../../property-parser/BorderRadius";
import { Length } from "el/editor/unit/Length";

const getBorderRadiusList = (radiusValue) => {
    var startObject = [] 
    if (radiusValue.isAll) {
        startObject = [
            radiusValue['border-radius'] || '0px', 
            radiusValue['border-radius'] || '0px', 
            radiusValue['border-radius'] || '0px', 
            radiusValue['border-radius'] || '0px'
        ]
    } else {
        startObject = [
            radiusValue['border-top-left-radius'] || '0px', 
            radiusValue['border-top-right-radius'] || '0px', 
            radiusValue['border-bottom-right-radius'] || '0px', 
            radiusValue['border-bottom-left-radius'] || '0px'
        ]
    }

    return startObject;
}

export function makeInterpolateBorderRadius(layer, property, startValue, endValue) {
    var s = getBorderRadiusList(BorderRadius.parseStyle(startValue));
    var e = getBorderRadiusList(BorderRadius.parseStyle(endValue));

    var max = Math.max(s.length, e.length);

    var list = [] 
    for(var i = 0; i < max; i++) {
        list[i] = makeInterpolateLength(layer, property, s[i], e[i])
    }


    return (rate, t) => {
        return list.map(it => it(rate, t)).join(' ')
    }
}


