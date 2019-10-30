import SegmentManager from "./SegmentManager";
import { clone, OBJECT_TO_PROPERTY } from "../../util/functions/func";
import { getDist, calculateAngle, getXYInCircle, calculateAngle360, degreeToRadian } from "../../util/functions/math";
import Point from "./Point";
import PathStringManager from "./PathStringManager";
import matrix from "../../util/functions/matrix";

const SEGMENT_DIRECTION = ['startPoint', 'endPoint', 'reversePoint']


function calculateSnapPoint (points, sourceKey, target, distanceValue, dist) {
    var checkedPointList = points.filter(p => {
        if (!p) return false;
        return Math.abs(p[sourceKey] - target) <= dist 
    }).map(p => {
        return {dist: Math.abs(p[sourceKey] - target), point: p}
    })

    checkedPointList.sort( (a, b) => {
        return a.dist > b.dist ? -1 : 1; 
    })

    var point = null; 

    if (checkedPointList.length) {
        point = checkedPointList[0].point
        distanceValue += point[sourceKey] - target
    }

    return { point, distanceValue }; 
}


function calculateMovePointSnap(points, moveXY, dist = 1) {
    var snapPointX = calculatePointDist(points, 'x', moveXY.x, dist)
    var snapPointY = calculatePointDist(points, 'y', moveXY.y, dist)        

    var snapEndPoint = {...moveXY}
    if (snapPointX) { snapEndPoint.x = snapPointX.x; }
    if (snapPointY) { snapEndPoint.y = snapPointY.y;}

    var snapPointList = [] 

    if (snapPointX) { snapPointList.push({ startPoint: snapPointX, endPoint: snapEndPoint })}
    if (snapPointY) { snapPointList.push({ startPoint: snapPointY, endPoint: snapEndPoint})}      
 
    return { snapPointList, moveXY: snapEndPoint }
}    



function calculatePointDist (points, sourceKey, target, dist) {
    var checkedPointList = []
    var arr = SEGMENT_DIRECTION
    points.filter(p => p).forEach(p => {

        arr.filter(key => p[key]).forEach(key => {
            var point = p[key];
            var tempDist = Math.abs(point[sourceKey] - target)
            if (tempDist <= dist) {
                checkedPointList.push({ dist: tempDist, point })
            }
        })
    })

    checkedPointList.sort( (a, b) => {
        return a.dist > b.dist ? 1 : -1; 
    })

    return (checkedPointList.length) ? checkedPointList[0].point : null 
}



function toPath (points, minX, minY, scale = 1) {
    var d = [];

    for(var index = 0, len = points.length; index < len; index++) {
        var currentIndex = index; 
        var current = points[currentIndex];                

        if (!current) continue; 

        if (current.command === 'M') {
            d.push({command: 'M', values: [ current.startPoint ]});             
        } else {
            var prevPoint = Point.getPrevPoint(points, index);                
            if (current.curve === false) {  // 1번이 점이면 
                // 꼭지점
                if (prevPoint.curve === false) {
                    d.push({command: 'L', values: [ current.startPoint ]});
                } else {
                    // 이전이 drag이고  지금이 점일 때  한쪽만 segment 가 있으므로 2차 Curve                         
                    d.push({command: 'Q', values: [ prevPoint.endPoint, current.startPoint]});
                }
            } else {
                // 이전은 점이고 현재가 드래그 일 때 , 한쪽만 segment 가 있으므로 2차 Curve 
                if (prevPoint.curve === false) { 

                    if (Point.isEqual(current.reversePoint, current.startPoint)) {
                        d.push({ command: 'L', values: [current.startPoint] })
                    } else {
                        d.push({command: 'Q', values: [current.reversePoint, current.startPoint ]});
                    }

                } else {
                    d.push({command: 'C', values: [ prevPoint.endPoint, current.reversePoint, current.startPoint ]});
                }
            }
        }

        if (current.close) {
            d.push({command: 'Z'});
        }
    }

    var dString = d.map(segment => {
        return calculateRelativePosition (minX, minY, segment, scale);
    }).join(' ')

    return {
        d: dString
    };
}


function calculateRelativePosition (minX, minY, segment, scale = 1) {

    var { command, values } = segment;

    switch(command) {
    case 'Z':
        return 'Z';
    default:
        var str = values.map(v => {
            var tx = (v.x - minX) === 0 ? 0 : (v.x - minX) / scale; 
            var ty = (v.y - minY) === 0 ? 0 : (v.y - minY) / scale; 

            return `${tx} ${ty}`
        }).join(' ')

        return `${command} ${str}`
    }
}


