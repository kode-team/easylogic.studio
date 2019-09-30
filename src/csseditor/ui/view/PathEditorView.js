import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP, CLICK, DOUBLECLICK, KEY } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import PathGenerator from "../../../editor/parse/PathGenerator";
import Dom from "../../../util/Dom";
import PathParser from "../../../editor/parse/PathParser";

import { SVGPathItem } from "../../../editor/items/layers/SVGPathItem";
import { Length } from "../../../editor/unit/Length";
import { getBezierPoints, recoverBezier, recoverBezierQuard, getBezierPointsQuard, recoverBezierLine, getBezierPointsLine } from "../../../util/functions/bezier";

export default class PathEditorView extends UIElement {

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
            mode: 'draw',
            $target: null, 
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
        return `<div class='path-editor-view' tabIndex="-1" ref='$view' ></div>`
    }

    isShow () {
        return this.state.isShow
    }

    [KEYUP('document') + IF('isShow') + KEY('Escape') + KEY('Enter') + PREVENT + STOP] () {

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
        var rect = this.refs.$view.$('path.object').rect()
        rect.x -= this.state.rect.x;
        rect.y -= this.state.rect.y;

        var totalLength = this.refs.$view.$('path.object').el.getTotalLength()        
        var { d } = this.pathGenerator.toPath(
            rect.x * this.scale, 
            rect.y * this.scale, 
            this.scale
        );

        this.emit(this.state.changeEvent, {
            d, totalLength, rect 
        })
        this.emit('refreshPathLayer')
    }

    addPathLayer(pathRect) {
        var pathRect = this.refs.$view.$('path.object').rect()
        pathRect.x -= this.state.rect.x;
        pathRect.y -= this.state.rect.y;

        this.changeMode('modify');
        // this.bindData('$view');


        var layer = this.makePathLayer(pathRect)
        if (layer) {
            editor.selection.select(layer);

            this.emit('refreshAll')
            this.emit('refreshSelection');
        }

        // this.trigger('hidePathEditor');

    }

    changeMode (mode, obj) { 
        this.setState({
            mode,
            moveXY: null,
            ...obj
        }, false)    

        this.emit('changePathManager', this.state.mode );
    }

    [EVENT('changePathManager')] (mode) {
        this.setState({ mode }, false);
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
            this.pathParser.translate(obj.screenX.value * this.scale, obj.screenY.value * this.scale)
            this.state.points = this.pathParser.convertGenerator();      
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

    [EVENT('hideSubEditor')] () {
        // this.trigger('hidePathEditor');
    }

    [BIND('$view')] () {
        return {
            class: {
                'draw': this.state.mode === 'draw',
                'modify': this.state.mode === 'modify',
                'segment-move': this.state.mode === 'segment-move',                
            },
            innerHTML: this.pathGenerator.makeSVGPath()
        }
    }

    getXY ([x, y]) {
        return {x, y}
    }

    [CLICK('$view .split-path')] (e) {
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

    refreshPathLayer () {
        this.updatePathLayer();
    }

    [POINTERMOVE('$view')] (e) {
        if (this.isMode('draw') && this.state.rect) {            
            this.state.moveXY = {
                x: e.xy.x - this.state.rect.x, 
                y: e.xy.y - this.state.rect.y 
            }; 

            this.state.altKey = e.altKey
            
            this.bindData('$view');
        } else {
            // this.state.altKey = false; 
        }

    }

    [DOUBLECLICK('$view [data-segment]')] (e) {
        this.state.$target = e.$delegateTarget
        var index = +this.state.$target.attr('data-index')


        this.pathGenerator.convertToCurve(index);

        this.bindData('$view');

        this.refreshPathLayer()
    }


    [POINTERSTART('$view :not(.split-path)') + MOVE() + END()] (e) {

        // console.log(e);

        this.state.rect = this.parent.refs.$body.rect();            
        this.state.canvasOffset = this.refs.$view.rect();
        this.state.altKey = false; 

        this.state.dragXY = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }; 


        this.state.$target = Dom.create(e.target);
        this.state.isSegment = this.state.$target.attr('data-segment') === 'true';
        this.state.isFirstSegment = this.state.isSegment && this.state.$target.attr('data-is-first') === 'true';
        

        if (this.state.isSegment) {

            if (this.state.isFirstSegment && this.isMode('draw')) {

                // 마지막 지점을 연결할 예정이기 때문에 
                // startPoint 는  M 이었던 startPoint 로 정리된다. 
                var index = +this.state.$target.attr('data-index')
                this.state.startPoint = this.state.points[index].startPoint;
                this.state.dragPoints = false
                this.state.endPoint = null;

            } else {
                this.changeMode('segment-move');
                var index = +this.state.$target.attr('data-index')
                this.pathGenerator.setCachePoint(index);
            }

        } else if (this.isMode('draw')) { 
            this.state.startPoint = this.state.dragXY;
            this.state.dragPoints = false
            this.state.endPoint = null;
        } else  {
            // draw, segment-move 모드가 아닌 데  드래그 하는 경우는 
            // 영역을 선택하기 위한 용도 
        }

    }

    move (dx, dy) {


        if (this.isMode('segment-move')) {

            this.pathGenerator.move(dx, dy, editor.config.get('bodyEvent'));

            this.bindData('$view');            

            this.updatePathLayer();

        } else if (this.isMode('draw')) {
            var e = editor.config.get('bodyEvent');

            this.state.dragPoints = e.altKey ? false : true; 
        }

    }

    end (dx, dy) {

        if (this.state.$target.is(this.refs.$view) && editor.config.get('bodyEvent').altKey)  {
            this.changeMode('modify');
            // 에디팅  종료 
            this.trigger('hidePathEditor')
            return ; 
        }

        if (this.isMode('segment-move')) {

            this.changeMode('modify');            

        } else if (this.isMode('draw')) {            


            if (this.state.isFirstSegment) {
                this.changeMode('modify');            
                this.pathGenerator.setConnectedPoint(dx, dy);
        
                this.bindData('$view');       
                   
                if (this.state.current) {
                    this.refreshPathLayer;
                } else {
                 
                    this.addPathLayer(); 
                    this.trigger('hidePathEditor')
                }
            } else {
                // this.changeMode('modify');

                this.pathGenerator.moveEnd(dx, dy);

                this.bindData('$view');
            }

        }

    }   

} 