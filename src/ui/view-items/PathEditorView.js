import UIElement, { EVENT } from "@sapa/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP, CLICK, DOUBLECLICK, ENTER, ESCAPE, DOUBLETAB, DELAY } from "@sapa/Event";
import PathGenerator from "@parser/PathGenerator";
import Dom from "@sapa/Dom";
import PathParser from "@parser/PathParser";

import { SVGPathItem } from "@items/layers/SVGPathItem";
import { Length } from "@unit/Length";
import { getBezierPoints, recoverBezier, recoverBezierQuard, getBezierPointsQuard, recoverBezierLine, getBezierPointsLine } from "@sapa/functions/bezier";
import { isFunction } from "@sapa/functions/func";
import { vec3 } from "gl-matrix";
import { getDist } from "@sapa/functions/math";
import { registElement } from "@sapa/registerElement";


/**
 * convert array[x, y] to object{x, y} 
 * 
 * @param {array} param0 
 */
function xy ([x, y]) {
    return {x, y}
}

const SegmentConvertor = class extends UIElement {


    convertToCurve (index) {

        this.pathGenerator.convertToCurve(index);

        this.renderPath()

        this.refreshPathLayer()
    }

    [DOUBLECLICK('$view [data-segment]')] (e) {
        var index = +e.$dt.attr('data-index')

        this.convertToCurve(index);
    }

    /**
     * Touch 용 에디팅을 위한 이벤트 
     * 
     * @param {TouchEvent} e 
     */
    [DOUBLETAB('$view [data-segment]') + PREVENT + DELAY(300)] (e) {
        var index = +e.$dt.attr('data-index')
        this.convertToCurve(index);           
    } 
}

const PathCutter = class extends SegmentConvertor {

    calculatePointOnLine (d, clickPosition) {
        var parser = new PathParser(d);

        if (parser.segments[1].command === 'C') {
            var points = [
                xy(parser.segments[0].values),
                xy(parser.segments[1].values.slice(0, 2)),
                xy(parser.segments[1].values.slice(2, 4)),
                xy(parser.segments[1].values.slice(4, 6))
            ]
    
            var curve = recoverBezier(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);

            return getBezierPoints(points, t).first[3]
    
        } else if (parser.segments[1].command === 'Q') {
            var points = [
                xy(parser.segments[0].values),
                xy(parser.segments[1].values.slice(0, 2)),
                xy(parser.segments[1].values.slice(2, 4))
            ]
    
            var curve = recoverBezierQuard(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);

            return getBezierPointsQuard(points, t).first[2]
        } else if (parser.segments[1].command === 'L') {
            var points = [
                xy(parser.segments[0].values),
                xy(parser.segments[1].values.slice(0, 2))
            ]

            var curve = recoverBezierLine(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);          
        
            return getBezierPointsLine(points, t).first[1]
        }     
        
        return clickPosition;
    }

    [POINTERSTART('$view .split-path') + MOVE() + END()] (e) {
        this.initRect()
        var parser = new PathParser(e.$dt.attr('d'));
        var clickPosition = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 
        var selectedSegmentIndex = -1;

        if (this.state.mode === 'path') {

            // this.changeMode('modify');
            this.state.dragXY = {
                x: e.xy.x - this.state.rect.x, 
                y: e.xy.y - this.state.rect.y
            }; 
            this.state.startPoint = this.state.dragXY;
            this.pathGenerator.setLastPoint(this.state.startPoint);
            this.state.isSplitPath = true; 
        
            this.renderPath()
               
            if (this.state.current) {
                this.refreshPathLayer();
            } else {
                this.addPathLayer(); 
                this.trigger('initPathEditorView')
            }            

            return; 
        } else {

            if (parser.segments[1].command === 'C') {
                var points = [
                    xy(parser.segments[0].values),
                    xy(parser.segments[1].values.slice(0, 2)),
                    xy(parser.segments[1].values.slice(2, 4)),
                    xy(parser.segments[1].values.slice(4, 6))
                ]
        
                var curve = recoverBezier(...points, 200)
                var t = curve(clickPosition.x, clickPosition.y);
        
                selectedSegmentIndex = this.pathGenerator.setPoint(getBezierPoints(points, t))        
        
            } else if (parser.segments[1].command === 'Q') {
                var points = [
                    xy(parser.segments[0].values),
                    xy(parser.segments[1].values.slice(0, 2)),
                    xy(parser.segments[1].values.slice(2, 4))
                ]
        
                var curve = recoverBezierQuard(...points, 200)
                var t = curve(clickPosition.x, clickPosition.y);
        
                selectedSegmentIndex = this.pathGenerator.setPointQuard(getBezierPointsQuard(points, t))        
            } else if (parser.segments[1].command === 'L') {
                var points = [
                    xy(parser.segments[0].values),
                    xy(parser.segments[1].values.slice(0, 2))
                ]
    
                var curve = recoverBezierLine(...points, 200)
                var t = curve(clickPosition.x, clickPosition.y);          
        
                selectedSegmentIndex = this.pathGenerator.setPointLine(getBezierPointsLine(points, t))
            }
    
    
            this.renderPath()
    
            this.refreshPathLayer();
    
            // segment 모드로 변경 
            this.changeMode('segment-move');
    
            // segment 캐쉬 
            this.pathGenerator.setCachePoint(selectedSegmentIndex, 'startPoint', this.$viewport.applyVerties(this.$snapManager.getSnapPoints()));
    
            // segment 선택 하기 
            this.pathGenerator.selectKeyIndex('startPoint', selectedSegmentIndex)
        }


    }
}

