import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, POINTERMOVE, PREVENT, KEYUP, IF, STOP } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import PathGenerator from "../../../editor/parse/PathGenerator";
import Dom from "../../../util/Dom";
import PathParser from "../../../editor/parse/PathParser";
import { SVGLayer } from "../../../editor/items/layers/SVGLayer";
import Color from "../../../util/Color";
import { SVGPathItem } from "../../../editor/items/layers/SVGPathItem";
import { Length } from "../../../editor/unit/Length";

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

    [KEYUP() + IF('Escape') + PREVENT + STOP] () {
        this.addPathLayer()
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

    addPathLayer(pathRect) {

        var layer = this.makePathLayer(pathRect)
        if (layer) {
            editor.selection.select(layer);

            this.emit('refreshAll')
            this.emit('refreshSelection');
        }

        this.trigger('hidePathEditor');

    }

    changeMode (mode, obj) { 
        this.setState({
            mode,
            ...obj
        }, false)    
    }

    isMode (mode) {
        return this.state.mode === mode; 
    }

    [EVENT('showPathEditor')] (mode = 'draw', obj = {}) {
        this.changeMode(mode, obj);

        this.$el.show();
    }

    [EVENT('hidePathEditor')] () {
        this.$el.hide();
    }

    [BIND('$view')] () {
        return {
            innerHTML: this.pathGenerator.makeSVGPath()
        }
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

    [POINTERSTART('$view') + MOVE() + END()] (e) {

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
                this.changeMode('close');            
                this.pathGenerator.setConnectedPoint();

                this.bindData('$view');       

                setTimeout(() => {
                    var pathRect = this.refs.$view.$('path.object').rect()
                    pathRect.x -= this.state.rect.x;
                    pathRect.y -= this.state.rect.y;
                    this.addPathLayer(pathRect); 
                }, 100)

                return false;                 
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

        } else if (this.isMode('draw')) {
            var e = editor.config.get('bodyEvent');

            this.state.dragPoints = e.altKey ? false : true; 
        }

    }

    end (dx, dy) {

        if (this.isMode('segment-move')) {

        } else if (this.isMode('draw')) {

            this.pathGenerator.moveEnd(dx, dy);

            this.bindData('$view');
        }

    }   

} 