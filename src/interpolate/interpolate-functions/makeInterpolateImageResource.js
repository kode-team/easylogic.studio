import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateLinearGradient } from "./gradient/makeInterpolateLinearGradient";
import { makeInterpolateRepeatingLinearGradient } from "./gradient/makeInterpolateRepeatingLinearGradient";
import { makeInterpolateRepeatingRadialGradient } from "./gradient/makeInterpolateRepeatingRadialGradient";
import { makeInterpolateRepeatingConicGradient } from "./gradient/makeInterpolateRepeatingConicGradient";
import { makeInterpolateRadialGradient } from "./gradient/makeInterpolateRadialGradient";
import { makeInterpolateConicGradient } from "./gradient/makeInterpolateConicGradient";

export function makeInterpolateImageResource(layer, property, s, e) {

    var obj = {
        image: (rate, t) => {
            return t; 
        }
    }

    if (s.type === 'url' || e.type === 'url') {
        obj.image = makeInterpolateBoolean(layer, property, s, e);
    } else {
        if (s.type != e.type) {
            obj.image = makeInterpolateBoolean(layer, property, s, e);
        } else {
            // 타입이 같을 때만 interpolate 함 
            switch(s.type) {
            case 'linear-gradient': 
                obj.image = makeInterpolateLinearGradient(layer, property, s, e); 
                break; 
            case 'repeating-linear-gradient': 
                obj.image = makeInterpolateRepeatingLinearGradient(layer, property, s, e); 
                break; 
            case 'radial-gradient': 
                obj.image = makeInterpolateRadialGradient(layer, property, s, e); 
                break; 
            case 'repeating-radial-gradient': 
                obj.image = makeInterpolateRepeatingRadialGradient(layer, property, s, e); 
                break; 
            case 'conic-gradient': 
                obj.image = makeInterpolateConicGradient(layer, property, s, e); 
                break; 
            case 'repeating-conic-gradient': 
                obj.image = makeInterpolateRepeatingConicGradient(layer, property, s, e); 
                break; 
            }
        }
    }

    return (rate, t) => {
       
        return obj.image(rate, t);
    }

}