const PathTransformEditor = class extends PathCutter {

    [EVENT('changePathTransform')] (transformMoveType) {
        this.resetTransformZone()

        var {width, height} = this.state.transformZoneRect;
        this.pathGenerator.initTransform(this.state.transformZoneRect);

        switch(transformMoveType) {
        case 'flipX':
            this.pathGenerator.transform('flipX', width, 0)     // rect 가운데를 기준으로 뒤집기 
            break; 
        case 'flipY':
            this.pathGenerator.transform('flipY', 0, height)    
            break;        
        case 'flip':
            this.pathGenerator.transform('flip', width, height)                          
        }
        

        this.renderPath()

        this.refreshPathLayer();        
    }


    [EVENT('changePathUtil')] (utilType) {
        switch(utilType) {
        case 'reverse':
            // 이전 scale 로 복구 한 다음 새로운 path 를 설정한다. 

            const { d } = this.pathGenerator.toPath()

            const pathParser = new PathParser(d);
            pathParser.reverse();
            pathParser.transformMat4(this.state.cachedMatrixInverse)

            this.refresh({ d: pathParser.d }) 
            break;
        }    
    }
}

const FIELDS = ['fill', 'fill-opacity', 'stroke', 'stroke-width']

/**
 * @property {PathGenerator} pathGenerator
 * @property {PathParser} pathParser
 */
export default class PathEditorView extends PathTransformEditor {


    initialize() {
        super.initialize();

        this.pathParser = new PathParser();
        this.pathGenerator = new PathGenerator(this)
    }

    initState() {
        return {
            changeEvent: 'updatePathItem', 
            isShow: false,
            points: [],
            mode: 'path',
            clickCount: 0,
            isSegment: false,
            isFirstSegment: false,
            screenX: Length.z(),
            screenY: Length.z(),
            screenWidth: Length.z(),
            screenHeight: Length.z()
        }
    }

    get scale () {
        return this.$viewport.scale; 
    }

    template() {
        return /*html*/`
        <div class='path-editor-view' tabIndex="-1">
            <div class='path-container' ref='$view'></div>
            <div class='path-container split-panel'>
                <svg width="100%" height="100%">
                    <circle ref='$splitCircle' class='split-circle' />
                </svg>
            </div>
            <div class='segment-box' ref='$segmentBox'></div>
        </div>`
    }

    isShow () {
        return this.state.isShow
    }

    initRect (isForce  = false) {
        if (!this.state.rect || isForce) {
            this.state.rect = this.parent.refs.$body.rect();
        }
    }

    [KEYUP('document') + IF('isShow') + ENTER + PREVENT + STOP] () {
        if (this.state.current) {
            this.refreshPathLayer();
            this.trigger('hidePathEditor');
        } else {     
            this.addPathLayer(); 
        }

        if (!this.state.current && this.state.points.length) {
            this.trigger('initPathEditorView');
        } else {
            this.trigger('hidePathEditor');
        }


    }