export default class PathGenerator {

    constructor (pathEditor) {
        
        this.pathEditor = pathEditor;
        this.pathStringManager = new PathStringManager();
        this.guideLineManager = new PathStringManager();
        this.segmentManager = new SegmentManager();
        this.initialize()
    }

    initialize () {
        this.splitLines = [] 
        this.guideLineManager.reset();
        this.segmentManager.reset();
        this.pathStringManager.reset();
    }

    get state () {
        return this.pathEditor.state; 
    }

    get clonePoints() {
        return [...this.state.points]
    }

    applyMatrix (p, ...mat) {

        var {x, y} = p; 

        mat.forEach(m => {
            if (m) {
                [x, y] = m([x, y], 0)
            }
        })

        return {x, y}
    }

    applyTransform (...mat) {

        var first = matrix.matrix2d.translate(-this.transformRect.x, -this.transformRect.y);
        var second = matrix.matrix2d.translate(this.transformRect.x, this.transformRect.y);

        this.transformPoints.forEach((p, index) => {
            var realPoint = this.state.points[index];

            Object.assign(realPoint.startPoint, this.applyMatrix(p.startPoint, first, ...mat, second)) ;
            Object.assign(realPoint.endPoint, this.applyMatrix(p.endPoint, first, ...mat, second)) ;
            Object.assign(realPoint.reversePoint, this.applyMatrix(p.reversePoint, first, ...mat, second)) ;
        })

    }

    transform (type, dx = 0, dy = 0) {

        var {x, y, width, height} = this.transformRect;

        switch(type) {
        case 'flipX':
            this.applyTransform(
                matrix.matrix2d.translate(-dx, 0),
                matrix.matrix2d.flipX()
            ); 
            break; 
        case 'flipY':
            this.applyTransform(
                matrix.matrix2d.translate(0, -dy),
                matrix.matrix2d.flipY()
            ); 
            break;      
        case 'flip':
            this.applyTransform(
                matrix.matrix2d.translate(-dx, -dy),
                matrix.matrix2d.flip()
            ); 
            break;                         
        case 'to move': 
            this.applyTransform(matrix.matrix2d.translate(dx, dy)); 
            break; 
        case 'to skewX': 
            var hw = width/2;
            var hh = height/2;

            var a = calculateAngle(hw, hh)
            var b = calculateAngle(hw + dx, hh)

            var xAngle = a - b;        
            this.applyTransform(matrix.matrix2d.skewX(degreeToRadian(xAngle))); 
            break;             
        case 'to skewY': 
            var hw = width/2;
            var hh = height/2;

            var a = calculateAngle(hw, hh)
            var b = calculateAngle(hw, hh + dy)

            var yAngle = b - a;        
            this.applyTransform(
                matrix.matrix2d.skewY(degreeToRadian(yAngle))
            ); 
            break;                         
        case 'to bottom right':

            var sx =  (width + dx) === 0 ? 0  : (width + dx) / width;
            var sy =  (height + dy) === 0 ? 0 : (height + dy) / height;

            this.applyTransform(
                matrix.matrix2d.scale(sx, sy)
            ); 
            break; 
        case 'to right':

            var sx =  (width + dx) === 0 ? 0  : (width + dx) / width;

            this.applyTransform(
                matrix.matrix2d.scale(sx, 1)
            ); 
            break;             
        case 'to bottom':
                var sy =  (height + dy) === 0 ? 0 : (height + dy) / height;

                this.applyTransform(
                    matrix.matrix2d.scale(1, sy)
                ); 
                break;             

        case 'to top right':

            var sx =  (width + dx) === 0 ? 0  : (width + dx) / width;
            var sy =  (height - dy) === 0 ? 0 : (height - dy) / height;

            this.applyTransform(
                matrix.matrix2d.scale(sx, sy),
                matrix.matrix2d.translate(0, dy)
            ); 
            break;             
        case 'to top left':

            var sx =  (width - dx) === 0 ? 0 : (width - dx)/ width;
            var sy =  (height - dy) === 0 ? 0 : (height - dy) / height;

            this.applyTransform(
                matrix.matrix2d.scale(sx, sy),
                matrix.matrix2d.translate(dx, dy)
            ); 
            break;    
        case 'to left':

            var sx =  (width - dx) === 0 ? 0 : (width - dx)/ width;

            this.applyTransform(
                matrix.matrix2d.scale(sx, 1),
                matrix.matrix2d.translate(dx, 0)
            ); 
            break;                      
        case 'to top':

            var sy =  (height - dy) === 0 ? 0 : (height - dy) / height

            this.applyTransform(
                matrix.matrix2d.scale(1, sy),
                matrix.matrix2d.translate(0, dy)
            ); 
            break;          
        case 'to bottom left':

            var sx =  (width - dx) === 0 ? 0 : (width - dx)/ width;
            var sy =  (height + dy) === 0 ? 0 : (height + dy) / height;

            this.applyTransform(
                matrix.matrix2d.scale(sx, sy),
                matrix.matrix2d.translate(dx, 0)
            ); 
            break;                                     
        }
    }

