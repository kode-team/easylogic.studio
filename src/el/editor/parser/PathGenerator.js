import SegmentManager from "./SegmentManager";
import { clone, OBJECT_TO_PROPERTY } from "el/base/functions/func";
import { getDist, getXYInCircle, calculateAngle360 } from "el/base/functions/math";
import Point from "./Point";
import PathStringManager from "./PathStringManager";
import { mat4, vec3 } from "gl-matrix";

const SEGMENT_DIRECTION = ['startPoint', 'endPoint', 'reversePoint']


function calculateSnapPoint (points, sourceKey, target, distanceValue, dist) {
    var checkedPointList = points.filter(p => {
        if (!p) return false;
        return Math.abs(p[sourceKey] - target) <= dist 
    }).map(p => {
        return {dist: Math.abs(p[sourceKey] - target), point: p}
    })

    // 점과의 거래가 작은게 우선순위가 높다 
    checkedPointList.sort( (a, b) => {
        return a.dist < b.dist ? -1 : 1; 
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

function checkInArea (area, point) {

    if (area.x2.value < point.x) { return false; }
    if (area.y2.value < point.y) { return false; }
    if (area.x.value > point.x) { return false; }
    if (area.y.value > point.y) { return false; }

    return true;
}


export default class PathGenerator {

    static generatorPathString (points, minX = 0, minY = 0, scale = 1) {
        return toPath(points, minX, minY, scale).d;
    }

    constructor (pathEditor) {
        
        this.pathEditor = pathEditor;
        this.pathStringManager = new PathStringManager();
        this.guideLineManager = new PathStringManager();
        this.segmentManager = new SegmentManager();

        this.initialize()
        this.initializeSelect();
    }

    initialize () {
        this.splitLines = [] 
        this.guideLineManager.reset();
        this.segmentManager.reset();
        this.pathStringManager.reset();
 
    }

    initializeSelect () {
        this.selectedPointKeys = {}
        this.selectedPointList = [];               
    }

    get state () {
        return this.pathEditor.state; 
    }

    get clonePoints() {
        return [...this.state.points]
    }

    selectInBox (box) {
        var list = [] 
        var target = ['startPoint', 'endPoint', 'reversePoint']
        this.state.points.forEach((point, index) => {

            target.forEach(key => {
                const p = point[key]
                if (checkInArea(box, p)) {
                    list.push({ x: p.x, y: p.y,  key, index})
                }
            })

        })

        this.select(...list);
    }

    select (...list) {
        this.selectedPointKeys = {}
        this.selectedPointList = list;
        list.forEach(it => {
            var key = `${it.key}_${it.index}`
            this.selectedPointKeys[key] = true;
        }) 
    }

    selectKeyIndex (key, index) {

        if (this.state.points[index]) {
            var point = this.state.points[index][key];
            if (point && !this.isSelectedSegment(key, index)) {
                this.select({x: point.x, y: point.y, key, index})
            }
        }

    }

    reselect () {
        this.selectedPointList.forEach(it => {
            var point = this.state.points[it.index][it.key];
            it.x = point.x;
            it.y = point.y;
        });
    }

    isSelectedSegment (segment, index) {
        var key = `${segment}_${index}`
        return this.selectedPointKeys[key]
    }

    commitTransformMatrix (point, transformMatrix) {
        var result = vec3.transformMat4([], [point.x, point.y, 0], transformMatrix)

        return {x: result[0], y: result[1] }
    }

    transformMat4 (transformMatrix) {

        this.transformPoints.forEach((p, index) => {
            var realPoint = this.state.points[index];

            Object.assign(realPoint.startPoint, this.commitTransformMatrix(p.startPoint, transformMatrix));
            Object.assign(realPoint.endPoint, this.commitTransformMatrix(p.endPoint, transformMatrix));
            Object.assign(realPoint.reversePoint, this.commitTransformMatrix(p.reversePoint, transformMatrix));
        })
    }


    transform (type, dx = 0, dy = 0) {

        var {x, y, width, height} = this.transformRect;


        var view = mat4.create()
        mat4.translate(view, view, [x, y, 0]);          // 4. 다시 원래 위치로 옮긴다. 

        switch(type) {
        case 'flipX':           // 내부 패스 변환 구현을 해야함 ,  순서를 안 맞추면 전혀 엉뚱한 결과값이 나오니 순서를 잘 맞춰줘요 
            mat4.scale(view, view, [-1, 1, 1]);             // 3. x 축 반전 시키고 
            mat4.translate(view, view, [-width, 0, 0]);     // 2. width 만큼 옮기고        
            break; 
        case 'flipY':
            mat4.scale(view, view, [1, -1, 1]);             // 3. y 축 반전 시키고 
            mat4.translate(view, view, [0, -height, 0]);     // 2. height 만큼 옮기고        
            break;      
        case 'flip':
            mat4.scale(view, view, [-1, -1, 1]);             // 3. x, y 축 반전 시키고 
            mat4.translate(view, view, [-width, -height, 0]);     // 2. width, height 만큼 옮기고        
            break;                               
        }

        mat4.translate(view, view, [-x, -y, 0]);        // 1. 원점으로 맞추고 
        this.transformMat4(view);           
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

    setLastPoint (startPoint) {
        var state = this.state

        var endPoint = clone(startPoint)
        var reversePoint = clone(startPoint)

        var point = {
            startPoint: startPoint,
            endPoint: endPoint,
            curve: false,
            reversePoint: reversePoint,
            connected: false, 
            close: false 
        }   

        state.points.push(point);
    }


    /**
     * 패스의 segment 를 드래그 하기 전에 snap 이 될 좌표를 캐쉬한다. 
     * 
     * @param {number} index 
     * @param {string} segmentKey 
     * @param {vec3[]} verties 
     */
    setCachePoint (index, segmentKey, verties = []) {

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

        state.cachedPoints.push.apply(state.cachedPoints, verties.map(it => {
            const [x, y, z] = it; 
            return {x, y, z}
        }))

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

    get selectedLength () {
        return this.selectedPointList.length;
    }

    moveSelectedSegment (dx, dy) {

        // 선택된 포인터를 옮길 때 
        // curve 에 연결된 endPoint와 reversePoint 를 같이 책임 질 것인가? 
        this.selectedPointList.forEach(it => {
            var target = this.state.points[it.index][it.key]
            target.x = it.x + dx; 
            target.y = it.y + dy; 
        })
    }

    removeSelectedSegment () {

        // 선택된 포인터를 옮길 때 
        // curve 에 연결된 endPoint와 reversePoint 를 같이 책임 질 것인가? 
        this.selectedPointList.forEach(it => {
            var target = this.state.points[it.index][it.key]
            target.removed = true; 
        })

        const pointGroup = Point.splitPoints(this.state.points)

        // console.log(pointGroup)

        const newPoints = Point.recoverPoints(pointGroup.map(points => {
            return points.filter(p => !p.startPoint.removed).map(p => {

                if (p.endPoint.removed) { p.endPoint = clone(p.startPoint)} 
                if (p.reversePoint.removed) { p.reversePoint = clone(p.startPoint)}

                if (Point.isEqual(p.endPoint, p.startPoint, p.reversePoint)) {
                    p.command = 'L';
                    p.curve = false; 
                }

                return p
            })
        }))

        // console.log(Point.splitPoints(newPoints));

        this.state.points = newPoints;
// 
        this.select();
    }    

    move (dx, dy, e) {
        var state = this.state;
        var { isCurveSegment, segmentKey, connectedPoint} = state 

        var { dx, dy, snapPointList} = this.calculateSnap(segmentKey, dx, dy, 3);
    
        this.snapPointList = snapPointList || []

        if (this.selectedPointList.length > 1) {
            // 여러개가 동시에 선택된 상태에서는 
            this.moveSelectedSegment(dx, dy);
        } else if (isCurveSegment) {
            if (e.shiftKey) {   
                // 상대편 길이 동일하게 curve 움직이기 
                this.moveSegment(segmentKey, dx, dy);
            } else if (e.altKey) {  
                this.moveSegment(segmentKey, dx, dy);
                
                // 상대편 rotate 하는데 
                this.rotateSegment(segmentKey);                
            } else {    // Curve 만 움직이기 
                // 해당 segment 먼저 움직이고 
                this.moveSegment(segmentKey, dx, dy);
                var targetSegmentKey = segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint'
                state.segment[targetSegmentKey] = Point.getReversePoint(state.segment.startPoint, state.segment[segmentKey]);                
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
        
        return firstIndex + 1; 
    }

    setPointQuard (obj) {

        var p0 = obj.first[0] 
        var p1 = obj.second[obj.second.length-1]

        var allPoints = this.clonePoints

        var firstItem = Point.getPoint(allPoints, p0)
        var secondItem = Point.getPoint(allPoints, p1)

        // console.log(firstItem, secondItem);

        // var fx = firstItem.startPoint.x + (firstItem.endPoint.x - firstItem.startPoint.x) / 3 
        // var fy = firstItem.startPoint.y + (firstItem.endPoint.y - firstItem.startPoint.y) / 3 

        if (firstItem.curve && secondItem.curve === false) {

            var newPoints = [
                { ...firstItem, endPoint: firstItem.startPoint },
                {startPoint: obj.first[2], reversePoint: obj.first[1], curve: true , endPoint: obj.second[1] },
            ]

            var firstIndex = Point.getIndex(allPoints, p0); 

            allPoints.splice(firstIndex, 1, ...newPoints);
    
    
        } else {
            var newPoints = [
                { ...firstItem},
                {startPoint: obj.first[2], reversePoint: obj.first[1], curve: true , endPoint: obj.second[1] },
                { ...secondItem, reversePoint: obj.second[1], curve: true },                
            ]

            var firstIndex = Point.getIndex(allPoints, p0); 

            allPoints.splice(firstIndex, 2, ...newPoints);
        }

        this.state.points = allPoints;

        return firstIndex + 1;         

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

        return firstIndex + 1; 

    }

    toPath (minX = 0, minY = 0, scale = 1) {
        return toPath(this.clonePoints, minX, minY, scale)
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
                .addPoint({}, current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))

            if (!current.startPoint.isLast) {
                this.segmentManager.addText(current.startPoint, index+1);
            }


        } else {      
            this.segmentManager
                .addPoint({}, current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))
                .addGuideLine(current.startPoint, current.endPoint)


            if (Point.isEqual(current.startPoint, current.endPoint) === false) {
                this.segmentManager.addCurvePoint(current.endPoint, index, 'endPoint', this.isSelectedSegment('endPoint', index))
            }

        }


    }

    makeMiddlePointGuideSegment (prevPoint, current, nextPoint, index) {
        var mng = this.segmentManager;
        if (current.curve === false) { 
            // 꼭지점
            if (prevPoint.curve === false) {
                mng.addPoint({}, current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))   

                if (!current.startPoint.isLast) {
                    mng.addText(current.startPoint, index+1);
                }
            } else {

                mng
                .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                .addCurvePoint(current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))


                if (Point.isEqual(prevPoint.startPoint, prevPoint.endPoint) === false) {
                    mng.addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint', this.isSelectedSegment('endPoint', prevPoint.index));
                }

                if (!current.startPoint.isLast) {
                    mng.addText(current.startPoint, index+1);
                }
        
            }


        } else {    // 현재가 curve 일 때 
            if (prevPoint.curve === false) { 

                if (Point.isEqual(current.reversePoint, current.startPoint)) {
                    mng.addPoint({},current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))

                    if (!current.startPoint.isLast) {
                        mng.addText(current.startPoint, index+1);
                    }                                       
                } else {
                    mng
                    .addGuideLine(current.startPoint, current.reversePoint)
                    .addCurvePoint(current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))

                    if (Point.isEqual(current.startPoint, current.reversePoint) === false) {
                        mng.addCurvePoint(current.reversePoint, index, 'reversePoint', this.isSelectedSegment('reversePoint', index));     
                    }

                    if (!current.startPoint.isLast) {
                        mng.addText(current.startPoint, index+1);
                    }
                }


            } else {

                if (current.connected) {
                    mng
                    .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                    .addGuideLine(current.startPoint, current.reversePoint)

                    if (Point.isEqual(prevPoint.startPoint, prevPoint.endPoint) === false) {
                        mng.addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint', this.isSelectedSegment('endPoint', prevPoint.index))
                    }

                    if (Point.isEqual(current.startPoint, current.reversePoint) === false) {
                        mng.addCurvePoint(current.reversePoint, index, 'reversePoint', this.isSelectedSegment('reversePoint', index));
                    }
                } else {
                    mng
                    .addGuideLine(prevPoint.startPoint, prevPoint.endPoint)
                    .addGuideLine(current.startPoint, current.reversePoint)
                    .addCurvePoint(current.startPoint, index, 'startPoint', this.isSelectedSegment('startPoint', index))

                    if (Point.isEqual(prevPoint.startPoint, prevPoint.endPoint) === false) {
                        mng.addCurvePoint(prevPoint.endPoint, prevPoint.index, 'endPoint', this.isSelectedSegment('endPoint', prevPoint.index))                        
                    }

                    if (Point.isEqual(current.startPoint, current.reversePoint) === false) {
                        mng.addCurvePoint(current.reversePoint, index, 'reversePoint', this.isSelectedSegment('reversePoint', index));
                    }

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
                if (current.startPoint) {
                    current.startPoint.isSecond = true; 
                }

            }
            if (current.startPoint) {
                if (nextPoint ) {
                    current.startPoint.isLast = nextPoint.command === 'M';                 
                } else {
                    current.startPoint.isLast = index === len - 1; 
                }
    
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
            } = calculateMovePointSnap(points, moveXY, 3); 
            snapPointList.push.apply(snapPointList, movePointSnapPointList);

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
                        .X(snapPoint.startPoint)
                        .toString('snap-path');
            })
        }

        return snapLines.join('');
    }

    toSVGString () {
        return /*html*/`
        <svg width="100%" height="100%" class='svg-editor-canvas'>
            ${this.guideLineManager.toString('guide', this.state.isPolygon)}
            ${this.pathStringManager.toString('object', this.state.isPolygon)}
            ${this.splitLines.join('')}
            ${this.makeSnapLines()}
            ${this.segmentManager.toString()}
        </svg>
        `
    }

}