    [KEYUP('document') + IF('isShow') + ESCAPE + PREVENT + STOP] () {
        if (this.state.current) {
            this.refreshPathLayer();
        } else {     
            this.addPathLayer(); 
        }

        this.trigger('hidePathEditor');
    }    

    get totalPathLength () {
        if (!this.refs.$view) return 0 
        var $obj = this.refs.$view.$('path.object');
        if (!$obj) return 0; 

        return $obj.totalLength
    }

    makePathLayer () {
        var project = this.$selection.currentProject
        var layer; 
        if (project) {

            const newPath = new PathParser(this.pathGenerator.toPath().d);
            newPath.transformMat4(this.$viewport.matrixInverse);
            const bbox = newPath.getBBox();

            const newWidth = vec3.distance(bbox[1], bbox[0]);
            const newHeight = vec3.distance(bbox[3], bbox[0]);

            newPath.translate(-bbox[0][0], -bbox[0][1])

            const pathItem = {
                x: Length.px(bbox[0][0]),
                y: Length.px(bbox[0][1]),
                width: Length.px(newWidth),
                height: Length.px(newHeight),
                d: newPath.d,
                totalLength: this.totalPathLength,
                fill: `#C4C4C4`
            }

            FIELDS.forEach(key => {
                if (this.state[key]) {
                    pathItem[key] = this.state[key];
                }
            });  
            
            const containerItem = this.$selection.getArtboardByPoint(bbox[0]) || project;


            layer = containerItem.appendChildItem(new SVGPathItem(pathItem));

        }

        return layer; 
    }

    get isBoxMode () {
        return this.state.box === 'box'
    }

    updatePathLayer () {
        var { d } = this.pathGenerator.toPath();

        var parser = new PathParser(d);
        parser.transformMat4(this.$viewport.matrixInverse)

        this.emit(this.state.changeEvent, {
            d: parser.d, 
            box: this.state.box,
            totalLength: this.totalPathLength,
        })
    }

    /**
     * ArtBoard 에 path layer 추가하기 
     * 
     * @param {number} dx 
     * @param {number} dy 
     */
    addPathLayer() {
        this.changeMode('modify');

        var layer = this.makePathLayer()
        if (layer && layer.totalLength) {

            this.$selection.select(layer);
            this.trigger('hidePathEditor')
            this.emit('refreshAll')
        }

        
    }

    changeMode (mode, obj) { 
        this.setState({
            mode,
            clickCount: 0,
            moveXY: null,
            ...obj
        }, false)    

        this.emit('changePathManager', this.state.mode );
    }

    [EVENT('changePathManager')] (obj) {
        this.setState({ ...obj, clickCount: 0 }, false);
        this.renderPath()
    }

    isMode (mode) {
        return this.state.mode === mode; 
    }

    [EVENT('updateViewport')] (newScale, oldScale) {

        if (this.$el.isShow()) {

            // 이전 scale 로 복구 한 다음 새로운 path 를 설정한다. 

            const { d } = this.pathGenerator.toPath()

            const pathParser = new PathParser(d);
            pathParser.transformMat4(this.state.cachedMatrixInverse)

            this.refresh({ d: pathParser.d })
        } 
    }

    refresh (obj) {

        if (obj && obj.d) {
            this.pathParser.reset(obj.d)
            this.pathParser.transformMat4(this.$viewport.matrix);
            this.state.cachedMatrixInverse = this.$viewport.matrixInverse; 

            this.state.points = this.pathParser.convertGenerator();   
        }

        this.pathGenerator.initializeSelect();
        this.renderPath()

    }

    [EVENT('showPathEditor')] (mode = 'path', obj = {}) {

        if (mode === 'move') {
            obj.current = null;
            obj.points = [] 
        }

        obj.box = obj.box || 'canvas'

        this.changeMode(mode, obj);

        this.refresh(obj);

        this.state.isShow = true; 
        this.$el.show();
        this.$el.focus();

        this.emit('showPathManager', { mode: this.state.mode });
        this.emit('hidePathDrawEditor');
        this.emit('change.mode.view', 'PathEditorView');        
    }

