import SegmentManager from "./SegmentManager";
import { clone } from "../../util/functions/func";
import { getDist, calculateAngle, getXYInCircle } from "../../util/functions/math";

export default class PathGenerator {

    constructor (pathEditor) {
        this.pathEditor = pathEditor;
        this.segmentManager = new SegmentManager();
    }

    static getReversePoint(start, end) {
        var distX = (start.x -  end.x)
        var distY = (start.y -  end.y)
        // 여긴 시작 지점의 curve 
        return {
            x: start.x + distX,
            y: start.y + distY
        }
    }

    setConnectedPoint () {

        var firstPoint = clone(this.pathEditor.state.points[0]);
        var startPoint = clone(firstPoint.startPoint)

        this.pathEditor.state.points.push({
            startPoint: startPoint,
            endPoint: startPoint,
            curve: false,
            reversePoint: startPoint,
            connected: true 
        })
    }

    setCachePoint (index) {

        var state = this.pathEditor.state; 

        state.isFirstSegment = index === 0; 
        state.prevSegment = state.points[ (state.points.length + (index -1)) % state.points.length ]

        if (state.prevSegment && !state.prevSegment.connected) {
            state.prevSegment = null; 
        }

        state.segment = state.points[index];
        state.segmentKey = state.$target.attr('data-segment-point');        
        state.isCurveSegment = state.segment.curve && state.segmentKey != 'startPoint'
        state.originalSegment = clone(state.segment);
        state.originalPrevSegment = clone(state.prevSegment);
    }


    moveSegment (segmentKey, dx, dy, prevSegment = null) {
        var state = this.pathEditor.state; 
        if (prevSegment) {

            if (state.originalPrevSegment[segmentKey]) {
                state.prevSegment[segmentKey].x = state.originalPrevSegment[segmentKey].x + dx;
                state.prevSegment[segmentKey].y = state.originalPrevSegment[segmentKey].y + dy;     
            }

        } else {
            if (state.originalSegment[segmentKey]) {
                state.segment[segmentKey].x = state.originalSegment[segmentKey].x + dx;
                state.segment[segmentKey].y = state.originalSegment[segmentKey].y + dy;        
            }
        }
    }

    moveCurveSegment(segmentKey, dx, dy) {
        var state = this.pathEditor.state; 
        if (segmentKey === 'endPoint') {
            this.moveSegment('endPoint', dx, dy);

            var reversePoint = PathGenerator.getReversePoint(state.segment.startPoint, state.segment.endPoint);

            state.segment.reversePoint.x = reversePoint.x; 
            state.segment.reversePoint.y = reversePoint.y; 
        } else  if (segmentKey === 'reversePoint') {
            this.moveSegment('reversePoint', dx, dy);

            var endPoint = PathGenerator.getReversePoint(state.segment.startPoint, state.segment.reversePoint);

            state.segment.endPoint.x = endPoint.x; 
            state.segment.endPoint.y = endPoint.y; 
        }
    }

    rotateSegmentTarget (segmentKey, target) {
        var state = this.pathEditor.state; 
        var {x: cx, y: cy} = state.originalSegment.startPoint;
        var {x: rx, y: ry} = state.segment[segmentKey];
        var {x: tx, y: ty} = state.originalSegment[target];

        var radius = getDist(tx, ty, cx, cy)
        var angle = (calculateAngle(rx - cx, ry - cy) + 180) % 360
        // reversePoint 체크 
        var {x, y} = getXYInCircle(angle, radius, cx, cy); 

        state.segment[target] = {x, y}
    }

    rotateSegment (segmentKey) {
        this.rotateSegmentTarget(segmentKey, segmentKey === 'endPoint' ? 'reversePoint' : 'endPoint');
    }

