import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP, CLICK, DOUBLECLICK } from "../../../util/Event";
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
        // this.pathParser = new PathParser('M213.1,6.7c-32.4-14.4-73.7,0-88.1,30.6C110.6,4.9,67.5-9.5,36.9,6.7C2.8,22.9-13.4,62.4,13.5,110.9C33.3,145.1,67.5,170.3,125,217c59.3-46.7,93.5-71.9,111.5-106.1C263.4,64.2,247.2,22.9,213.1,6.7z');
        this.pathGenerator = new PathGenerator(this)

        // this.pathParser.translate(100, 100);
        // this.state.points = this.pathParser.convertGenerator();
        
        // this.bindData('$view');
    }

    initState() {
        return {
            points: [],
            mode: 'draw',
            $target: null, 
            isSegment: false,
            isFirstSegment: false 
        }
    }

    template() {
        return `<div class='path-editor-view' tabIndex="-1" ref='$view' ></div>`
    }

    [KEYUP() + IF('Escape') + IF('Enter') + PREVENT + STOP] () {



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
        var { d } = this.pathGenerator.toPath(pathRect.x, pathRect.y, editor.scale);
        var artboard = editor.selection.currentArtboard
        var layer; 
        if (artboard) {

            var x = pathRect.x / editor.scale;
            var y = pathRect.y / editor.scale;
            var width = pathRect.width / editor.scale;
            var height = pathRect.height / editor.scale; 

            layer = artboard.add(new SVGPathItem({
                width: Length.px(width),
                height: Length.px(height),
                d
            }))

            layer.setScreenX(x);
            layer.setScreenY(y);
        }

        return layer; 
    }

    updatePathLayer (pathRect) {
        var { d } = this.pathGenerator.toPath(pathRect.x, pathRect.y, editor.scale);

        var layer; 
        var x = pathRect.x / editor.scale;
        var y = pathRect.y / editor.scale;
        var width = pathRect.width / editor.scale;
        var height = pathRect.height / editor.scale; 


        this.emit('updatePathItem', {
            x, y, width, height, d
        })
    }

    addPathLayer(pathRect) {
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
    }

    isMode (mode) {
        return this.state.mode === mode; 
    }

    [EVENT('changeScale')] () {

        this.refresh();

    }

    refresh (obj) {

        
        if (!obj) {
            var current = editor.selection.current;
            if (current && current.is('svg-path')) {
                obj = current;
            }
        }

        if (obj && obj.d) {
            this.pathParser.reset(obj.d)
            this.pathParser.scale(editor.scale, editor.scale);
            this.pathParser.translate(obj.screenX.value * editor.scale, obj.screenY.value * editor.scale)
            this.state.points = this.pathParser.convertGenerator();
    
            this.bindData('$view');           
        }

    }

    [EVENT('showPathEditor')] (mode = 'draw', obj = {}) {

        if (mode === 'move') {
            obj.current = null;
        } else {
            if (!obj.current) {
                obj.current = null; 
            }
        }

        this.changeMode(mode, obj);

        this.refresh(obj);

        this.$el.show();
        this.$el.focus();
    }

    [EVENT('hidePathEditor')] () {
        this.$el.hide();
        this.emit('finishPathEdit')
    }

    [BIND('$view')] () {
        return {
            class: `${this.state.mode}`,
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

        var pathRect = this.refs.$view.$('path.object').rect()
        pathRect.x -= this.state.rect.x;
        pathRect.y -= this.state.rect.y;
        
        this.updatePathLayer(pathRect);
    }

    [POINTERMOVE('$view') + PREVENT] (e) {
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

        } else {

            this.changeMode('draw');   
    
            this.state.startPoint = this.state.dragXY;
            this.state.dragPoints = false
            this.state.endPoint = null;
        }

    }

    move (dx, dy) {


        if (this.isMode('segment-move')) {

            this.pathGenerator.move(dx, dy, editor.config.get('bodyEvent'));

            this.bindData('$view');            

            var pathRect = this.refs.$view.$('path.object').rect()
            pathRect.x -= this.state.rect.x;
            pathRect.y -= this.state.rect.y;
            
            this.updatePathLayer(pathRect);

        } else if (this.isMode('draw')) {
            var e = editor.config.get('bodyEvent');

            this.state.dragPoints = e.altKey ? false : true; 
        }

    }

    end (dx, dy) {

        if (this.state.$target.is(this.refs.$view) && editor.config.get('bodyEvent').altKey)  {
            // 에디팅  종료 
            this.trigger('hidePathEditor')
            return ; 
        }

        if (this.isMode('segment-move')) {

        } else if (this.isMode('draw')) {            


            if (this.state.isFirstSegment) {
                this.changeMode('modify');            
                this.pathGenerator.setConnectedPoint(dx, dy);
        
                this.bindData('$view');       

                if (this.state.current) {
                    this.refreshPathLayer();
                } else {
                    var pathRect = this.refs.$view.$('path.object').rect()
                    pathRect.x -= this.state.rect.x;
                    pathRect.y -= this.state.rect.y;                    
                    this.addPathLayer(pathRect); 
                    this.trigger('hidePathEditor')
                }
            } else {
                this.pathGenerator.moveEnd(dx, dy);

                this.bindData('$view');
            }

        }

    }   

} 