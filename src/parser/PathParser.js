
import { getBezierPointOneQuard, getCurveBBox } from "@core/functions/bezier";
import { isNotUndefined, clone } from "@core/functions/func";
import { degreeToRadian } from "@core/functions/math";
import { mat4, vec3 } from "gl-matrix";
import Point from "./Point";

const REG_PARSE_NUMBER_FOR_PATH = /([mMlLvVhHcCsSqQtTaAzZ]([^mMlLvVhHcCsSqQtTaAzZ]*))/g;
const splitReg = /[\b\t \,]/g;
var numberReg = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
 
export default class PathParser {

    /**
     * 
     * @param {string} pathString  SVG Path 문자열
     */
    constructor (pathString = '') {
        this.reset(pathString);
    }

    reset (pathString = '') {
        this.segments =  [];
        this.pathString = pathString; 
        
        this.parse()
    }

    resetSegments (segments) {
        this.segments = segments || [] 
        this.pathString = this.joinPath()
    }
	
    trim (str = '')  {
        var arr = str.match(numberReg) || [] 
        return arr.filter(it => it != '');
    }

    parse () {
        var arr = this.pathString.match(REG_PARSE_NUMBER_FOR_PATH) || [];

        this.segments = arr.map(s => {
            var command = s[0]
            var values = this.trim(s.replace(command, '')).map(it => +it);
            
            return { command, values }
        });

        // 상대 좌표를 모두 절 대 좌표로 변경 
        // 절대좌표로 변환이 되어야 transform 을 쉽게 적용 할 수 있다. 
        // 물론 트랜스폼 하기 전에 절대 좌표로 구조를 맞추고 
        // 다시 돌아올 수도 있겠지만 불필요한 작업이 너무 많아질 수도 있다. 
        this.segments = this.segments.map((s, index) => {
            switch(s.command) {
            case 'c':
            case 'm':
            case 'l':
            case 'q':
            case 's':
            case 't':
            case 'v':
            case 'h': 
                var prev = this.segments[index-1]
                var x = prev.values[prev.values.length -2 ]
                var y = prev.values[prev.values.length -1 ]

                 for (var i = 0, len = s.values.length; i < len; i += 2) {
                     s.values[i] += x
                     s.values[i+1] += y
                 }

                return {
                    command: s.command.toUpperCase(),
                    values: [...s.values]
                }; 
            default: 
                return s; 
            }
        })
    }

