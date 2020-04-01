import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND} from "../../../util/Event";
import PathParser from "../../../editor/parse/PathParser";

import { SVGPathItem } from "../../../editor/items/layers/SVGPathItem";
import { Length } from "../../../editor/unit/Length";
import PathStringManager from "../../../editor/parse/PathStringManager";
import PathGenerator from "../../../editor/parse/PathGenerator";


export default class PathDrawView extends UIElement {

    initialize() {
        super.initialize();

        this.pathParser = new PathParser();
    }

    initState() {
        return {
            changeEvent: 'updatePathItem', 
            points: [],
            $target: null, 
            screenX: Length.px(0),
            screenY: Length.px(0),
            screenWidth: Length.px(0),
            screenHeight: Length.px(0)
        }
    }

    get scale () {
        return this.$editor.scale; 
    }

    template() {
        return /*html*/`
        <div class='path-draw-view' tabIndex="-1">
            <div class='path-draw-container' ref='$view'></div>
        </div>`
    }

    initRect (isForce  = false) {
        if (!this.state.rect || isForce) {
            this.state.rect = this.parent.refs.$body.rect();
        }
    }

    get totalPathLength () {
        if (!this.refs.$view) return 0 
        var $obj = this.refs.$view.$('path.object');
        if (!$obj) return 0; 

        return $obj.totalLength
    }

    makePathLayer (pathRect) {
        var artboard = this.$selection.currentArtboard
        var layer; 
        if (artboard) {

            var x = pathRect.x / this.scale;
            var y = pathRect.y / this.scale;
            var width = pathRect.width / this.scale;
            var height = pathRect.height / this.scale; 

            // rect 기준으로 상대 좌표로 다시 변환 
            const parser = new PathParser(PathStringManager.makePathByPoints(this.state.points))
            const d = PathGenerator.generatorPathString(parser.convertGenerator(), x, y, this.scale);

            layer = artboard.add(new SVGPathItem({
                width: Length.px(width),
                height: Length.px(height),
                d,
                totalLength: this.totalPathLength
            }))

            layer.setScreenX(x);
            layer.setScreenY(y);
        }

        return layer; 
    }

    addPathLayer() {
        var pathRect = this.getPathRect()

        if (pathRect.width !==  0 && pathRect.height !== 0) {

            var layer = this.makePathLayer(pathRect)
            if (layer) {
                this.$selection.select(layer);
    
                this.emit('refreshAll')
                this.emit('refreshSelection');
            }
        }
        
    }

    changeMode (obj) { 
        this.setState({
            ...obj
        }, false)    
    }

    getCurrentObject () {
        var current = this.state.current; 

        if (!current) {
            return null;
        }

        return {
            current,
            d: current.d,
            screenX: current.screenX,
            screenY: current.screenY,
            screenWidth: current.screenWidth,
            screenHeight: current.screenHeight,
        }
    }

    [EVENT('showPathDrawEditor')] (obj = {}) {

        this.changeMode(obj);

        this.$el.show();
        this.$el.focus();
    }

    [EVENT('hidePathDrawEditor')] () {
        this.pathParser.reset('');
        this.setState(this.initState(), false)
        this.refs.$view.empty()
        this.$el.hide();
        this.emit('finishPathEdit')
        this.emit('hidePathManager');
    }

    [BIND('$view')] () {
        return {
            innerHTML: /*html*/`
            <svg width="100%" height="100%" class='svg-editor-canvas'>
                <path class='object' d="${PathStringManager.makePathByPoints(this.state.points)}" />
            </svg>
            ` 
        }
    }

    renderPath () {
        this.bindData('$view');
    }

    getPathRect () {
        this.initRect(true);

        var $obj = this.refs.$view.$('path.object')

        var pathRect = {x: Length.px(0), y: Length.px(0),  width: Length.px(0), height: Length.px(0)}
        if ($obj) {

            pathRect = $obj.rect()
            pathRect.x -= this.state.rect.x;
            pathRect.y -= this.state.rect.y;
        }

        return pathRect;
    }

    [POINTERSTART('$view') + MOVE() + END()] (e) {
        this.initRect();

        this.state.altKey = false; 

        this.state.startXY = {
            x: e.xy.x - this.state.rect.x, 
            y: e.xy.y - this.state.rect.y
        }

        this.state.points = [this.state.startXY]; 
    }

    move (dx, dy) {

        this.state.points.push({
            x: this.state.startXY.x + dx,
            y: this.state.startXY.y + dy,
        })

        this.renderPath();
    }

    end (dx, dy) {
        this.addPathLayer(); 
        this.trigger('hidePathDrawEditor')
    }   

} 