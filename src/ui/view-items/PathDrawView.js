import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, MOVE, END, BIND, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP} from "@core/Event";
import PathParser from "@parser/PathParser";

import { SVGPathItem } from "@items/layers/SVGPathItem";
import { Length } from "@unit/Length";
import PathStringManager from "@parser/PathStringManager";
import PathGenerator from "@parser/PathGenerator";
import Point from "@parser/Point";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";
import { SVGFill } from "@property-parser/SVGFill";
import { vec3 } from "gl-matrix";

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
            screenX: Length.z(),
            screenY: Length.z(),
            screenWidth: Length.z(),
            screenHeight: Length.z()
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


            // rect 기준으로 상대 좌표로 다시 변환 
            const simplyPoints = Point.simply(this.state.points, this.state.tolerance)
            const drawParser = new PathParser(PathStringManager.makePathByPoints(simplyPoints))
            const newPath = new PathParser(PathGenerator.generatorPathString(drawParser.convertGenerator()));

            newPath.transformMat4(this.$editor.matrixInverse);
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
                totalLength: this.totalPathLength
            }

            FIELDS.forEach(key => {
                if (this.state[key]) Object.assign(pathItem, {[key]: this.state[key] })    
            });            

            layer = artboard.appendChildItem(new SVGPathItem(pathItem));             
        }

        return layer; 
    }

    addPathLayer() {
        var pathRect = this.getPathRect()

        if (pathRect.width !==  0 && pathRect.height !== 0) {

            var layer = this.makePathLayer(pathRect)
            if (layer) {
                this.$selection.select(layer);
                this.trigger('hidePathDrawEditor')
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

    [EVENT('hideAddViewLayer')] () {   
        this.$el.hide();
        this.emit('hideDrawManager');        
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

        var pathRect = {x: Length.z(), y: Length.z(),  width: Length.z(), height: Length.z()}
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