import PolygonParser from "../../../parse/PolygonParser";
import { makeInterpolateNumber } from "../makeInterpolateNumber";

export function makeInterpolatePolygon (layer, property, startValue, endValue) {

    var returnParser = new PolygonParser()        
    var s = new PolygonParser(startValue);
    var e = new PolygonParser(endValue);

    var max = Math.max(s.segments.length, e.segments.length)

    var list = [] 

    var startLastX = s.segments[s.segments.length-1].x; 
    var startLastY = s.segments[s.segments.length-1].y; 
    var endLastX = e.segments[e.segments.length-1].x; 
    var endLastY = e.segments[e.segments.length-1].y; 

    for(var i = 0; i < max; i++) {
        var startPos = s.segments[i];
        var endPos = e.segments[i];

        if (startPos && !endPos) {
            list.push({
                x: makeInterpolateNumber(layer, property, startPos.x, endLastX),
                y: makeInterpolateNumber(layer, property, startPos.y, endLastY),
            })
        } else if (!startPos && endPos) {
            list.push({
                x: makeInterpolateNumber(layer, property, startLastX, endPos.x),
                y: makeInterpolateNumber(layer, property, startLastY, endPos.y),
            })
        } else {
            list.push({
                x: makeInterpolateNumber(layer, property, startPos.x, endPos.x),
                y: makeInterpolateNumber(layer, property, startPos.y, endPos.y)
            })
        }
        
    }

    return (rate, t) => {
        var points = returnParser.joinPoints(list.map(it => {
            return {
                x: it.x(rate, t),
                y: it.y(rate, t)
            }
        }))

        return points;
    } 
}