    convertGenerator () {

        var points = [] 

        for(var index = 0, len = this.segments.length; index < len; index++) {
            var s = this.segments[index]
            var nextSegment = this.segments[index+1]
            const {command, values} = s; 

            if (command === 'M' ) {
                var [x, y] = values
                points.push({ 
                    command, 
                    originalCommand: command,                    
                    startPoint: {x, y}, 
                    endPoint: {x, y}, 
                    reversePoint: {x, y},
                    curve: false
                })
            } else if (command === 'L') { 
                var prevPoint = Point.getPrevPoint(points, points.length);
                
                if (prevPoint.curve) {
                    var [x, y] = values
                    points.push({ 
                        command, 
                        originalCommand: command,                        
                        startPoint: {x, y}, 
                        endPoint: {x, y}, 
                        reversePoint: clone(prevPoint.endPoint),
                        curve: true
                    })
                } else {

                    var [x, y] = values
                    points.push({ 
                        command, 
                        originalCommand: command,                        
                        startPoint: {x, y}, 
                        endPoint: {x, y}, 
                        reversePoint: { x, y},
                        curve: false
                    })
                }

            } else if (command === 'Q') {
                var [cx1, cy1, x, y] = values; 
                var prevPoint = Point.getPrevPoint(points, points.length);

                if (prevPoint.curve) {  // 내가 Q 인데 앞의 포인트가  
                    var startPoint = {x, y}                    
                    var endPoint = {x, y}                    
                    var reversePoint = {x, y}                    
                    points.push({
                        command: 'L',
                        originalCommand: command,                        
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })

                    prevPoint.endPoint = { x: cx1, y: cy1 }

                } else {


                    if (nextSegment && nextSegment.command === 'L') {
                        prevPoint.curve = true; 
                        prevPoint.endPoint = { x: cx1, y: cy1 }

                        var startPoint = {x, y}
                        var reversePoint = { x, y} 
                        var endPoint = {x, y}
        
                        points.push({
                            command: 'L', 
                            originalCommand: command,                        
                            curve: false, 
                            startPoint,
                            endPoint,
                            reversePoint
                        })

                    } else {

                        var startPoint = {x, y}
                        var reversePoint = { x: cx1, y: cy1} 
                        var endPoint = {x, y}
        
                        points.push({
                            command, 
                            originalCommand: command,                        
                            curve: true, 
                            startPoint,
                            endPoint,
                            reversePoint
                        })
                    }


                }
            } else if (command === 'T') {
                var [x, y] = values; 
                // T 는 앞에 Q 가 있다는 소리 
                // Q 의 Control Point 반대편에 Control Point 가 있다고 치고 생각하자. 
                var prevSegment = segments[index-1]

                if (prevSegment && prevSegment.command === 'Q') {
                    var [cx1, cy1, sx, sy ] = prevSegment.values

                    var prevPoint = Point.getPrevPoint(points, points.length)
                    prevPoint.endPoint = Point.getReversePoint({x: sx, y: sy}, {x: cx1, y: cy1});

                    var startPoint = {x, y}
                    var endPoint = {x, y}                    
                    var reversePoint = {x, y}                    
                    points.push({
                        command: 'L',
                        originalCommand: command,
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })
                }


            } else if (command === 'C') {
                
                var prevPoint = Point.getPrevPoint(points, points.length)

                var [cx1, cy1, cx2, cy2, x, y] = values;                 
                var startPoint = {x, y}
                var reversePoint = { x: cx2, y: cy2} 
                var endPoint = {x, y}

                points.push({
                    command, 
                    originalCommand: command,                    
                    curve: true, 
                    startPoint,
                    endPoint,
                    reversePoint
                })

                if (prevPoint) {
                    prevPoint.curve = true; 
                    prevPoint.endPoint = {x: cx1, y: cy1 } 
                }    
            } else if (command === 'S') {
                var [x, y] = values; 
                // S 는 앞에 C,S 가 있다는 소리 
                // S 의 Control Point 반대편에 Control Point 가 있다고 치고 생각하자. 
                var prevSegment = segments[index-1]

                if (prevSegment && prevSegment.command === 'C') {
                    var [cx2, cy2, sx, sy ] = prevSegment.values

                    var prevPoint = Point.getPrevPoint(points, points.length)
                    prevPoint.endPoint = Point.getReversePoint(prevPoint.startPoint, prevPoint.reversePoint);

                    var startPoint = {x, y}
                    var endPoint = {x, y}                    
                    var reversePoint = { x: cx2, y: cy2}  
                    points.push({
                        command: 'Q',
                        originalCommand: command,
                        startPoint,
                        endPoint,
                        reversePoint,
                        curve: false
                    })
                }
                            
                
            } else if (command === 'Z') {
                var prevPoint = Point.getPrevPoint(points, points.length);
                var firstPoint = Point.getFirstPoint(points, points.length);

                if (Point.isEqual(prevPoint.startPoint, firstPoint.startPoint)) {
                    prevPoint.connected = true; 

                    prevPoint.endPoint = clone(firstPoint.endPoint)
                    firstPoint.reversePoint = clone(prevPoint.reversePoint)
                }

                prevPoint.close = true; 

            }
        }

        points = points.filter(p => !!p);

        return points;
    }

    length () {
        return this.segments.length;
    }

	setSegments (index, seg) {
        this.segments[index] = seg;
    }

	getSegments (index) {
        if (isNotUndefined(index)) {
            return this.segments[index];
        }
        return this.segments;
    }

	joinPath (segments) {
        var list = (segments || this.segments);
        return list.map(it => {
            return `${it.command} ${it.values.length ? it.values.join(' ') : ''}`
        }).join('')
    }

