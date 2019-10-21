import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP, CLICK, DOUBLECLICK, KEY } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import PathGenerator from "../../../editor/parse/PathGenerator";
import Dom from "../../../util/Dom";
import PathParser from "../../../editor/parse/PathParser";

import { SVGPathItem } from "../../../editor/items/layers/SVGPathItem";
import { Length } from "../../../editor/unit/Length";
import { getBezierPoints, recoverBezier, recoverBezierQuard, getBezierPointsQuard, recoverBezierLine, getBezierPointsLine } from "../../../util/functions/bezier";


const SegmentConvertor = class extends UIElement {

    [DOUBLECLICK('$view [data-segment]')] (e) {
        var index = +e.$delegateTarget.attr('data-index')


        this.pathGenerator.convertToCurve(index);

        this.bindData('$view');

        this.refreshPathLayer()
    }
}

const PathCutter = class extends SegmentConvertor {

    [CLICK('$view .split-path')] (e) {
        this.initRect()
        var parser = new PathParser(e.$delegateTarget.attr('d'));
        var clickPosition = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 

        if (parser.segments[1].command === 'C') {
            var points = [
                this.getXY(parser.segments[0].values),
                this.getXY(parser.segments[1].values.slice(0, 2)),
                this.getXY(parser.segments[1].values.slice(2, 4)),
                this.getXY(parser.segments[1].values.slice(4, 6))
            ]
    
            var curve = recoverBezier(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);
    
            this.changeMode('modify');
    
            this.pathGenerator.setPoint(getBezierPoints(points, t))        
    
        } else if (parser.segments[1].command === 'Q') {
            var points = [
                this.getXY(parser.segments[0].values),
                this.getXY(parser.segments[1].values.slice(0, 2)),
                this.getXY(parser.segments[1].values.slice(2, 4))
            ]
    
            var curve = recoverBezierQuard(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);
    
            this.changeMode('modify');
    
            this.pathGenerator.setPointQuard(getBezierPointsQuard(points, t))        
        } else if (parser.segments[1].command === 'L') {
            var points = [
                this.getXY(parser.segments[0].values),
                this.getXY(parser.segments[1].values.slice(0, 2))
            ]

            var curve = recoverBezierLine(...points, 200)
            var t = curve(clickPosition.x, clickPosition.y);          

            this.changeMode('modify');
    
            this.pathGenerator.setPointLine(getBezierPointsLine(points, t))
        }




        this.bindData('$view');

        this.refreshPathLayer();

    }
}

