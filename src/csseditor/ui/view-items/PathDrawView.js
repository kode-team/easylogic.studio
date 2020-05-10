import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP} from "../../../util/Event";
import PathParser from "../../../editor/parse/PathParser";

import { SVGPathItem } from "../../../editor/items/layers/SVGPathItem";
import { Length } from "../../../editor/unit/Length";
import PathStringManager from "../../../editor/parse/PathStringManager";
import PathGenerator from "../../../editor/parse/PathGenerator";
import Point from "../../../editor/parse/Point";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { SVGFill } from "../../../editor/svg-property/SVGFill";

const FIELDS = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']

export default class PathDrawView extends UIElement {

    initialize() {
        super.initialize();

        this.pathParser = new PathParser();
    }

    initState() {
        return {
            points: [],
            $target: null, 
            fill: 'transparent',
            stroke: 'black',
            'fill-opacity': null,
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            tolerance: 1,
            screenX: Length.px(0),
            screenY: Length.px(0),
            screenWidth: Length.px(0),
            screenHeight: Length.px(0)
        }
    }


    [EVENT('changeDrawManager')] (obj) {
        this.setState({ ...obj }, false);
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

    [KEYUP('document') + IF('isShow') + ESCAPE + ENTER + PREVENT + STOP] () {
        this.trigger('hidePathDrawEditor');        
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
            const simplyPoints = Point.simply(this.state.points, this.state.tolerance)
            const parser = new PathParser(PathStringManager.makePathByPoints(simplyPoints))
            const d = PathGenerator.generatorPathString(parser.convertGenerator(), pathRect.x, pathRect.y, this.scale);

            layer = artboard.add(new SVGPathItem({
                width: Length.px(width),
                height: Length.px(height),
                d,
                totalLength: this.totalPathLength
            }))

            FIELDS.forEach(key => {
                if (this.state[key]) layer.reset({ [key]: this.state[key] })    
            });

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
                // this.$selection.select(layer);
                this.emit('refreshAll')
            }
        }
        
    }

    changeMode (obj) {       
        this.setState({
            ...this.initState(),
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

        this.emit('showDrawManager', {
            instance: this,
            fill: this.state.fill,
            stroke: this.state.stroke,
            'fill-opacity': this.state['fill-opacity'],
            'stroke-width': this.state['stroke-width'],
            'stroke-linecap': this.state['stroke-linecap'],
            'stroke-linejoin': this.state['stroke-linejoin'],            
        });        

        this.emit('hidePathEditor');
        this.emit('change.mode.view', 'PathDrawView');
    }

    [EVENT('initPathDrawEditor')] () {
        this.pathParser.reset('');
        this.refs.$view.empty()
    }

    [EVENT('hidePathDrawEditor')] () {

        if (this.$el.isShow()) {
            this.trigger('initPathDrawEditor')
            this.$el.hide();
            this.emit('finishPathEdit')
            this.emit('hideDrawManager');
            this.emit('change.mode.view');        
        }

    }


    getInnerId(postfix = '') {
        return 'draw-manager-' + postfix;
    }   
    

    get toFillSVG () {
        return SVGFill.parseImage(this.state.fill || 'transparent').toSVGString(this.fillId);
    }

    get toStrokeSVG () {
        return SVGFill.parseImage(this.state.stroke || 'black').toSVGString(this.strokeId);
    }  

    get toDefInnerString () {
        return /*html*/`
            ${this.toFillSVG}
            ${this.toStrokeSVG}
        `
    }
    
    get toDefString () {

        var str = this.toDefInnerString.trim();

        // if (!str) return ''; 

        return /*html*/`
            <defs>
            ${str}
            </defs>
        `
    }    

    get fillId () {
        return this.getInnerId('fill')
    }
    
    get strokeId () {
        return this.getInnerId('stroke')
    }

    get toFillValue () {
        return  SVGFill.parseImage(this.state.fill || 'transparent').toFillValue(this.fillId);
    }
    
    get toStrokeValue () {
        return  SVGFill.parseImage(this.state.stroke || 'black').toFillValue(this.strokeId);
    }      

    [BIND('$view')] () {

        return {
            innerHTML: /*html*/`
            <svg width="100%" height="100%" class='svg-editor-canvas'>
                ${this.toDefString}
                <path class='object' 
                    ${OBJECT_TO_PROPERTY({
                        fill: this.toFillValue,
                        stroke: this.toStrokeValue,
                        'fill-opacity': this.state['fill-opacity'],
                        'stroke-width': this.state['stroke-width'],
                        'stroke-linecap': this.state['stroke-linecap'],
                        'stroke-linejoin': this.state['stroke-linejoin'],
                    })}
                    d="${PathStringManager.makePathByPoints(this.state.points)}" />
            </svg>
            ` 
        }
    }

    renderPath () {
        this.bindData('$view');
    }

    [EVENT('resizeEditor')] () {
        this.initRect(true);
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

    move (dx, dy, eventType, pressure) {

        this.state.points.push({
            x: this.state.startXY.x + dx,
            y: this.state.startXY.y + dy,
            pressure
        })

        this.renderPath();
    }

    end (dx, dy) {
        this.addPathLayer(); 
        this.trigger('initPathDrawEditor') 
    }   

} 