    initTransform (rect) {
        this.transformRect = clone(rect);
        this.transformPoints = this.clonePoints.map(p => {
            
            return {
                startPoint: clone(p.startPoint),
                endPoint: clone(p.endPoint),
                reversePoint: clone(p.reversePoint)
            }
        });   
    }

    setConnectedPoint (dx, dy) {
        var state = this.state
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;

        var endPoint = {x, y}
        var reversePoint = {x, y}

        if (state.dragPoints) {
            state.reversePoint = Point.getReversePoint(state.startPoint, endPoint);
        }


        var point = {
            startPoint: state.startPoint,
            endPoint: endPoint,
            curve: !!state.dragPoints,
            reversePoint: reversePoint,
            connected: true, 
            close: true 
        }   

        state.points.push(point);
    }

    setCachePoint (index, segmentKey) {

        var state = this.state; 
        var { points } = state; 

        this.snapPointList = []     // 객체 처음 움직일 때 snap line 은 초기화 
        state.selectedIndex = index; 
        state.connectedPoint =  Point.getPrevPoint(points, index)

        if (state.connectedPoint && !state.connectedPoint.connected) {
            state.connectedPoint = null; 
        }

        state.segment = Point.getIndexPoint(points, index)

        // 연결된 포인트인 경우 , 처음 지점 포인트를 가지고 온다. 
        if (state.segment.connected) {  
            state.connectedPoint = Point.getNextPoint(points, index);
        }

        var isFirstSegment = Point.isFirst(state.segment)

        if (isFirstSegment) {
            var lastPoint = Point.getLastPoint(points, index);

            if (lastPoint.connected) {
                state.connectedPoint = lastPoint;
            }
        }

        state.segmentKey = segmentKey
        state.isCurveSegment = state.segment.curve && state.segmentKey != 'startPoint'
        state.originalSegment = clone(state.segment);

        if (state.connectedPoint) {
            state.originalConnectedPoint = clone(state.connectedPoint);
        }

        state.cachedPoints = [] 
        points.filter(p => p && p != state.segment).forEach(p => {
            state.cachedPoints.push(p.startPoint, p.reversePoint, p.endPoint)
        })

    }

    moveSegment (segmentKey, dx, dy) {
        var state = this.state; 

        var originPoint = state.originalSegment[segmentKey]
        var targetPoint = state.segment[segmentKey]

        if (originPoint) {
            targetPoint.x = originPoint.x + dx;
            targetPoint.y = originPoint.y + dy;     
        }
    }

    calculateToCurve (point, nextPoint, prevPoint) {

        var centerX = (nextPoint.startPoint.x + prevPoint.startPoint.x) /2;
        var centerY = (nextPoint.startPoint.y + prevPoint.startPoint.y) /2;

        var dx = (nextPoint.startPoint.x - centerX)/2
        var dy = (nextPoint.startPoint.y - centerY)/2

        point.endPoint = {
            x: point.startPoint.x + dx,
            y: point.startPoint.y + dy
        }

        point.reversePoint = {
            x: point.startPoint.x - dx,
            y: point.startPoint.y - dy
        }

        return {dx, dy}
    }

