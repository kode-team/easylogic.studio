import { getDist } from "@core/functions/math";
import Point from "@parser/Point";
import makeInterpolateLine from "./makeInterpolateLine";
import { getCurveDist, getQuardDist } from "@core/functions/bezier";
import makeInterpolateQuard from "./makeInterpolateQuard";
import makeInterpolateCubic from "./makeInterpolateCubic";

export default function makeInterpolateOffset (segments) {
    var interpolateList = [] 
    var startPoint = [] 
    segments.forEach((segment, index) => {

        switch(segment.command) {
        case 'M': 
            var [ex, ey] = segment.values
            startPoint = [ex, ey];break; 
        case 'm': 
            var [sx, sy] = startPoint
            var [ex, ey] = segment.values

            ex += sx;
            ey += sy;

            startPoint = [ex, ey];
            break; 
        case 'L': 
            var [sx, sy] = startPoint
            var [ex, ey] = segment.values
            interpolateList.push({
                command: segment.command,
                values: [sx, sy, ex, ey],
                length: getDist(sx, sy, ex, ey),
                interpolate: makeInterpolateLine(sx, sy, ex, ey)
            })
            startPoint = [ex, ey];
            break; 
        case 'l': 
            var [sx, sy] = startPoint
            var [ex, ey] = segment.values

            ex += sx; 
            ey += sy; 

            interpolateList.push({
                command: segment.command,
                values: [sx, sy, ex, ey],
                length: getDist(sx, sy, ex, ey),
                interpolate: makeInterpolateLine(sx, sy, ex, ey)
            })
            startPoint = [ex, ey];
            break; 
        case 'C':
            var [sx, sy] = startPoint
            var [cx1, cy1, cx2, cy2, ex, ey] = segment.values
            interpolateList.push({
                command: segment.command,
                values: [sx, sy, cx1, cy1, cx2, cy2, ex, ey],
                length: getCurveDist(sx, sy, cx1, cy1, cx2, cy2, ex, ey),
                interpolate: makeInterpolateCubic(sx, sy, cx1, cy1, cx2, cy2, ex, ey)
            })
            startPoint = [ex, ey];
            break;                     
        case 'c':
            var [sx, sy] = startPoint
            var [cx1, cy1, cx2, cy2, ex, ey] = segment.values

            cx1 += sx;
            cx2 += sx;
            ex += sx;

            cy1 += sy;
            cy2 += sy;
            ey += sy;

            interpolateList.push({
                command: segment.command,
                values: [sx, sy, cx1, cy1, cx2, cy2, ex, ey],
                length: getCurveDist(sx, sy, cx1, cy1, cx2, cy2, ex, ey),
                interpolate: makeInterpolateCubic(sx, sy, cx1, cy1, cx2, cy2, ex, ey)
            })
            startPoint = [ex, ey];
            break;       
        case 'Q':
            var [sx, sy] = startPoint
            var [cx1, cy1, ex, ey] = segment.values
            interpolateList.push({
                command: segment.command,
                values: [sx, sy, cx1, cy1, ex, ey],
                length: getQuardDist(sx, sy, cx1, cy1, ex, ey),
                interpolate: makeInterpolateQuard(sx, sy, cx1, cy1, ex, ey)
            })
            startPoint = [ex, ey];
            break;
        case 'q':
            var [sx, sy] = startPoint
            var [cx1, cy1, ex, ey] = segment.values

            cx1 += sx;
            ex += sx;

            cy1 += sy;
            ey += sy;

            interpolateList.push({
                command: segment.command,
                values: [sx, sy, cx1, cy1, ex, ey],                
                length: getQuardDist(sx, sy, cx1, cy1, ex, ey),
                interpolate: makeInterpolateQuard(sx, sy, cx1, cy1, ex, ey)
            })
            startPoint = [ex, ey];
            break;   
        case 'S':
            var [sx, sy] = startPoint
            var [cx2, cy2, ex, ey] = segment.values

            var prevSegment = interpolateList[interpolateList.length - 1];

            if (['C', 'c', 'S', 's'].includes(prevSegment.command)) {
                var [_, _, _, _, preC1x, preC1y, preEx, preEy] = prevSegment.values 

                var {x: cx1, y: cy1 } = Point.getReversePoint({x: preEx, y: preEy}, {x: preC1x, preC1y})

                interpolateList.push({
                    command: segment.command,                
                    values: [sx, sy, cx1, cy1, cx2, cy2, ex, ey],
                    length: getCubicDist(sx, sy, cx1, cy1, cx2, cy2, ex, ey),
                    interpolate: makeInterpolateCubic(sx, sy, cx1, cy1, cx2, cy2, ex, ey)
                })
                startPoint = [ex, ey];
                break;                                
            }
        case 's':
            var [sx, sy] = startPoint
            var [cx2, cy2, ex, ey] = segment.values

            cx2 += sx;
            ex += sx;

            cy2 += sy;
            ey += sy;

            var prevSegment = interpolateList[interpolateList.length - 1];

            if (['C', 'c', 'S', 's'].includes(prevSegment.command)) {
                var [_, _, _, _, preC1x, preC1y, preEx, preEy] = prevSegment.values 

                var {x: cx1, y: cy1 } = Point.getReversePoint({x: preEx, y: preEy}, {x: preC1x, preC1y})

                interpolateList.push({
                    command: segment.command,                
                    values: [sx, sy, cx1, cy1, cx2, cy2, ex, ey],
                    length: getCubicDist(sx, sy, cx1, cy1, cx2, cy2, ex, ey),
                    interpolate: makeInterpolateCubic(sx, sy, cx1, cy1, cx2, cy2, ex, ey)
                })
                startPoint = [ex, ey];
                break;                                
            }            


        case 'T':
            var [sx, sy] = startPoint
            var [ex, ey] = segment.values


            var prevSegment = interpolateList[interpolateList.length - 1];

            if (['Q', 'q', 'T', 't'].includes(prevSegment.command)) {
                var [_, _, preC1x, preC1y, preEx, preEy] = prevSegment.values 

                var {x: cx1, y: cy1 } = Point.getReversePoint({x: preEx, y: preEy}, {x: preC1x, preC1y})

                interpolateList.push({
                    command: segment.command,
                    values: [sx, sy, cx1, cy1, ex, ey],
                    length: getQuardDist(sx, sy, cx1, cy1, ex, ey),
                    interpolate: makeInterpolateQuard(sx, sy, cx1, cy1, ex, ey)
                })
                startPoint = [ex, ey];
            }
            break;    
        case 't':
            var [sx, sy] = startPoint
            var [ex, ey] = segment.values

            ex += sx;
            ey += sy;

            var prevSegment = interpolateList[interpolateList.length - 1];

            if (['Q', 'q', 'T', 't'].includes(prevSegment.command)) {
                var [_, _, preC1x, preC1y, preEx, preEy] = prevSegment.values 

                var {x: cx1, y: cy1 } = Point.getReversePoint({x: preEx, y: preEy}, {x: preC1x, preC1y})

                interpolateList.push({
                    command: segment.command,
                    values: [sx, sy, cx1, cy1, ex, ey],
                    length: getQuardDist(sx, sy, cx1, cy1, ex, ey),
                    interpolate: makeInterpolateQuard(sx, sy, cx1, cy1, ex, ey)
                })
                startPoint = [ex, ey];
            }
            break;                         
        }    

    })


    var totalLength = 0; 
    interpolateList.forEach(it => {
        totalLength += it.length; 
    })

    var start = 0; 
    interpolateList.forEach(it => {
        it.startT = start / totalLength 
        it.endT = (start + it.length) / totalLength 
        it.totalLength = totalLength;

        start += it.length 
    })
    

    return { totalLength, interpolateList};

}