    move (dx, dy, e) {
        var state = this.pathEditor.state;

        if (state.isCurveSegment) {
            if (e.shiftKey) {   // 상대편 길이 동일하게 curve 움직이기 
                this.moveCurveSegment (state.segmentKey, dx, dy) 
            } else if (e.altKey) {  // 상대편 길이 유지하면서 curve 움직이기 
                this.moveSegment(state.segmentKey, dx, dy);
                this.rotateSegment(state.segmentKey);
            } else {    // Curve 만 움직이기 
                this.moveSegment(state.segmentKey, dx, dy);                    
            }

        } else {
            this.moveSegment('startPoint', dx, dy);
            this.moveSegment('endPoint', dx, dy);
            this.moveSegment('reversePoint', dx, dy);

            if (state.isFirstSegment && state.prevSegment) {
                this.moveSegment('startPoint', dx, dy, state.prevSegment);
                this.moveSegment('reversePoint', dx, dy, state.prevSegment);
                this.moveSegment('endPoint', dx, dy, state.prevSegment);
            }
        }

    }

    moveEnd (dx, dy) {
        var state = this.pathEditor.state; 
        var x = state.dragXY.x + dx // / editor.scale;
        var y = state.dragXY.y + dy //  / editor.scale;

        state.endPoint = {x, y}
        state.reversePoint = {x, y}

        if (state.dragPoints) {
            state.reversePoint = PathGenerator.getReversePoint(state.startPoint, state.endPoint);
        }

        var point = {
            startPoint: state.startPoint,
            endPoint: state.endPoint,
            curve: state.dragPoints,
            reversePoint: state.reversePoint
        }   
        
        var last = state.points[state.points.length-1]

        if (last && last.close) {
            point.command = 'M'
        } else if (!last) {
            point.command = 'M'
        }

        state.points.push(point)

        state.startPoint = null;
        state.endPoint = null;
        state.reversePoint = null;
        state.dragPoints = false
    }

    setPoint (obj) {

        var p0 = obj.first[0] 
        var p1 = obj.second[obj.second.length-1]

        var allPoints = [...this.pathEditor.state.points]

        var firstItem = allPoints.filter(p => p.startPoint.x === p0.x && p.startPoint.y === p0.y)[0];
        var secondItem = allPoints.filter(p => p.startPoint.x === p1.x && p.startPoint.y === p1.y)[0];

        var newPoints = [
            {...firstItem, endPoint: obj.first[1]},
            {startPoint: obj.first[3], reversePoint: obj.first[2], curve: true , endPoint: obj.second[1]},
            {...secondItem, reversePoint: obj.second[2]}
        ]

        console.table(newPoints);

        var firstIndex = -1; 
        for(var i = 0, len = allPoints.length; i < len; i++) {
            var p = allPoints[i]

            if (p.startPoint.x === p0.x && p.startPoint.y === p0.y) {
                firstIndex = i; 
                break; 
            }
        }

        allPoints.splice(firstIndex, 2, ...newPoints);

        this.pathEditor.state.points = allPoints;

    }

    toPath (minX, minY, scale = 1) {
        const allPoints = this.pathEditor.state.points;
        var d = [];
        var points = [...allPoints]

        for(var index = 0, len = points.length; index < len; index++) {
            var currentIndex = index; 
            var prevIndex = index - 1;                 
            var current = points[currentIndex];         
            var prev = points[prevIndex]          

            if (index === 0 || current.command === 'M') {
                d.push({command: 'M', values: [current.startPoint.x, current.startPoint.y]});
            } else {
                if (current.curve === false) {  // 1번이 점이면 
                    // 꼭지점
                    if (prev.curve === false) {
                        d.push({command: 'L', values: [current.startPoint.x, current.startPoint.y]});
                    } else {
                        // 이전이 drag이고  지금이 점일 때  한쪽만 segment 가 있으므로 2차 Curve                         
                        d.push({command: 'Q', values: [prev.endPoint.x, prev.endPoint.y, current.startPoint.x, current.startPoint.y]});
                    }
                } else {
                    // 이전은 점이고 현재가 드래그 일 때 , 한쪽만 segment 가 있으므로 2차 Curve 
                    if (prev.curve === false) { 
                        d.push({command: 'Q', values: [current.reversePoint.x, current.reversePoint.y, current.startPoint.x, current.startPoint.y]});                        
                    } else {
                    // 이전도 drag 이고 현재도 드래그 일 때,  segment 가 2개, 그러므로 3차 Curve 
                        d.push({command: 'C', values: [prev.endPoint.x, prev.endPoint.y, current.reversePoint.x, current.reversePoint.y,current.startPoint.x, current.startPoint.y]});
                    }
                }
            }

            if (current.close) {
                d.push({command: 'Z'});
            }
        }

        return {
            d: d.map(segment => {
                return this.calculateRelativePosition (minX, minY, segment, scale);
            }).join(' ')
        };
    }