    each (callback, isReturn = false) {

        var newSegments = this.segments.map((segment, index) => {
            return callback.call(this, segment, index);
        })

        if (isReturn) {
            return newSegments;
        } else {
            this.segments = newSegments;
        }
    }

    _loop (m, isReturn = false) {
        return this.each(function(segment) {
            var v = segment.values;
            var c = segment.command;

            switch(c) {
            case 'M':
            case 'L':
                var result = m(v, 0);
                segment.values = [result[0], result[1]];
                break; 
            case 'V':
                var result = m([+v[0], 0]);
                segment.values = [result[0]];                
                break;
            case 'H':
                var result = m([0, +v[0]]);
                segment.values = [result[1]];                
                break; 
            case 'C':
            case 'S':
            case 'T':
            case 'Q':
                for(var i = 0, len = v.length; i < len; i+=2) {
                    var result = m(v, i);
                    segment.values[i] = result[0];
                    segment.values[i+1] = result[1];
                }
                break; 
            case 'A':

                break; 
            }

            return segment;

        }, isReturn);
    }

    clone () {
        return new PathParser(this.joinPath());
    }

    translate (tx, ty) {
        this.transformMat4(mat4.fromTranslation([], [tx, ty, 0]));
        return this;
    }

    translateTo (tx, ty) {
        return this.joinPath(this.transformMat4(mat4.fromTranslation([], [tx, ty, 0]), true));
    }    

    scale (sx, sy) {
        this.transformMat4(mat4.fromScaling([], [sx, sy, 1]));
        return this;
    }

    scaleTo (sx, sy) {
        return this.joinPath(this.transformMat4(mat4.fromScaling([], [sx, sy, 1]), true));        
    }    

    rotate (angle, centerX, centerY) {

        this.transformMat4(mat4.fromRotation([], degreeToRadian(angle), [centerX || 0, centerY || 0, 0]));
        return this;        
    }

    rotateTo (angle) {
        return this.joinPath(
                this.transformMat4(
                    mat4.fromRotation([], degreeToRadian(angle), [centerX || 0, centerY || 0, 0]), 
                    true
                )
            )
    }        

    reflectionOrigin () {
        this.transformMat4(mat4.fromScaling([], [-1, -1, 0]))
        return this;        
    }

    reflectionOriginTo () {
        return this.joinPath(
                    this.transformMat4(
                        mat4.fromScaling([], [-1, -1, 0]), 
                        true
                    )
                )
    }            

    flipX () {
        this.transformMat4(mat4.fromScaling([], [1, -1, 0]))
        return this;         
    }

    flipXTo () {
        return this.joinPath(
                    this.transformMat4(
                        mat4.fromScaling([], [1, -1, 0]), 
                        true
                    )
                )
    }    

    flipY () {
        this.transformMat4(mat4.fromScaling([], [-1, 1, 0]))
        return this;        
    }

    flipYTo () {
        return this.joinPath(
                this.transformMat4(
                    mat4.fromScaling([], [-1, 1, 0]), 
                    true
                )
            )
    }    


