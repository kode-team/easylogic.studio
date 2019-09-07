
import { isNotUndefined, clone } from "../../util/functions/func";
import Point from "./Point";

const parseRegForPath = /([mMlLvVhHcCsSqQtTaAzZ]([^mMlLvVhHcCsSqQtTaAzZ]*))/g;
const splitReg = /[\b\t \,]/g;
var numberReg = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

const matrix = {

    multiply : function (a) {
        return function (b, startIndex) {
            var x = +b[startIndex];
            var y = +b[startIndex+1];

            return [
                a[0][0] * x + a[0][1] * x +  a[0][2],
                a[1][0] * y + a[1][1] * y +  a[1][2],
                1
            ];
        };
    },

    translate : function (tx, ty) {
        return this.multiply([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ]);
    },

    rotate : function (angle) {
        return this.multiply([
            [Math.cos(angle) , Math.sin(angle), 0]
                [-Math.sin(angle),  Math.cos(angle), 0],
            [0, 0, 1]
        ]);
    },

    scale : function (sx, sy) {
        return this.multiply([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]);
    },

    skewX : function (x) {
        return this.multiply([
            [1, x, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    },

    skewY : function (y) {
        return this.multiply([
            [1, 0, 0],
            [y, 1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionOrigin : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionX : function () {
        return this.multiply([
            [1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionY : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    }
};
 
export default class PathParser {

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

        var arr = this.pathString.match(parseRegForPath) || [];

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

                // if (prevPoint.command === 'Q') {    // 마지막 지점의 Q 는 항상 C 로 대체된다. 
                //     prevPoint.command = 'C'
                //     prevPoint.curve = true; 
                //     prevPoint.endPoint = Point.getReversePoint(prevPoint.startPoint, prevPoint.reversePoint)

                // }

                if (Point.isEqual(prevPoint.startPoint, firstPoint.startPoint)) {
                    prevPoint.connected = true; 

                    if (prevPoint.command === 'C') {
                        firstPoint.curve = true; 

                        if (Point.isEqual(firstPoint.endPoint, firstPoint.startPoint)) {
                            firstPoint.endPoint = Point.getReversePoint(prevPoint.startPoint, prevPoint.reversePoint);
                        }

                    }
                }


                //     // 연결되어 있다면 같이 선언한다. 
                //     prevPoint.reversePoint = clone(firstPoint.endPoint);
                //     firstPoint.reversePoint = clone(prevPoint.endPoint);
    
                //     var isPrevCurve = prevPoint.curve;
                //     var isFirstCurve = firstPoint.curve

                //     if (isPrevCurve && !isFirstCurve) {
                //         firstPoint.curve = true; 
                //     } else if (!isPrevCurve && isFirstCurve) {
                //         prevPoint.curve = true; 
                //     }
                // }
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
        this._loop(matrix.translate(tx, ty));
        return this;
    }

    translateTo (tx, ty) {
        return this.joinPath(this._loop(matrix.translate(tx, ty), true))
    }    

    scale (sx, sy) {
        this._loop(matrix.scale(sx, sy));
        return this;        
    }

    scaleTo (sx, sy) {
        return this.joinPath(this._loop(matrix.scale(sx, sy), true))
    }    

    rotate (angle) {
        this._loop(matrix.rotate(angle));
        return this;        
    }

    rotateTo (angle) {
        return this.joinPath(this._loop(matrix.rotate(angle), true))
    }        

    reflectionOrigin (angle) {
        this._loop(matrix.reflectionOrigin(angle));
        return this;        
    }

    reflectionOriginTo (angle) {
        return this.joinPath(this._loop(matrix.reflectionOrigin(angle), true))
    }            

    reflectionX (angle) {
        this._loop(matrix.reflectionX(angle));
        return this;        
    }

    reflectionXTo (angle) {
        return this.joinPath(this._loop(matrix.reflectionX(angle), true))
    }    

    reflectionY (angle) {
        this._loop(matrix.reflectionY(angle));
        return this;        
    }

    reflectionYTo (angle) {
        return this.joinPath(this._loop(matrix.reflectionY(angle), true))
    }    


    skewX (sx) {
        this._loop(matrix.skewX(sx));
        return this;        
    }


    skewXTo (angle) {
        return this.joinPath(this._loop(matrix.skewX(angle), true))
    }        

    skewY (sy) {
        this._loop(matrix.skewY(sy));
        return this;        
    }

    skewYTo (angle) {
        return this.joinPath(this._loop(matrix.skewY(angle), true))
    }        

    toString() {
        return this.joinPath()
    }
}