export default class PathEditorView extends PathCutter {

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
            hasTransform: false, 
            mode: 'draw',
            $target: null, 
            clickCount: 0,
            isSegment: false,
            isFirstSegment: false,
            screenX: Length.px(0),
            screenY: Length.px(0),
            screenWidth: Length.px(0),
            screenHeight: Length.px(0)
        }
    }

    get scale () {
        return editor.scale; 
    }

    template() {
        return /*html*/`
        <div class='path-editor-view' tabIndex="-1" ref='$view'> 
        </div>
        `
    }

    isShow () {
        return this.state.isShow
    }

    initRect (isForce  = false) {
        if (!this.state.rect || isForce) {
            this.state.rect = this.parent.refs.$body.rect();
        }
    }

    [KEYUP('document') + IF('isShow') + KEY('Escape') + KEY('Enter') + PREVENT + STOP] () {
        this.initRect();
        if (this.state.current) {
            this.refreshPathLayer();
        } else {
            var pathRect = this.refs.$view.$('path.object').rect()
            pathRect.x -= this.state.rect.x;
            pathRect.y -= this.state.rect.y;            
            this.addPathLayer(pathRect); 
        }
        this.trigger('hidePathEditor');        
    }

    makePathLayer (pathRect) {
        var totalLength = this.refs.$view.$('path.object').el.getTotalLength()                
        var { d } = this.pathGenerator.toPath(pathRect.x, pathRect.y, this.scale);
        var artboard = editor.selection.currentArtboard
        var layer; 
        if (artboard) {

            var x = pathRect.x / this.scale;
            var y = pathRect.y / this.scale;
            var width = pathRect.width / this.scale;
            var height = pathRect.height / this.scale; 

            layer = artboard.add(new SVGPathItem({
                width: Length.px(width),
                height: Length.px(height),
                d,
                totalLength
            }))

            layer.setScreenX(x);
            layer.setScreenY(y);
        }

        return layer; 
    }

    updatePathLayer () {
        this.initRect()
        var rect = this.refs.$view.$('path.object').rect()
        rect.x -= this.state.rect.x;
        rect.y -= this.state.rect.y;

        var totalLength = this.refs.$view.$('path.object').el.getTotalLength()       
        var minX = rect.x;
        var minY = rect.y; 
        
        var item = this.state.current;

        // textpath의 기준점은 
        // textpath 자체이기 때문에 
        // 내부의 path는 rect 로 정ㅇ의되지 않고 textpath 컨테이너 크기에 영향을 받는다.  
        if (item && item.is('svg-textpath')) {            
            var minX = item.screenX.value
            var minY = item.screenY.value
        }

        var { d } = this.pathGenerator.toPath(
            minX * this.scale, 
            minY * this.scale, 
            this.scale
        );


        var parser = new PathParser(d);
        // var [radian, cx, cy] = this.state.reverse
        // parser.rotate(radian, rect.width/2, rect.height/2) 

        this.emit(this.state.changeEvent, {
            d: parser.toString(), totalLength, rect 
        })


        this.emit('refreshPathLayer')
    }

    addPathLayer(pathRect) {
        this.initRect()
        var pathRect = this.refs.$view.$('path.object').rect()
        pathRect.x -= this.state.rect.x;
        pathRect.y -= this.state.rect.y;

        this.changeMode('modify');
        // this.bindData('$view');

        if (pathRect.width !==  0 && pathRect.height !== 0) {

            var layer = this.makePathLayer(pathRect)
            if (layer) {
                editor.selection.select(layer);
    
                this.emit('refreshAll')
                this.emit('refreshSelection');
            }
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

    [EVENT('changePathManager')] (mode) {
        this.setState({ mode, clickCount: 0 }, false);
        this.bindData('$view');
    }

    isMode (mode) {
        return this.state.mode === mode; 
    }

    [EVENT('changeScale')] () {

        this.refresh();

    }

    refresh (obj) {

        if (obj && obj.d) {
            this.pathParser.reset(obj.d)
            this.pathParser.scale(this.scale, this.scale);

            var x = obj.screenX.value * this.scale
            var y = obj.screenY.value * this.scale
            // var width = obj.screenWidth.value * this.scale
            // var height = obj.screenHeight.value * this.scale

            this.pathParser.translate(x, y)

            // var transform = Transform.parseStyle(obj.current.transform);
            // var rotateValue = transform.find(it => it.type === 'rotateZ' || it.type === 'rotate');
            // var transformRotate = 0; 

            // if (rotateValue) {
            //     transformRotate = rotateValue.value[0].value;
            // }

            // transformRotate = (transformRotate + 360) % 360
            // this.pathParser.rotate(degreeToRadian(transformRotate), x + width/2, y + height/2)

            // this.state.reverse = [
            //     degreeToRadian(-transformRotate), 
            //     x + width/2, 
            //     y + height/2
            // ]
            // this.state.reverseXY = {x, y, width, height}


            this.state.points = this.pathParser.convertGenerator();      
            this.state.hasTransform = !!obj.current.transform;
        } else {

            this.state.hasTransform = false;        
        }

        this.bindData('$view');             

    }

    [EVENT('showPathEditor')] (mode = 'draw', obj = {}) {

        if (mode === 'move') {
            obj.current = null;
            obj.points = [] 
        } else {
            if (!obj.current) {
                obj.current = null; 
            }
        }

        this.changeMode(mode, obj);

        this.refresh(obj);

        this.state.isShow = true; 
        this.$el.show();
        this.$el.focus();

        this.emit('showPathManager', { mode: this.state.mode });
    }

    [EVENT('hidePathEditor')] () {
        this.pathParser.reset('');
        this.setState(this.initState(), false)
        this.refs.$view.empty()
        this.$el.hide();
        this.emit('finishPathEdit')
        this.emit('hidePathManager');
    }

    [BIND('$view')] () {
        return {
            class: {
                'draw': this.state.mode === 'draw',
                'modify': this.state.mode === 'modify',
                'has-transform': !!this.state.hasTransform,
                'segment-move': this.state.mode === 'segment-move',         
            },
            innerHTML: this.pathGenerator.makeSVGPath()
        }
    }

    getXY ([x, y]) {
        return {x, y}
    }

    refreshPathLayer () {
        this.updatePathLayer();
    }

    [BIND('$splitCircle')] () {
        return {
            cx: this.state.splitXY.x,
            cy: this.state.splitXY.y
        }
    }

    [POINTERMOVE('$view')] (e) {        
        this.initRect()
        if (this.isMode('draw') && this.state.rect) {            
            this.state.moveXY = {
                x: e.xy.x - this.state.rect.x, 
                y: e.xy.y - this.state.rect.y 
            }; 

            this.state.altKey = e.altKey
            this.bindData('$view');                 
        } else {

            var isSplitPath = Dom.create(e.target).hasClass('split-path')
            if (isSplitPath) {
                this.state.splitXY = {
                    x: e.xy.x - this.state.rect.x, 
                    y: e.xy.y - this.state.rect.y 
                }; 
    
                this.bindData('$splitCircle');
            }


            this.state.altKey = false; 
        }

   
    }

    [POINTERSTART('$view :not(.split-path)') + MOVE() + END()] (e) {
        this.initRect();

        this.state.altKey = false; 
        var isDrawMode = this.isMode('draw');

        this.state.dragXY = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 


        var $target = Dom.create(e.target);

        if ($target.hasClass('svg-editor-canvas') && !isDrawMode) {
            this.changeMode('modify');
            this.trigger('hidePathEditor')
            return false; 
        }

        this.state.isSegment = $target.attr('data-segment') === 'true';
        this.state.isFirstSegment = this.state.isSegment && $target.attr('data-is-first') === 'true';
        

        if (isDrawMode) {

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
            if (this.state.isSegment) {
                this.changeMode('segment-move');
                var [index, segmentKey] = $target.attrs('data-index', 'data-segment-point')
                this.pathGenerator.setCachePoint(+index, segmentKey);
            }
        }

    }

    move (dx, dy) {


        if (this.isMode('segment-move')) {
            var e = editor.config.get('bodyEvent')
            this.pathGenerator.move(dx, dy, e);

            this.bindData('$view');            

            this.updatePathLayer();

        } else if (this.isMode('draw')) {
            var e = editor.config.get('bodyEvent');

            this.state.dragPoints = e.altKey ? false : true; 
        }

    }

    end (dx, dy) {

        if (this.isMode('modify')) {
            // NOOP 

        } else if (this.isMode('segment-move')) {

            this.changeMode('modify');           
            this.bindData('$view'); 

        } else if (this.isMode('draw')) {            


            if (this.state.isFirstSegment) {
                this.changeMode('modify');            
                this.pathGenerator.setConnectedPoint(dx, dy);
        
                this.bindData('$view');       
                   
                if (this.state.current) {
                    this.refreshPathLayer();
                } else {
                 
                    this.addPathLayer(); 
                    this.trigger('hidePathEditor')
                }
            } else {
                // this.changeMode('modify');

                this.pathGenerator.moveEnd(dx, dy);
                this.state.clickCount++;

                this.bindData('$view');
            }

        }

    }   

} 