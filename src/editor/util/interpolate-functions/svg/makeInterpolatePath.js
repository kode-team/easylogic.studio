import PathParser from "../../../parse/PathParser";
import { makeInterpolateIdentity } from "../makeInterpolateIdentity";
import { makeInterpolatePathValues } from "./makeInterpolatePathValues";
import { makeInterpolateBoolean } from "../makeInterpolateBoolean";

export function makeInterpolatePath (layer, property, startValue, endValue) {
    var returnParser = new PathParser()        
    var s = new PathParser(startValue);
    var e = new PathParser(endValue);

    var max = Math.max(s.segments.length, e.segments.length)

    var list = [] 

    for(var i = 0; i < max; i++) {
        var sc = s.segments[i];
        var ec = e.segments[i];

        if (sc.command === ec.command) {
            if (sc.values.length === ec.values.length) {
                list.push({
                    command: makeInterpolateIdentity(layer, property, sc.command),
                    values: makeInterpolatePathValues(layer, property, sc.values, ec.values),
                })
            } else {
                list.push({
                    command: makeInterpolateIdentity(layer, property, sc.command),
                    values: makeInterpolateIdentity(layer, property, sc.values),
                })
            }
        } else {
            list.push({
                command: makeInterpolateBoolean(layer, property, sc.command, ec.command),
                values: makeInterpolateBoolean(layer, property, sc.values, ec.values),
            })
        }
    }


    return (rate, t) => {
        var segments = list.map(it => {

            return {
                command: it.command(rate, t),
                values: it.values(rate, t)
            }
        })
        var results =  returnParser.joinPath(segments)

        return results;
    } 
}