    skewX (angle) {
        this.transformMat4(
            mat4.fromValues(
                1, Math.tan(degreeToRadian(angle)), 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
        )
        return this;        
    }


    skewXTo (angle) {
        return this.joinPath(        
                    this.transformMat4(
                        mat4.fromValues(
                            1, Math.tan(degreeToRadian(angle)), 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ),
                        true
                    )
                )
    }        

    skewY (angle) {
        this.transformMat4(
            mat4.fromValues(
                1, 0, 0, 0,
                Math.tan(degreeToRadian(angle)), 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
        )
        return this;        
    }

    skewYTo (angle) {
        return this.joinPath(        
            this.transformMat4(
                mat4.fromValues(
                    1, 0, 0, 0,
                    Math.tan(degreeToRadian(angle)), 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ),
                true
            )
        )
    }    
    
    normalize () {

    }

    getBBox () {

        let minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;

        this.each(function(segment, index) {
            var v = segment.values;
            var c = segment.command;
            const prevSegment = this.segments[index-1];
            const accurancy = 1/10000;

            switch(c) {
            case 'M': 
            case 'L':

                minX = Math.min(minX, v[0])
                maxX = Math.max(maxX, v[0])

                minY = Math.min(minY, v[1])
                maxY = Math.max(maxY, v[1])
                break; 
            case 'V':
                minX = Math.min(minX, v[0])
                maxX = Math.max(maxX, v[0])
                break;
            case 'H':
                minY = Math.min(minY, v[1])
                maxY = Math.max(maxY, v[1])                
                break; 
            case 'C':

                getCurveBBox([
                    [prevSegment.values[prevSegment.values.length-2], prevSegment.values[prevSegment.values.length-1], 0],
                    [v[0], v[1], 0],
                    [v[2], v[3], 0],
                    [v[4], v[5], 0],
                ]).forEach(p => {
                    minX = Math.min(minX, p[0])
                    maxX = Math.max(maxX, p[0])
    
                    minY = Math.min(minY, p[1])
                    maxY = Math.max(maxY, p[1])
                })
                break;
            case 'Q':

                const newPoints = [
                    [prevSegment.values[prevSegment.values.length-2], prevSegment.values[prevSegment.values.length-1], 0],
                    [v[0], v[1], 0],
                    [v[2], v[3], 0],
                ].map(p => {
                    return {x: p[0], y: p[1]}
                })
                for(var i = 0; i <= 1; i += accurancy) {
                    const {x, y} = getBezierPointOneQuard(newPoints, i);

                    minX = Math.min(minX, x)
                    maxX = Math.max(maxX, x)
    
                    minY = Math.min(minY, y)
                    maxY = Math.max(maxY, y)
                }
                break;                
            case 'A':

                break; 
            }

            return segment;
        });


        return [
            [minX, minY, 0],
            [maxX, minY, 0],
            [maxX, maxY, 0],
            [minX, maxY, 0],
        ]
    }
    
    get d () {
        return this.toString()
    }

    toString() {
        return this.joinPath()
    }

    transformMat4(transformMatrix, isReturn = false ) {
        return this.each(function(segment) {
            var v = segment.values;
            var c = segment.command;

            switch(c) {
            case 'M':
            case 'L':
                var result = vec3.transformMat4([], [v[0], v[1], 0], transformMatrix); 
                segment.values = [result[0], result[1]]
                break; 
            case 'V':
                var result = vec3.transformMat4([], [+v[0], 0, 0], transformMatrix)
                segment.values = [result[0]];
                break;
            case 'H':
                var result = vec3.transformMat4([], [0, +v[0], 0], transformMatrix)
                segment.values = [result[1]];                
                break; 
            case 'C':
            case 'S':
            case 'T':
            case 'Q':
                for(var i = 0, len = v.length; i < len; i+=2) {
                    var result = vec3.transformMat4([], [v[i], v[i+1], 0], transformMatrix)
                    segment.values[i] = result[0];
                    segment.values[i+1] = result[1];
                }
                break; 
            case 'A':

                break; 
            }

            return segment;

        }, isReturn);
    }

    invert (transformMatrix) {
        this.transformMat4(mat4.invert([], transformMatrix));
    }

    get verties () {
        let arr = []

        let lastValues = []
        this.each(function(segment) {
            var v = segment.values;
            var c = segment.command;

            switch(c) {
            case 'M':
            case 'L':
                arr.push([...segment.values, 0])
                break; 
            case 'V':
                arr.push([ v[0], lastValues.pop(), 0 ])            
                break;
            case 'H':
                lastValues.pop()
                arr.push([ lastValues.pop(),  v[0], 0 ])                            
                break; 
            case 'C':
            case 'S':
            case 'T':
            case 'Q':
                for(var i = 0, len = v.length; i < len; i+=2) {
                    arr.push([v[i], v[i+1], 0]);
                }
                break; 
            case 'A':

                break; 
            }

            lastValues = v; 

        });

        return arr;
    }
}