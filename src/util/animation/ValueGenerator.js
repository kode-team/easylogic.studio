import { matches, parse } from "../functions/parser";
import { parseParamNumber } from "../filter/functions";
import { isNumber } from "../functions/func";

const ValueGenerator = {
    make (key, percent, transitionPropertyValue) {

        // 색상 체크 
        var arr = matches(transitionPropertyValue);
        if (arr.length) {
            return { key, percent, itemType: 'color', ...parse(arr[0].color) }; // 색상 객체 
        } else if (isNumber(transitionPropertyValue)) {
            return { key, percent, itemType : 'number', type : 'number', value: transitionPropertyValue }
        } else {
            if (transitionPropertyValue.includes('%')) {
                return { key, percent, itemType: '%', type : '%', value : parseParamNumber(transitionPropertyValue) }
            } else if (transitionPropertyValue.includes('px')) {
                return { key, percent, itemType : 'px', type : 'px', value : parseParamNumber(transitionPropertyValue) }
            } else if (transitionPropertyValue.includes('em')) {
                return { key, percent, itemType : 'em', type : 'em', value : parseParamNumber(transitionPropertyValue) }
            }
        }

        return { key, percent, itemType : 'number', type : 'number', value : +transitionPropertyValue }
    }
}

export default ValueGenerator