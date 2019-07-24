import PathParser from "./PathParser";


const splitReg = /[\b\t \,]/g;
var numberReg = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
 
export default class PolygonParser extends PathParser {

    constructor (points = '') {
        super(points);
    }

    reset (points = '') {
        this.segments =  [];
        this.points = points; 
        
        this.parse()
    }

    parse () {

        var arr = this.points.trim().split(splitReg);

        var segments = [] 

        for(var i = 0, len = arr.length; i < len; i += 2) {
            segments.push({ x : +arr[i], y : +arr[i+1] });
        }
        this.segments = segments;
    }

    convertGenerator () {
        return this.segments;
    }

    length () {
        return this.segments.length;
    }

    joinPath(segments) {
        return this.joinPoints(segments)
    }

	joinPoints (segments) {
        var list = (segments || this.segments);
        return list.map(it => {
            return `${it.x},${it.y}`
        }).join(' ')
    }

    each (callback, isReturn = false) {

        var newSegments = this.segments.map(segment => {
            return callback.call(this, segment);
        })

        if (isReturn) {
            return newSegments;
        } else {
            this.segments = newSegments;
        }
    }

    _loop (m, isReturn = false) {
        return this.each(function(segment) {
            var [x, y] = m([segment.x, segment.y], 0)

            segment.x = x; 
            segment.y = y; 

            return segment;

        }, isReturn);
    }

    clone () {
        return new PolygonParser(this.joinPoints());
    }

    toString() {
        return this.joinPoints()
    }
}