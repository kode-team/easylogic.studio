import SegmentManager from "./SegmentManager";
import { clone, OBJECT_TO_PROPERTY } from "../../util/functions/func";
import { getDist, calculateAngle, getXYInCircle } from "../../util/functions/math";
import Point from "./Point";
import PathStringManager from "./PathStringManager";

const SEGMENT_DIRECTION = ['startPoint', 'endPoint', 'reversePoint']


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
        this.snapPointList = [] 
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


    setConnectedPoint (dx, dy) {
        var state = this.state
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;

        state.endPoint = {x, y}
        state.reversePoint = {x, y}

        if (state.dragPoints) {
            state.reversePoint = Point.getReversePoint(state.startPoint, state.endPoint);
        }


        var point = {
            startPoint: state.startPoint,
            endPoint: state.endPoint,
            curve: state.dragPoints,
            reversePoint: state.reversePoint,
            connected: true, 
            close: true 
        }   

        state.points.push(point);
    }

    setCachePoint (index) {

        var state = this.state; 
        var { points } = state; 

        state.connectedPoint =  Point.getPrevPoint(points, index)

        if (state.connectedPoint && !state.connectedPoint.connected) {
            state.connectedPoint = null; 
        }

        state.segment = Point.getIndexPoint(points, index)

        // 연결된 포인트인 경우 , 처음 지점 포인트를 가지고 온다. 
        if (state.segment.connected) {  
            state.connectedPoint = Point.getNextPoint(points, index);
        }

        state.isFirstSegment = Point.isFirst(state.segment)

        if (state.isFirstSegment) {
            var lastPoint = Point.getLastPoint(points, index);

            if (lastPoint.connected) {
                state.connectedPoint = lastPoint;
            }
        }

        state.segmentKey = state.$target.attr('data-segment-point');        
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

    moveSegmentDistance (originPoint, targetPoint, dx, dy) {
        if (originPoint) {
            targetPoint.x = originPoint.x + dx;
            targetPoint.y = originPoint.y + dy;     
        }
    }

    moveSegment (segmentKey, dx, dy, connectedPoint = null) {
        var state = this.state; 
        // console.log('move', segmentKey, dx, dy, connectedPoint);

        var originPoint = state.originalSegment[segmentKey]
        var targetPoint = state.segment[segmentKey]

        if (connectedPoint) {
            originPoint = state.originalConnectedPoint[segmentKey]
            targetPoint = state.connectedPoint[segmentKey]
        }

        this.moveSegmentDistance(originPoint, targetPoint, dx, dy);
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

                if (nextPoint.command === 'M') {
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

            if (nextPoint.command === 'M') {
                // 마지막 지점의 다음이 처음과 같을 때 
                // 처음의 다음 포인트를 가지고 와서 다시 계산한다. 

                var firstPoint = nextPoint;

                nextPoint = Point.getNextPoint(points, firstPoint.index);

                var centerX = (nextPoint.startPoint.x + prevPoint.startPoint.x) /2;
                var centerY = (nextPoint.startPoint.y + prevPoint.startPoint.y) /2;
    
                var dx = (nextPoint.startPoint.x - centerX)/2
                var dy = (nextPoint.startPoint.y - centerY)/2
    
                // 방향을 맞췄다. 
                // 마지막 point 가 처음과 같이 연결되어 있을 때는 
                // reverse, end 를 모두 동일하게 가진다. 
                point.endPoint = {
                    x: point.startPoint.x + dx,
                    y: point.startPoint.y + dy
                }
    
                point.reversePoint = {
                    x: point.startPoint.x - dx,
                    y: point.startPoint.y - dy
                }

                // 처음도 같이 변경해주기 
                firstPoint.curve = true; 
                firstPoint.endPoint = {
                    x: firstPoint.startPoint.x + dx,
                    y: firstPoint.startPoint.y + dy
                }

                firstPoint.reversePoint = {
                    x: firstPoint.startPoint.x - dx,
                    y: firstPoint.startPoint.y - dy
                }                

            } else {

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
            }

        }
    }


    moveCurveSegment(segmentKey, dx, dy, connectedPoint) {
        var state = this.state; 
        if (segmentKey === 'endPoint') {

            if (connectedPoint) {
                this.moveSegment('endPoint', dx, dy, connectedPoint);

                var reversePoint = Point.getReversePoint(connectedPoint.startPoint, connectedPoint.endPoint);
    
                var targetPoint = connectedPoint.reversePoint
                targetPoint.x = reversePoint.x; 
                targetPoint.y = reversePoint.y;                 
            } else {
                this.moveSegment('endPoint', dx, dy);

                var reversePoint = Point.getReversePoint(state.segment.startPoint, state.segment.endPoint);
    
                var targetPoint = state.segment.reversePoint
                targetPoint.x = reversePoint.x; 
                targetPoint.y = reversePoint.y; 
            }

        } else  if (segmentKey === 'reversePoint') {

            if (connectedPoint) {
                this.moveSegment('reversePoint', dx, dy, connectedPoint);

                var endPoint = Point.getReversePoint(connectedPoint.startPoint, connectedPoint.reversePoint);
    
                var targetPoint = connectedPoint.endPoint
                targetPoint.x = endPoint.x; 
                targetPoint.y = endPoint.y; 
            } else {
                this.moveSegment('reversePoint', dx, dy);

                var endPoint = Point.getReversePoint(state.segment.startPoint, state.segment.reversePoint);
    
                var targetPoint = state.segment.endPoint
                targetPoint.x = endPoint.x; 
                targetPoint.y = endPoint.y; 
            }

        }
    }

    rotateSegmentTarget (segmentKey, target, connectedPoint) {
        var state = this.state; 

        if (connectedPoint && state.originalConnectedPoint[target] && connectedPoint[segmentKey]) {
            var {x: cx, y: cy} = state.originalConnectedPoint.startPoint;
            var {x: rx, y: ry} = connectedPoint[segmentKey];
            var {x: tx, y: ty} = state.originalConnectedPoint[target];
    
            var radius = getDist(tx, ty, cx, cy)
            var angle = (calculateAngle(rx - cx, ry - cy) + 180) % 360
            // reversePoint 체크 
            var {x, y} = getXYInCircle(angle, radius, cx, cy); 
    
            connectedPoint[target] = {x, y}
        } else {

            // console.log(state.original, state.segment, state.originalSegment)
            if (state.originalSegment && state.segment) {
                var {x: cx, y: cy} = state.originalSegment.startPoint;
                var {x: rx, y: ry} = state.segment[segmentKey];
                var {x: tx, y: ty} = state.originalSegment[target]
        
                var radius = getDist(tx, ty, cx, cy)
                var angle = (calculateAngle(rx - cx, ry - cy) + 180) % 360
                // reversePoint 체크 
                var {x, y} = getXYInCircle(angle, radius, cx, cy); 
        
                state.segment[target] = {x, y}
            }
        }

    }

    rotateSegment (segmentKey, connectedPoint) {
        this.rotateSegmentTarget(segmentKey, segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint', connectedPoint);
    }

    calculateSnapPoint (sourceKey, target, distanceValue, dist) {
        var state = this.state; 
        var checkedPointList = state.cachedPoints.filter(p => {
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

            // 기존 거리와의 차이를 지정함. 
            distanceValue += point[sourceKey] - target
        }

        return { point, distanceValue }; 
    }

    calculateSnap( segmentKey, dx, dy, dist = 1) {
        var state = this.state; 

        var original = state.originalSegment[segmentKey]

        if (!segmentKey) {
            return { dx, dy, snapPointList: []}
        }

        var realX = original.x + dx;
        var realY = original.y + dy;

        var {point: snapPointX, distanceValue: dx } = this.calculateSnapPoint('x', realX, dx, dist);
        var {point: snapPointY, distanceValue: dy } = this.calculateSnapPoint('y', realY, dy, dist);

        var snapEndPoint = {
            x : original.x + dx,
            y : original.y + dy
        }

        var snapPointList = [] 
        if (snapPointX) { snapPointList.push({ startPoint: snapPointX, endPoint: snapEndPoint })}
        if (snapPointY) { snapPointList.push({ startPoint: snapPointY, endPoint: snapEndPoint }) }        
     
        return { dx, dy, snapPointList }
    }


    calculatePointDist (sourceKey, target, dist) {
        var {points} = this.state; 
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

    calculateMovePointSnap( moveXY, dist = 1) {
        var snapPointX = this.calculatePointDist('x', moveXY.x, dist)
        var snapPointY = this.calculatePointDist('y', moveXY.y, dist)        

        var snapEndPoint = {...moveXY}
        if (snapPointX) { snapEndPoint.x = snapPointX.x; }
        if (snapPointY) { snapEndPoint.y = snapPointY.y;}

        var snapPointList = [] 

        if (snapPointX) { snapPointList.push({ startPoint: snapPointX, endPoint: snapEndPoint })}
        if (snapPointY) { snapPointList.push({ startPoint: snapPointY, endPoint: snapEndPoint})}      
     
        return { snapPointList, moveXY: snapEndPoint }
    }    

    move (dx, dy, e) {
        var state = this.state;
        var { isCurveSegment, segmentKey, connectedPoint} = state 

        var { dx, dy, snapPointList} = this.calculateSnap(segmentKey, dx, dy, 2);
    
        this.snapPointList = snapPointList

        if (isCurveSegment) {
            if (e.shiftKey) {   // 상대편 길이 동일하게 curve 움직이기 
                this.moveCurveSegment (segmentKey, dx, dy) 
                connectedPoint && this.moveCurveSegment (segmentKey, dx, dy, connectedPoint) 
            } else if (e.altKey) {  // 상대편 길이 유지하면서 curve 움직이기 
                this.moveSegment(segmentKey, dx, dy);
                connectedPoint && this.moveSegment(segmentKey, dx, dy, connectedPoint);
            } else {    // Curve 만 움직이기 
                this.moveSegment(segmentKey, dx, dy);
                this.rotateSegment(segmentKey);
                connectedPoint && this.rotateSegment(segmentKey, connectedPoint);
            }

        } else {

            SEGMENT_DIRECTION.forEach(tempSegment => {
                this.moveSegment(tempSegment, dx, dy);
                connectedPoint && this.moveSegment(tempSegment, dx, dy, connectedPoint);
            })
        }

    }

    moveEnd (dx, dy) {
        var state = this.state; 
        var {points} = state; 
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;
        
        state.endPoint = {x, y}
        state.reversePoint = {x, y}

        if (state.dragPoints) {
            state.reversePoint = Point.getReversePoint(state.startPoint, state.endPoint);
        }

        var point = {
            startPoint: state.startPoint,
            endPoint: state.endPoint,
            curve: state.dragPoints,
            reversePoint: state.reversePoint
        }   

        var last = Point.getLastPoint(points, points.length - 1)

        if (last && last.close) {
            point.command = 'M'
        } else if (!last) {
            point.command = 'M'
        }

        points.push(point)

        state.startPoint = null;
        state.endPoint = null;
        state.reversePoint = null;
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
        var d = [];
        var points = this.clonePoints

        for(var index = 0, len = points.length; index < len; index++) {
            var currentIndex = index; 
            var current = points[currentIndex];                

            if (!current) continue; 

            if (current.command === 'M') {
                d.push({command: 'M', values: [
                    current.startPoint
                ]});             
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
                        if (current.connected) {
                            d.push({command: 'C', values: [ prevPoint.endPoint, current.reversePoint, current.startPoint ]});
                        } else {
                            d.push({command: 'C', values: [ prevPoint.endPoint, current.reversePoint, current.startPoint ]});                            
                        }
                    }
                }
            }

            if (current.close) {
                d.push({command: 'Z'});
            }
        }

        var dString = d.map(segment => {
            return this.calculateRelativePosition (minX, minY, segment, scale);
        }).join(' ')

        return {
            d: dString
        };
    }


    calculateRelativePosition (x, y, segment, scale = 1) {

        var { command, values } = segment;

        switch(command) {
        case 'Z':
            return 'Z';
        default:
            var str = values.map(v => {
                var tx = (v.x - x) / scale; 
                var ty = (v.y - y) / scale; 

                return `${tx} ${ty}`
            }).join(' ')

            return `${command} ${str}`
        }
    }

    makeSVGPath() {

        this.initialize();

        this.makePointGuide(this.clonePoints)

        this.makeMovePositionGuide();

        return this.toSVGString()
    }

    makeStartPointGuide (prevPoint, current, nextPoint, index) {
        current.startPoint.isFirst = true; 

        this.pathStringManager.M(current.startPoint)        

        if (current.curve === false) {
            this.segmentManager.addPoint({}, current.startPoint, index, 'startPoint')
        } else {
            // NOOP 
            // this.segmentManager.addPoint({}, current.startPoint, index, 'startPoint')            
            this.segmentManager
                .addPoint({}, current.startPoint, index, 'startPoint')                        
                .addLine(current.startPoint, current.endPoint)
                .addCurvePoint(current.endPoint, index, 'endPoint')
        }


    }

    makeMiddlePointGuide (prevPoint, current, nextPoint, index) {

        if (current.curve === false) { 
            // 꼭지점
            if (prevPoint.curve === false) {
                this.pathStringManager
                    .L(current.startPoint)

                this.segmentManager
                    .addPoint({}, current.startPoint, index, 'startPoint')   
                
                this.splitLines.push(
                    new PathStringManager()
                        .M(prevPoint.startPoint)
                        .L(current.startPoint)
                        .toString('split-path')
                )
            } else {

                this.pathStringManager
                    .Q(prevPoint.endPoint, current.startPoint)
                this.splitLines.push(
                    new PathStringManager()
                        .M(prevPoint.startPoint)
                        .Q(prevPoint.endPoint, current.startPoint)
                        .toString('split-path')
                );

                this.segmentManager
                    .addLine(prevPoint.startPoint, prevPoint.endPoint)
                    .addCurvePoint(current.startPoint, index, 'startPoint')
                    .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint');
            }


        } else {    // 현재가 curve 일 때 

            // 이전은 점이고 현재가 드래그 일 때 
            if (prevPoint.curve === false) { 

                if (Point.isEqual(current.reversePoint, current.startPoint)) {
                    this.pathStringManager.L( current.startPoint);
                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .L(current.startPoint)
                            .toString('split-path')
                    )                    
                    this.segmentManager.addPoint({},current.startPoint, index, 'startPoint')
                } else {

                    this.pathStringManager.Q( current.reversePoint, current.startPoint);

                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .Q(current.reversePoint, current.startPoint)
                            .toString('split-path')
                    )          

                    this.segmentManager
                        .addLine(current.startPoint, current.reversePoint)
                        .addCurvePoint(current.startPoint, index, 'startPoint')
                        .addCurvePoint(current.reversePoint, index, 'reversePoint');              
                }


            } else {

                if (current.connected) {

                    // 이전도 drag 일 때 
                    this.pathStringManager
                        .C( prevPoint.endPoint, current.reversePoint, current.startPoint);

                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .C( prevPoint.endPoint, current.reversePoint, current.startPoint)
                            .toString('split-path')
                    )

                    this.segmentManager
                        .addLine(prevPoint.startPoint, prevPoint.endPoint)
                        .addLine(current.startPoint, current.reversePoint)
                        .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint')
                        .addCurvePoint(current.reversePoint, index, 'reversePoint');
                } else {
                    // 이전도 drag 일 때 
                    this.pathStringManager
                        .C(prevPoint.endPoint, current.reversePoint, current.startPoint)

                    this.splitLines.push(
                        new PathStringManager()
                            .M(prevPoint.startPoint)
                            .C(prevPoint.endPoint, current.reversePoint, current.startPoint)
                            .toString('split-path')
                    )

                    this.segmentManager
                        .addLine(prevPoint.startPoint, prevPoint.endPoint)
                        .addLine(current.startPoint, current.reversePoint)
                        .addCurvePoint(current.startPoint, index, 'startPoint')
                        .addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint')                        
                        .addCurvePoint(current.reversePoint, index, 'reversePoint');

                }
            }
        }
    }

    makePointGuide (points) {

        for(var index = 0, len = points.length; index < len; index++) {
            var currentIndex = index; 
            var current = points[currentIndex];

            if (!current) continue; 

            var nextPoint = Point.getNextPoint(points, index);
            var prevPoint = Point.getPrevPoint(points, index);

            if (prevPoint && prevPoint.command === 'M') {
                current.startPoint.isSecond = true; 
            }

            if (nextPoint && nextPoint.command === 'M') {
                current.startPoint.isLast = true; 
            } else if (!nextPoint) {
                current.startPoint.isLast = true; 
            }

            if (current.command === 'M') {

                this.makeStartPointGuide(prevPoint, current, nextPoint, index);


            } else {
                this.makeMiddlePointGuide(prevPoint, current, nextPoint, index);
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
            } = this.calculateMovePointSnap(moveXY, 2); 
            snapPointList.push(...movePointSnapPointList);

            state.moveXY = newMoveXY;
            moveXY = newMoveXY
            this.snapPointList = snapPointList;
            /* moveXY 에도 snap 을 적용한다. */ 

            var prev = points[points.length - 1];

            if (dragPoints) {
                // 마지막 지점을 드래그 중일 때  
                // 아직 움직이는 지점이기 때문에 

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
                        .addLine(prev.startPoint, prev.endPoint)
                        .addLine(startPoint, {x, y})
                        .addLine(startPoint, moveXY)
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
                        .addLine(moveXY, {x, y})
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
                        .addLine(prev.endPoint, prev.startPoint)
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

        return `<rect class='svg-canvas' ${OBJECT_TO_PROPERTY({x, y, width, height})} />`
    }

    toSVGString () {
        return `
        <svg width="100%" height="100%">
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