    convertToCurve (index) {


        var {points} = this.state; 
        var point = points[index];

        if (point.curve) {
            // curve 가 직선으로 
            point.curve = false; 
            point.reversePoint = clone(point.startPoint);
            point.endPoint = clone(point.startPoint);

            if (point.command === 'M') {
                var lastPoint = Point.getPrevPoint(points, point.index)

                if (lastPoint.connected) {
                    lastPoint.curve = false; 
                    lastPoint.reversePoint = clone(lastPoint.startPoint);
                    lastPoint.endPoint = clone(lastPoint.startPoint);
                }
            } else {

                var nextPoint = Point.getNextPoint(points, index);

                if (nextPoint && nextPoint.command === 'M') {
                    // 다음이 처음일 때 
                    var firstPoint = nextPoint;
    
                    firstPoint.curve = false; 
                    firstPoint.reversePoint = clone(firstPoint.startPoint);
                    firstPoint.endPoint = clone(firstPoint.startPoint);                
                }
            }



        } else {
            point.curve = true; 

            var prevPoint = Point.getPrevPoint(points, index);
            var nextPoint = Point.getNextPoint(points, index);

            if (nextPoint && nextPoint.index < index && nextPoint.command === 'M') {  
                // 현재 포인트가 마지막 일 때 connected 상태를 보고 
                // firstPoint 랑 맞춘다. 

                var firstPoint = nextPoint;

                nextPoint = Point.getNextPoint(points, firstPoint.index);

                this.calculateToCurve(point, nextPoint, prevPoint)

                // 처음도 같이 변경해주기 
                firstPoint.curve = true; 
                firstPoint.endPoint = clone(point.endPoint)
                firstPoint.reversePoint = clone(point.reversePoint)

            } else if (nextPoint && nextPoint.index > index && nextPoint.command !== 'M') {

                this.calculateToCurve(point, nextPoint, prevPoint)
            } else if (!nextPoint && prevPoint) {

                // 이전 점만 있고 다음 점이 없다면 
                var centerX = (point.startPoint.x - prevPoint.startPoint.x)/3;
                var centerY = (point.startPoint.y - prevPoint.startPoint.y)/3;

                point.endPoint = { x : point.startPoint.x + centerX, y: point.startPoint.y + centerY  } 
                point.reversePoint = Point.getReversePoint(point.startPoint, point.endPoint)
            } else if (!prevPoint && nextPoint) {
                var centerX = (point.startPoint.x - nextPoint.startPoint.x)/3;
                var centerY = (point.startPoint.y - nextPoint.startPoint.y)/3;

                point.endPoint = { x : point.startPoint.x + centerX, y: point.startPoint.y + centerY  } 
                point.reverse = Point.getReversePoint(point.startPoint, point.endPoint)
            }            

        }
    }


    moveCurveSegment(segmentKey, dx, dy) {
        var state = this.state; 
        this.moveSegment(segmentKey, dx, dy);

        var targetSegmentKey = segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint'

        state.segment[targetSegmentKey] = Point.getReversePoint(state.segment.startPoint, state.segment[segmentKey]);
    }

    rotateSegmentTarget (segmentKey, target) {
        var state = this.state; 
        if (state.originalSegment && state.segment) {
            var {x: cx, y: cy} = state.originalSegment.startPoint;
            var {x: rx, y: ry} = state.segment[segmentKey];
            var {x: tx, y: ty} = state.originalSegment[target]
    
            var {x, y} = getXYInCircle(
                calculateAngle360(rx - cx, ry - cy), 
                getDist(tx, ty, cx, cy), 
                cx, 
                cy
            );                 
    
            state.segment[target] = {x, y}
        }

    }

