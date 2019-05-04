import { interpolateRGBObject } from "../functions/mixin";
import { rgb } from "../functions/formatter";
import { UNIT_PERCENT, UNIT_PX, UNIT_EM, string2unit } from "../css/types";

const ScaleFunctions = {
    'color': 'makeScaleFunctionForColor',
    'number': 'makeScaleFunctionForNumber',
    [UNIT_PERCENT]: 'makeScaleFunctionForPercent',
    [UNIT_PX]: 'makeScaleFunctionForPx',
    [UNIT_EM]: 'makeScaleFunctionForEm'
}

const Scale = {
    makeScaleFunctionForColor (start, end) {
        return function (currentPercent) {
            var rate = (currentPercent - start.percent) / (end.percent - start.percent);
        
            return interpolateRGBObject (start, end, rate); 
        }            
    },

    makeScaleFunctionForNumber (start, end) {
        return function (currentPercent) {
            var rate = (currentPercent - start.percent) / (end.percent - start.percent);

            return start.value + (end.value - start.value) * rate; 
        }            
    },

    makeScaleFunctionForPercent (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },    

    makeScaleFunctionForPx (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },    
    
    makeScaleFunctionForEm (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },        

    makeScaleFunction (start, end, isLast) {
        var itemType = start.itemType || 'number';

        return this[ScaleFunctions[itemType]].call(this, start, end);
    },

    makeCheckFunction (start, end, isLast) {
        if (isLast) {
            return function (currentPercent) {
                return start.percent <= currentPercent && currentPercent <= end.percent;
            }   
        } else {
            return function (currentPercent) {
                return start.percent <= currentPercent && currentPercent < end.percent;
            }   
        }

    },

    makeSetupFunction (start, end, isLast) {
        var check = this.makeCheckFunction(start, end, isLast);
        var scale = this.makeScaleFunction(start, end, isLast);

        if (start.itemType == 'color') {
            return this.makeSetupColorScaleFunction(check, scale, start, end);
        } else {
            return this.makeSetupNumberScaleFunction(check, scale, start, end);
        }
    },

    makeSetupColorScaleFunction (check, scale, start, end) {
        return function (ani, progress) {
            if (check(progress)) {
                ani.obj[start.key] = rgb(scale(ani.timing(progress, ani.duration, start, end)));
            }
        }
    },

    makeSetupNumberScaleFunction (check, scale, start, end) {

        return function (ani, progress) {
            if (check(progress)) {   
                const value =  scale(ani.timing(progress, ani.duration, start.value, end.value)) + start.type;

                ani.obj[start.key] =  string2unit(value);
            }
        }
    }
}
export default Scale;