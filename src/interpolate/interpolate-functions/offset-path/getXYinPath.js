
import { createTimingFunction } from "@interpolate/";
import makeInterpolateOffset from "./makeInterpolateOffset";

export function getXYinPath (parser) {
    var timing = createTimingFunction('linear');
    var { totalLength, interpolateList } = makeInterpolateOffset(parser.segments); 

    return { 
        totalLength,
        xy: (t) => {    
            if (t > 1) {
                t -= 1; 
            }
        
            var obj = interpolateList[0]
            if (t === 0) {
                obj = interpolateList[0]    
            } else if (t === 1) {
                obj = interpolateList[interpolateList.length-1]    
            } else {
                var arr = interpolateList.find(it => {
                    return it.startT <= t && t < it.endT
                });
            
                if (arr) {
                    obj = arr
                }    
            }
        
            var newT = (t - obj.startT)/(obj.endT - obj.startT)
            var newRate = timing(newT)
        
            return {
                ...obj.interpolate(newRate, newT, timing),
                newT: newT,
                t: t,
                totalLength: obj.totalLength
            }
        }
    }

}