    [EVENT('hidePathEditor')] () {

        if (this.$el.isShow()) {
            this.pathParser.reset('');
            this.setState(this.initState(), false)
            this.refs.$view.empty()
            this.$el.hide();
            this.emit('finishPathEdit')
            this.emit('hidePathManager');            
            this.emit('change.mode.view');               
        }

    }


    [EVENT('hideAddViewLayer')] () {
        this.state.isShow = false;        
        this.pathParser.reset('');
        this.setState(this.initState(), false)        
        this.refs.$view.empty()
        this.$el.hide();
        this.emit('hidePathManager');        
    }

    [BIND('$view')] () {
        return {
            class: {
                'path': this.state.mode === 'path',
                'modify': this.state.mode === 'modify',
                'box': this.state.box === 'box',
                'segment-move': this.state.mode === 'segment-move',         
            },
            innerHTML: this.pathGenerator.makeSVGPath()
        }
    }

    [BIND('$splitCircle')] () {
        if (this.state.splitXY) {
            return {
                cx: this.state.splitXY.x,
                cy: this.state.splitXY.y,
                r: 5
            }
        } else {
            return {
                r: 0
            }
        }

    }

    refreshPathLayer () {
        this.updatePathLayer();
    }

    renderPath () {
        this.bindData('$view');

    }

    getPathRect () {
        this.initRect(true);

        var $obj = this.refs.$view.$('path.object')

        var pathRect = {x: 0, y: 0,  width: 0, height: 0}
        if ($obj) {

            pathRect = $obj.rect()
            pathRect.x -= this.state.rect.x;
            pathRect.y -= this.state.rect.y;
        }

        return pathRect;
    }

    resetTransformZone() {
        var rect = this.getPathRect();

        this.state.transformZoneRect = rect; 
    }

    [POINTERMOVE('$view') + PREVENT] (e) {        
        this.initRect()
        if (this.isMode('path') && this.state.rect) {            
            this.state.moveXY = {
                x: e.xy.x - this.state.rect.x, 
                y: e.xy.y - this.state.rect.y 
            }; 

            this.state.altKey = e.altKey
            this.renderPath()
        } else {

            var $target = Dom.create(e.target)
            var isSplitPath = $target.hasClass('split-path')
            if (isSplitPath) {
                this.state.splitXY = this.calculatePointOnLine($target.attr('d') ,{
                    x: e.xy.x - this.state.rect.x, 
                    y: e.xy.y - this.state.rect.y 
                }); 
            } else {
                this.state.splitXY = null; 
            }

            this.bindData('$splitCircle');

            this.state.altKey = false; 
        }

   
    }

    [POINTERSTART('$view :not(.split-path)') + PREVENT + STOP + MOVE() + END()] (e) {
        this.initRect();

        this.state.altKey = false; 
        var isPathMode = this.isMode('path');

        this.state.dragXY = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 
        this.state.isOnCanvas = false; 

        var $target = Dom.create(e.target);

        if ($target.hasClass('svg-editor-canvas') && !isPathMode) {
            this.state.isOnCanvas = true; 
            // return false; 
        } else {

            this.pathGenerator.reselect()
            this.state.isSegment = $target.attr('data-segment') === 'true';
            this.state.isFirstSegment = this.state.isSegment && $target.attr('data-is-first') === 'true';
            
        }

        if (isPathMode) {

            if (this.state.isFirstSegment) {
                // 마지막 지점을 연결할 예정이기 때문에 
                // startPoint 는  M 이었던 startPoint 로 정리된다. 
                var index = +$target.attr('data-index')
                this.state.startPoint = this.state.points[index].startPoint;
            } else {
                this.state.startPoint = this.state.dragXY;
    
            }
            this.state.dragPoints = false
            this.state.endPoint = null;


        } else {
            if (this.isOnCanvas) {
                this.renderSelectBox(this.state.dragXY);
            } else if (this.state.isSegment) {
                this.changeMode('segment-move');
                var [index, segmentKey] = $target.attrs('data-index', 'data-segment-point')

                this.pathGenerator.setCachePoint(+index, segmentKey, this.$viewport.applyVerties(this.$snapManager.getSnapPoints()));

                this.pathGenerator.selectKeyIndex(segmentKey, index)
            }
        }

    }

    hideSelectBox() {
        this.refs.$segmentBox.css({
            left: Length.px(-100000)
        })
    }

