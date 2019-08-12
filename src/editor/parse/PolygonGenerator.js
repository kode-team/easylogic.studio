import SegmentManager from "./SegmentManager";
import { clone, OBJECT_TO_PROPERTY } from "../../util/functions/func";
import { getDist, calculateAngle, getXYInCircle } from "../../util/functions/math";
import Point from "./Point";
import PathStringManager from "./PathStringManager";
import { randomNumber, random } from "../../util/functions/create";

export default class PolygonGenerator {

    constructor (polygonEditor) {
        
        this.polygonEditor = polygonEditor;
        this.segmentManager = new SegmentManager();        
        this.initialize()
    }

    initialize () {
        this.splitLines = []         
        this.points = []
        this.snapPointList = [] 
        this.segmentManager.reset();
    }

    get state () {
        return this.polygonEditor.state; 
    }

    get cloneSegments() {
        return [...this.state.segments]
    }



    setCachePoint (index) {

        var state = this.state; 

        state.segment = state.segments[index];
        state.originalSegment = clone(state.segment);

        state.cachedPoints = [] 
        state.segments.filter(p => p && p != state.segment).forEach(p => {
            state.cachedPoints.push(p)
        })

    }


    moveSegment (dx, dy) {
        var state = this.state; 
        var original = state.originalSegment
        if (original) {
            var targetPoint = state.segment
            targetPoint.x = original.x + dx;
            targetPoint.y = original.y + dy;        
        }

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

    calculateSnap( dx, dy, dist = 1) {
        var state = this.state; 

        var original = state.originalSegment
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
        var state = this.state; 
        var checkedPointList = []

        state.segments.forEach(point => {

            var tempDist = Math.abs(point[sourceKey] - target)
            if (tempDist <= dist) {
                checkedPointList.push({ dist: tempDist, point })
            }

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

        var { dx, dy, snapPointList} = this.calculateSnap(dx, dy, 2);
    
        this.snapPointList = snapPointList

        this.moveSegment(dx, dy);

    }

    moveStart () {
        var randomTable = [] 
        for(var i = 0; i < 100; i++) {
            randomTable[i] = randomNumber(i/100, 100)
        }
        
        this.state.randomTable = randomTable;
    }

    moveStar (dx, dy, e) {
        var state = this.state; 
        state.starRadius = getDist(dx, dy, 0, 0);
        state.starAngle = calculateAngle(dx, dy);

        this.refreshStar()
    }

    refreshStar () {
        var state = this.state; 
        var count = state.starCount; 
        state.innerRadius = state.starRadius * state.starInnerRadiusRate;

        var angleList = [state.starAngle]
        var innerAngleList = [] 
        var angleUnit = 360 / count; 
        for(var i = 1; i < count; i++) {
            angleList.push(angleList[i-1] + angleUnit);
        }

        for(var i = 0, len = angleList.length; i < len; i++) {
            innerAngleList[i] = angleList[i] + angleUnit /2 ;
        }

        var anglePointList = angleList.map(angle => {
            return getXYInCircle(angle, state.starRadius);
        })

        var innerAnglePointList = innerAngleList.map(angle => {
            return getXYInCircle(angle, state.innerRadius);
        })
        
        var points = []
        anglePointList.forEach((point, index) => {
            points.push(point, innerAnglePointList[index])
        })

        state.segments = points.map(p => {
            p.x += state.dragXY.x;
            p.y += state.dragXY.y;
            return p; 
        });
    }

    moveEnd (dx, dy) {
        var state = this.state; 
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;

        state.segments.push({x, y})
    }

    moveEndStar (dx, dy) {

    }

    setPointLine (obj) {

        var p0 = obj.first[0] 

        var allPoints = this.cloneSegments

        var firstIndex = Point.getPointIndex(allPoints, p0); 

        allPoints.splice(firstIndex+1, 0, obj.first[1]);

        this.state.segments = allPoints;

    }

    toPolygon (minX, minY, scale = 1) {
        var points = this.cloneSegments

        return {
            points: points.map(segment => {
                var newX = (segment.x - minX)/scale; 
                var newY = (segment.y - minY)/scale; 
                return `${newX} ${newY}`;
            }).join(' ')
        };
    }


    makeSVGPath() {

        this.initialize();

        this.makeMoveGuide (this.cloneSegments)

        this.makeMovePositionGuide();

        return this.toSVGString()
    }

    makeMoveGuide(points) {
        this.points = []

        points.forEach( (point, index) => {
            var isFirst = index === 0
            this.points.push(point);

            this.splitLines.push(
                new PathStringManager()
                    .M(Point.getPrevPoint(points, index))
                    .L(point)
                    .toString('split-path')
            )
            
            this.segmentManager.addPoint({isFirst}, point, index);
        })
    }

    makeMovePositionGuide () {
        var state = this.state; 
        var {moveXY, snapPointList} = state;
        if (moveXY) {

            /* moveXY 에도 snap 을 적용한다. */ 
            snapPointList = snapPointList || [] 

            var { 
                snapPointList: movePointSnapPointList, 
                moveXY: newMoveXY 
            } = this.calculateMovePointSnap(moveXY, 2); 
            snapPointList.push(...movePointSnapPointList);

            state.moveXY = newMoveXY;
            this.snapPointList = snapPointList;

            this.points.push(state.moveXY)

            this.segmentManager.addStartPoint({}, state.dragXY);
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
        var scale = this.polygonEditor.scale; 

        var x = screenX.value * scale; 
        var y = screenY.value * scale; 
        var width = screenWidth.value * scale; 
        var height = screenHeight.value * scale; 

        return `<rect class='svg-canvas' ${OBJECT_TO_PROPERTY({
            x, y, width, height
        })} />`
    }


    toSVGString () {

        return `
        <svg width="100%" height="100%">
            ${this.makeSelectedSVGZone()}
            <polygon class='object' points="${this.points.map(p => `${p.x} ${p.y}`).join(' ')}" />        
            ${this.makeSnapLines()}
            ${this.splitLines.join('')}            
            ${this.segmentManager.toString()}
        </svg>
        `
    }

}