    rotateSegment (segmentKey) {
        this.rotateSegmentTarget(segmentKey, segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint');
    }

    calculateSnap( segmentKey, dx, dy, dist = 1) {
        var state = this.state; 
        var cachedPoints = state.cachedPoints

        var original = state.originalSegment[segmentKey]

        if (!segmentKey) {
            return { dx, dy, snapPointList: []}
        }

        var realX = original.x + dx;
        var realY = original.y + dy;

        var {point: snapPointX, distanceValue: dx } = calculateSnapPoint(cachedPoints, 'x', realX, dx, dist);
        var {point: snapPointY, distanceValue: dy } = calculateSnapPoint(cachedPoints, 'y', realY, dy, dist);

        var snapEndPoint = {
            x : original.x + dx,
            y : original.y + dy
        }

        var snapPointList = [] 
        if (snapPointX) { snapPointList.push({ startPoint: snapPointX, endPoint: snapEndPoint })}
        if (snapPointY) { snapPointList.push({ startPoint: snapPointY, endPoint: snapEndPoint }) }        
     
        return { dx, dy, snapPointList }
    }

    copySegment(from, to) {
        to.startPoint =  clone(from.startPoint)
        to.endPoint =  clone(from.endPoint)
        to.reversePoint =  clone(from.reversePoint)
    }

    move (dx, dy, e) {
        var state = this.state;
        var { isCurveSegment, segmentKey, connectedPoint} = state 

        var { dx, dy, snapPointList} = this.calculateSnap(segmentKey, dx, dy, 2);
    
        this.snapPointList = snapPointList || []

        if (isCurveSegment) {
            if (e.shiftKey) {   
                // 상대편 길이 동일하게 curve 움직이기 
                this.moveSegment(segmentKey, dx, dy);
                var targetSegmentKey = segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint'
                state.segment[targetSegmentKey] = Point.getReversePoint(state.segment.startPoint, state.segment[segmentKey]);                

            } else if (e.altKey) {  
                this.moveSegment(segmentKey, dx, dy);
            } else {    // Curve 만 움직이기 
                // 해당 segment 먼저 움직이고 
                this.moveSegment(segmentKey, dx, dy);
                
                // 상대편 rotate 하는데 
                this.rotateSegment(segmentKey);
            }
        } else {
            this.moveSegment('startPoint', dx, dy);
            this.moveSegment('endPoint', dx, dy);
            this.moveSegment('reversePoint', dx, dy);
        }
        connectedPoint && this.copySegment(state.segment, state.connectedPoint)
    }

    moveEnd (dx, dy) {
        var state = this.state; 
        var {points} = state; 
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;
        
        var endPoint = {x, y}
        var reversePoint = {x, y}

        if (state.dragPoints) { // drag 상태 일 때 
            reversePoint = Point.getReversePoint(state.startPoint, endPoint);
        }

        points.push({
            command: state.clickCount === 0 ? 'M' : '',
            startPoint: state.startPoint,
            endPoint: endPoint,
            curve: !!state.dragPoints,
            reversePoint: reversePoint
        })

        state.startPoint = null
        state.dragPoints = false;
        state.moveXY = null;
    }

    setPoint (obj) {

        var p0 = obj.first[0] 
        var p1 = obj.second[obj.second.length-1]

        var allPoints = this.clonePoints

        var firstItem = Point.getPoint(allPoints, p0)
        var secondItem = Point.getPoint(allPoints, p1)        

        var newPoints = [
            {...firstItem, endPoint: obj.first[1]},
            {startPoint: obj.first[3], reversePoint: obj.first[2], curve: true , endPoint: obj.second[1]},
            {...secondItem, reversePoint: obj.second[2]}
        ]

        var firstIndex = Point.getIndex(allPoints, p0);         

        allPoints.splice(firstIndex, 2, ...newPoints);

        this.state.points = allPoints;

    }

    setPointQuard (obj) {

        var p0 = obj.first[0] 
        var p1 = obj.second[obj.second.length-1]

        var allPoints = this.clonePoints

        var firstItem = Point.getPoint(allPoints, p0)

        var fx = firstItem.startPoint.x + (firstItem.endPoint.x - firstItem.startPoint.x) / 3 
        var fy = firstItem.startPoint.y + (firstItem.endPoint.y - firstItem.startPoint.y) / 3 

        var newPoints = [
            {...firstItem, endPoint: {x: fx, y : fy }},
            {startPoint: obj.first[2], reversePoint: obj.first[1], curve: true , endPoint: obj.second[1]}
        ]

        var firstIndex = Point.getIndex(allPoints, p0); 

        allPoints.splice(firstIndex, 1, ...newPoints);

        this.state.points = allPoints;

    }


    setPointLine (obj) {

        var p0 = obj.first[0] 

        var allPoints = this.clonePoints

        var newPoints = [
            {command: 'L', startPoint: obj.first[1], curve: false , endPoint: obj.first[1], reversePoint: obj.first[1]},
        ]

        var firstIndex = Point.getIndex(allPoints, p0); 

        allPoints.splice(firstIndex+1, 0, ...newPoints);

        this.state.points = allPoints;

    }

    toPath (minX, minY, scale = 1) {
        return toPath(this.clonePoints, minX, minY, scale)
    }

    changeScale () {

        this.pathEditor.scale; 
    }

    makeSVGPath() {

        this.initialize();

        this.makePointGuide(this.clonePoints)

        this.makeMovePositionGuide();

        return this.toSVGString()
    }

    makeTriangleDistancePointGuide (first, second) {

        var minX = Math.min(first.startPoint.x, second.startPoint.x);
        var maxX = Math.max(first.startPoint.x, second.startPoint.x);

        var minY = Math.min(first.startPoint.y, second.startPoint.y);
        var maxY = Math.max(first.startPoint.y, second.startPoint.y);

        // right bottom 
        if (first.startPoint.x < second.startPoint.x && first.startPoint.y < second.startPoint.y) {
            this.segmentManager
            .addDistanceLine({x: minX, y: minY}, {x: maxX, y : minY} )
            .addDistanceLine({x: maxX, y: minY}, {x: maxX, y : maxY} )            


            var centerX = minX
            var centerY = minY 
            var angle = calculateAngle360(maxX-minX, maxY-minY) - 180
            var dist = 20;            
            var {x, y} = getXYInCircle(
                0, 
                dist, 
                centerX, 
                centerY
            );                 
            var {x: tx, y: ty} = getXYInCircle(
                angle/2, 
                dist, 
                centerX, 
                centerY
            );     
            
            var last = getXYInCircle(
                angle, 
                dist, 
                centerX, 
                centerY
            );                 

            this.segmentManager
                .addDistanceAngle(last, dist, dist, angle, {x, y}, {x: x-dist, y})
                .addText({x: tx-5, y: ty+15}, angle)
        } else if (first.startPoint.x < second.startPoint.x && first.startPoint.y > second.startPoint.y) {
            // right top  
            this.segmentManager
            .addDistanceLine({x: minX, y: maxY}, {x: maxX, y : maxY} )
            .addDistanceLine({x: maxX, y: minY}, {x: maxX, y : maxY} )            
        } else if (first.startPoint.x > second.startPoint.x && first.startPoint.y > second.startPoint.y) {
            // left top 
            this.segmentManager
            .addDistanceLine({x: minX, y: minY}, {x: minX, y : maxY} )
            .addDistanceLine({x: minX, y: maxY}, {x: maxX, y : maxY} )
        } else if (first.startPoint.x > second.startPoint.x && first.startPoint.y < second.startPoint.y) {
            // left bottom 
            this.segmentManager
            .addDistanceLine({x: minX, y: maxY}, {x: maxX, y : maxY} )
            .addDistanceLine({x: maxX, y: minY}, {x: maxX, y : maxY} )            
        }

    }

    makeDistancePointGuide (prevPoint, current, nextPoint, index) {

        if (current.selected) {

            if (prevPoint) {
                this.makeTriangleDistancePointGuide(prevPoint, current);
            }

            if (nextPoint) {
                this.makeTriangleDistancePointGuide(current, nextPoint);
            }

        }
    }

    makeStartPointGuide (prevPoint, current, nextPoint, index) {
        current.startPoint.isFirst = true; 

        this.pathStringManager.M(current.startPoint)        

        if (current.curve === false) {
            this.segmentManager
                .addPoint({}, current.startPoint, index, 'startPoint', current.selected)

            if (!current.startPoint.isLast) {
                this.segmentManager.addText(current.startPoint, index+1);
            }


        } else {      
            this.segmentManager
                .addPoint({}, current.startPoint, index, 'startPoint', current.selected)                        
                .addGuideLine(current.startPoint, current.endPoint)
                .addCurvePoint(current.endPoint, index, 'endPoint')
        }


    }

    makeMiddlePointGuideSegment (prevPoint, current, nextPoint, index) {
        var mng = this.segmentManager;
        if (current.curve === false) { 
            // 꼭지점
            if (prevPoint.curve === false) {
                mng.addPoint({}, current.startPoint, index, 'startPoint', current.selected)   

                if (!current.startPoint.isLast) {
                    mng.addText(current.startPoint, index+1);
                }
            } else {

                mng
                .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                .addCurvePoint(current.startPoint, index, 'startPoint', current.selected)
                .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint');

                if (!current.startPoint.isLast) {
                    mng.addText(current.startPoint, index+1);
                }
        
            }


        } else {    // 현재가 curve 일 때 
            if (prevPoint.curve === false) { 

                if (Point.isEqual(current.reversePoint, current.startPoint)) {
                    mng.addPoint({},current.startPoint, index, 'startPoint', current.selected)

                    if (!current.startPoint.isLast) {
                        mng.addText(current.startPoint, index+1);
                    }                                       
                } else {
                    mng
                    .addGuideLine(current.startPoint, current.reversePoint)
                    .addCurvePoint(current.startPoint, index, 'startPoint', current.selected)
                    .addCurvePoint(current.reversePoint, index, 'reversePoint');     

                    if (!current.startPoint.isLast) {
                        mng.addText(current.startPoint, index+1);
                    }
                }


            } else {

                if (current.connected) {
                    mng
                    .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                    .addGuideLine(current.startPoint, current.reversePoint)
                    .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint')
                    .addCurvePoint(current.reversePoint, index, 'reversePoint');
                } else {
                    mng
                    .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                    .addGuideLine(current.startPoint, current.reversePoint)
                    .addCurvePoint(current.startPoint, index, 'startPoint', current.selected)
                    .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint')                        
                    .addCurvePoint(current.reversePoint, index, 'reversePoint');

                    if (!current.startPoint.isLast) {
                        mng.addText(current.startPoint, index+1);
                    }                        

                }
            }
        }
    }

    makeMiddlePointGuideRealPath (prevPoint, current, nextPoint, index) {
        var mng = this.pathStringManager;
        if (current.curve === false) { 
            // 꼭지점
            if (prevPoint.curve === false) {
                mng.L(current.startPoint)
            } else {
                mng.Q(prevPoint.endPoint, current.startPoint)        
            }
        } else {    // 현재가 curve 일 때 
            if (prevPoint.curve === false) { 
                if (Point.isEqual(current.reversePoint, current.startPoint)) {
                    mng.L( current.startPoint);
                } else {
                    mng.Q( current.reversePoint, current.startPoint);
                }
            } else {
                mng.C(prevPoint.endPoint, current.reversePoint, current.startPoint)
            }
        }
    }


    makeMiddlePointGuideSplitLine (prevPoint, current, nextPoint, index) {

        if (current.curve === false) { 
            // 꼭지점
            if (prevPoint.curve === false) {
                this.splitLines.push(
                    new PathStringManager()
                        .M(prevPoint.startPoint)
                        .L(current.startPoint)
                        .toString('split-path')
                )
            } else {
                this.splitLines.push(
                    new PathStringManager()
                        .M(prevPoint.startPoint)
                        .Q(prevPoint.endPoint, current.startPoint)
                        .toString('split-path')
                )        
            }
        } else {    // 현재가 curve 일 때 
            if (prevPoint.curve === false) { 

                if (Point.isEqual(current.reversePoint, current.startPoint)) {
                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .L(current.startPoint)
                            .toString('split-path')
                    )                    
                } else {
                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .Q(current.reversePoint, current.startPoint)
                            .toString('split-path')
                    )          
                }


            } else {
                this.splitLines.push(
                    new PathStringManager()
                        .M(prevPoint.startPoint)
                        .C(prevPoint.endPoint, current.reversePoint, current.startPoint)
                        .toString('split-path')
                )
            }
        }
    }

    makePointGuide (points) {
        var {selectedIndex} = this.state; 
        for(var index = 0, len = points.length; index < len; index++) {
            var currentIndex = index; 
            var current = points[currentIndex];

            if (!current) continue; 

            var nextPoint = Point.getNextPoint(points, index);
            var prevPoint = Point.getPrevPoint(points, index);

            if (prevPoint && prevPoint.command === 'M') {
                current.startPoint.isSecond = true; 
            }

            if (nextPoint ) {
                current.startPoint.isLast = nextPoint.command === 'M';                 
            } else {
                current.startPoint.isLast = index === len - 1; 
            }

            current.selected = selectedIndex === index;

            // 각도를 표시 해준다. 
            // 쓸 곳이 없다. 
            // this.makeDistancePointGuide(prevPoint, current, nextPoint, index);

            if (current.command === 'M') {
                this.makeStartPointGuide(prevPoint, current, nextPoint, index);
            } else {
                this.makeMiddlePointGuideRealPath(prevPoint, current, nextPoint, index);
                this.makeMiddlePointGuideSplitLine(prevPoint, current, nextPoint, index);
                this.makeMiddlePointGuideSegment(prevPoint, current, nextPoint, index);
            }

            if (current.close) {
                this.pathStringManager.Z();
            }

        }

    }

    makeMovePositionGuide () {
        var state = this.state; 
        var {points, startPoint, moveXY, dragPoints, altKey, snapPointList} = state;
        if (moveXY) {

            /* moveXY 에도 snap 을 적용한다. */ 
            snapPointList = snapPointList || [] 

            var { 
                snapPointList: movePointSnapPointList, 
                moveXY: newMoveXY 
            } = calculateMovePointSnap(points, moveXY, 2); 
            snapPointList.push(...movePointSnapPointList);

            state.moveXY = newMoveXY;
            moveXY = newMoveXY
            this.snapPointList = snapPointList;

            var prev = points[points.length - 1];

            if (dragPoints) {

                if (!prev) {
                    var {x, y} = Point.getReversePoint(startPoint, moveXY);
                    this.guideLineManager
                        .M(moveXY)
                        .L(startPoint)
                        .L( {x,y} )

                    this.segmentManager
                        .addCurvePoint(startPoint)
                        .addCurvePoint(moveXY)
                        .addCurvePoint({x, y})

                } else if (prev.curve) {
                    // 이전 것이 곡선이면 C 로 대응 
                    var {x, y} = Point.getReversePoint(startPoint, moveXY);                    

                    this.guideLineManager
                        .M(prev.startPoint)
                        .C(prev.endPoint, {x,y}, startPoint);

                    this.segmentManager
                        .addGuideLine(prev.startPoint, prev.endPoint)
                        .addGuideLine(startPoint, {x, y})
                        .addGuideLine(startPoint, moveXY)
                        .addCurvePoint(prev.endPoint)                    
                        .addCurvePoint({x, y})
                        .addCurvePoint(moveXY)
                        .addPoint(false, startPoint);

                } else if (prev.curve === false ) {
                    // 이전 것이 점이면 Q 로 대응 
                    // 내가 드래그 중이므로  내 좌표랑 start 좌표랑 비교 해서 이전 좌표를 구하기 
                    var {x, y} = Point.getReversePoint(startPoint, moveXY);

                    this.guideLineManager
                        .M(prev.startPoint)
                        .Q({x, y},startPoint);

                    this.segmentManager
                        .addGuideLine(moveXY, {x, y})
                        .addPoint(false, startPoint)
                        .addCurvePoint({x, y})
                        .addCurvePoint(moveXY);
                } 

            } else {

                if (!prev) {

                } else if (prev.curve) {
                    // 이전에 드래그 한 point 가 있을 경우 Q 로 
                    this.guideLineManager
                        .M(prev.startPoint)
                        .Q(prev.endPoint, moveXY);

                    this.segmentManager
                        .addGuideLine(prev.endPoint, prev.startPoint)
                        .addCurvePoint(prev.endPoint);
                } else {
                    // 이전에 점이고 지금도 점이면  직선 
                    if (!prev.close) {
                        this.guideLineManager.M(prev.startPoint).L(moveXY);

                        this.segmentManager.addPoint(false, prev.startPoint);
                    }
                }
            }

        }
    }

    makeSnapLines () {

        var snapLines = [] 
        // snapPoint 를 그려준다. 
        if (this.snapPointList) {
            var snapPath = new PathStringManager()
            snapLines = this.snapPointList.map(snapPoint => {
                snapPath.reset();                
                return snapPath
                        .M(snapPoint.startPoint)
                        .L(snapPoint.endPoint)
                        .toString('snap-path');
            })
        }

        return snapLines.join('');
    }

    makeSelectedSVGZone () {

        var { screenX, screenY, screenWidth, screenHeight} = this.state 
        var scale = this.pathEditor.scale; 

        var x = screenX.value * scale; 
        var y = screenY.value * scale; 
        var width = screenWidth.value * scale; 
        var height = screenHeight.value * scale; 

        return /*html*/`<rect class='svg-canvas' ${OBJECT_TO_PROPERTY({x, y, width, height})} />`
    }

    toSVGString () {
        return /*html*/`
        <svg width="100%" height="100%" class='svg-editor-canvas'>
            ${this.makeSelectedSVGZone()}
            ${this.guideLineManager.toString('guide')}
            ${this.pathStringManager.toString('object')}
            ${this.splitLines.join('')}
            ${this.makeSnapLines()}
            ${this.segmentManager.toString()}
        </svg>
        `
    }

}