    renderSelectBox (startXY = null, dx = 0, dy = 0) {

        var obj = {
            left: Length.px(startXY.x + (dx < 0 ? dx : 0)),
            top: Length.px(startXY.y + (dy < 0 ? dy : 0)),
            width: Length.px(Math.abs(dx)),
            height: Length.px(Math.abs(dy))
        }        

        this.refs.$segmentBox.css(obj)


    }

    getSelectBox() {

        var [x, y, width, height ] = this.refs.$segmentBox
                .styles('left', 'top', 'width', 'height')
                .map(it => Length.parse(it))

        var rect = {
            x, 
            y, 
            width, 
            height
        }

        rect.x2 = Length.px(rect.x.value + rect.width.value);
        rect.y2 = Length.px(rect.y.value + rect.height.value);

        return rect; 
    }

    move (dx, dy) {
        if (this.state.isOnCanvas) {
            // 드래그 상자 만들기 
            this.renderSelectBox(this.state.dragXY, dx, dy);

        } else if (this.isMode('segment-move')) {
            var e = this.$config.get('bodyEvent')
            this.pathGenerator.move(dx, dy, e);

            this.renderPath()      

            this.updatePathLayer();

        } else if (this.isMode('path')) {
            const dist = getDist(dx, dy, 0, 0);

            if (dist >= 2) {
                var e = this.$config.get('bodyEvent');

                this.state.dragPoints = e.altKey ? false : true; 
            }
        }
    }

    renderSegment (callback) {
        if (this.pathGenerator.selectedLength) {
            // reselect 로 이전 점들의 위치를 초기화 해줘야 한다. 꼭 
            this.pathGenerator.reselect()   
            // reselect 로 이전 점들의 위치를 초기화 해줘야 한다. 꼭 

            if (isFunction(callback)) callback();

            this.renderPath();

            this.updatePathLayer();
        }
    }

    [EVENT('deleteSegment')] () {
        // 특정 세그먼트만 삭제하기 
        this.renderSegment(() => {
            this.pathGenerator.removeSelectedSegment();
        })
    }

    [EVENT('moveSegment')] (dx, dy) {

        // segment 만 움직이기 
        this.renderSegment(() => {
            this.pathGenerator.moveSelectedSegment(dx, dy);
        })
    }


    [EVENT('initPathEditorView')] () {
        this.pathParser.reset('');
        this.setState(this.initState(), false)
        this.state.isShow = true; 
        this.refs.$view.empty()
        this.$el.focus();
    }

    end (dx, dy) {

        if (this.state.isOnCanvas) {
            if (dx === 0 &&  dy === 0) {    // 아무것도 움직인게 없으면 편집 종료 
                this.changeMode('modify');
                this.trigger('hidePathEditor')
            } else {
                // 움직였으면 drag 상자를 기준으로 좌표를 검색해서 선택한다. 
                // this.renderSelectBox(this.state.dragXY, dx, dy);
                this.changeMode('segment-move');
                this.pathGenerator.selectInBox(this.getSelectBox())
                this.renderPath()
                // 여기에 무엇을 할까? 
                this.hideSelectBox();
            }

        } else if (this.isMode('modify')) {
            // NOOP 

        } else if (this.isMode('segment-move')) {

            this.changeMode('modify');      
            // 마지막 지점에서 다시 renderpath 를 하게 되면 element 가 없어서 double 클릭을 인식 할 수가 없음. 
            // 그래서 삭제하니 이코드는 주석으로 그대로 나두자.      
            // this.renderPath()        

        } else if (this.isMode('path')) {            


            if (this.state.isFirstSegment) {
                this.changeMode('modify');            
                this.pathGenerator.setConnectedPoint(dx, dy);
        
                this.renderPath()
                   
                if (this.state.current) {
                    this.refreshPathLayer();
                } else {
                    this.addPathLayer(); 
                    this.trigger('initPathEditorView')
                }                
            } else {
                if ( this.state.isSplitPath) {
                    // NOOP 
                } else {
                    this.pathGenerator.moveEnd(dx, dy);
                    this.state.clickCount++;
    
                    this.renderPath()
                }
            }
            this.state.isSplitPath = false; 
        }

    }   

} 


registElement({ PathEditorView })