    calculateRelativePosition (x, y, segment, scale = 1) {

        var { command, values } = segment;

        switch(command) {
        case 'Z':
        case 'z':
            return 'Z';
        default:
            for(var i = 0, len = values.length; i < len; i += 2) {
                values[i] =  (values[i] - x) / scale; 
                values[i+1] = (values[i+1] - y) / scale; 

            }

            return `${command} ${values.join(',')}`
        }
    }

    makeSVGPath() {
        const allPoints = this.pathEditor.state.points;
        const moving = this.pathEditor.state; 
        var d = [];
        var guide = [] 
        var splitLines = [] 
        this.segmentManager.reset();


        // 1번이 점이면 
        // 1번이 드래그이면 
        var points = [...allPoints]

        for(var index = 0, len = points.length; index < len; index++) {
            var currentIndex = index; 
            var prevIndex = index - 1;             
            var nextIndex = index + 1;             
            var current = points[currentIndex];         
            var prev = points[prevIndex]                               
            var isFirst = index === 0;    
            var isLast = index === len - 1; 

            if (index === 0 || current.command === 'M') {
                d.push(`M ${current.startPoint.x} ${current.startPoint.y}`)

                this.segmentManager.addPoint({isFirst, isLast}, current.startPoint, currentIndex, 'startPoint')                

            } else {


                if (current.curve === false) {  // 1번이 점이면 
                    // 꼭지점
                    if (prev.curve === false) {
                        d.push(`L ${current.startPoint.x} ${current.startPoint.y}`)

                        this.segmentManager.addPoint({isFirst, isLast}, current.startPoint, currentIndex, 'startPoint')                        
                        splitLines.push(`M ${prev.startPoint.x} ${prev.startPoint.y} L ${current.startPoint.x} ${current.startPoint.y}`)
                    } else {
                        d.push(`Q ${prev.endPoint.x} ${prev.endPoint.y} ${current.startPoint.x} ${current.startPoint.y}`)
                        splitLines.push(`M ${prev.startPoint.x} ${prev.startPoint.y} Q ${prev.endPoint.x} ${prev.endPoint.y} ${current.startPoint.x} ${current.startPoint.y}`)
                        this.segmentManager.addLine(current.startPoint, prev.endPoint)

                        this.segmentManager.addPoint({isFirst, isLast}, current.startPoint, currentIndex, 'startPoint')
                        this.segmentManager.addCurvePoint(prev.endPoint, prevIndex, 'endPoint')
                                                             
                    }
    

                } else {

                    // 이전은 점이고 현재가 드래그 일 때 
                    if (prev.curve === false) { 

                        d.push(`Q ${current.reversePoint.x} ${current.reversePoint.y} ${current.startPoint.x} ${current.startPoint.y}`)           
                        splitLines.push(`M ${prev.startPoint.x} ${prev.startPoint.y} Q ${current.reversePoint.x} ${current.reversePoint.y} ${current.startPoint.x} ${current.startPoint.y}`)

                        this.segmentManager.addLine(current.startPoint, current.reversePoint)
                        this.segmentManager.addPoint({isFirst, isLast}, current.startPoint, currentIndex, 'startPoint')
                        this.segmentManager.addCurvePoint(current.reversePoint, currentIndex, 'reversePoint')

                    } else {
                        // 이전도 drag 일 때 
                        d.push(`C ${prev.endPoint.x} ${prev.endPoint.y}  ${current.reversePoint.x} ${current.reversePoint.y} ${current.startPoint.x} ${current.startPoint.y}`)
                        splitLines.push(`M ${prev.startPoint.x} ${prev.startPoint.y} C ${prev.endPoint.x} ${prev.endPoint.y}  ${current.reversePoint.x} ${current.reversePoint.y} ${current.startPoint.x} ${current.startPoint.y}`)
                        this.segmentManager.addLine(prev.startPoint, prev.endPoint)
                        this.segmentManager.addLine(current.startPoint, current.reversePoint)
                        if (!isLast) {
                            this.segmentManager.addGuideLine(current.startPoint, current.endPoint)
                            this.segmentManager.addPoint({isFirst, isLast}, current.startPoint, currentIndex, 'startPoint')
                        }

                        this.segmentManager.addCurvePoint(prev.endPoint, prevIndex, 'endPoint')                        
                        this.segmentManager.addCurvePoint(current.reversePoint, currentIndex, 'reversePoint')

                        if (!isLast) {
                            this.segmentManager.addCurvePoint(current.endPoint, currentIndex, 'endPoint')
                        }

                           
                    }

                }

            }

        }

        var {startPoint, moveXY, dragPoints, altKey} = moving;


        if (moveXY) {
            var prev = points[points.length - 1];

            if (dragPoints) {
                // 마지막 지점을 드래그 중일 때  
                // 아직 움직이는 지점이기 때문에 

                if (!prev) {
                    var {x, y} = PathGenerator.getReversePoint(startPoint, moveXY);
                    guide.push(`M ${moveXY.x} ${moveXY.y}`)
                    guide.push(`L ${startPoint.x} ${startPoint.y}`)                    
                    guide.push(`L ${x} ${y}`)

                    this.segmentManager.addCurvePoint(startPoint)
                    this.segmentManager.addCurvePoint(moveXY)
                    this.segmentManager.addCurvePoint({x, y})

                } else if (prev.curve) {
                    // 이전 것이 곡선이면 C 로 대응 
                    var {x, y} = PathGenerator.getReversePoint(startPoint, moveXY);                    
                    guide.push(`M ${prev.startPoint.x} ${prev.startPoint.y}`)
                    guide.push(`C ${prev.endPoint.x} ${prev.endPoint.y}  ${x} ${y} ${startPoint.x} ${startPoint.y}`)

                    this.segmentManager.addLine(prev.startPoint, prev.endPoint)
                    this.segmentManager.addLine(startPoint, {x, y})
                    this.segmentManager.addLine(startPoint, moveXY)

                    this.segmentManager.addCurvePoint(prev.endPoint)                    
                    this.segmentManager.addCurvePoint({x, y})
                    this.segmentManager.addCurvePoint(moveXY)
                    
                    this.segmentManager.addPoint(false, startPoint)

                } else if (prev.curve === false ) {
                    // 이전 것이 점이면 Q 로 대응 
                    // 내가 드래그 중이므로  내 좌표랑 start 좌표랑 비교 해서 이전 좌표를 구하기 
                    var {x, y} = PathGenerator.getReversePoint(startPoint, moveXY);
                    guide.push(`M ${prev.startPoint.x} ${prev.startPoint.y}`)                    
                    guide.push(`Q ${x} ${y} ${startPoint.x} ${startPoint.y}`)

                    this.segmentManager.addLine(moveXY, {x, y})
                    this.segmentManager.addPoint(false, startPoint)
                    this.segmentManager.addCurvePoint({x, y})
                    this.segmentManager.addCurvePoint(moveXY)        
                } 

            } else {

                if (!prev) {

                } else if (prev.curve) {
                    // 이전에 드래그 한 point 가 있을 경우 Q 로 
                    guide.push(`M ${prev.startPoint.x} ${prev.startPoint.y}`)
                    guide.push(`Q ${prev.endPoint.x} ${prev.endPoint.y} ${moveXY.x} ${moveXY.y}`)

                    this.segmentManager.addLine(prev.endPoint, prev.startPoint)
                    this.segmentManager.addCurvePoint(prev.endPoint)  
                } else {
                    // 이전에 점이고 지금도 점이면  직선 
                    guide.push(`M ${prev.startPoint.x} ${prev.startPoint.y}`)
                    guide.push(`L ${moveXY.x} ${moveXY.y}`)                    

                    this.segmentManager.addPoint(false, prev.startPoint)
                }
            }

        }


        return `<svg width="100%" height="100%">
        <path d="${guide.join('')}" class='guide' />        
        <path d="${d.join('')}" class='object'/>
        ${splitLines.map(it => {
            return `<path d="${it}" class='split-path' />`; 
        }).join('')}
        ${this.segmentManager.toString()}
    </svg>`
    }
}