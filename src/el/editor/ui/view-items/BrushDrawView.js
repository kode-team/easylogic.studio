
import { POINTERSTART, MOVE, END, BIND, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP, SUBSCRIBE} from "el/sapa/Event";
import {PathParser} from 'el/editor/parser/PathParser';
import { Length } from "el/editor/unit/Length";
import PathStringManager from "el/editor/parser/PathStringManager";
import PathGenerator from "el/editor/parser/PathGenerator";
import Point from "el/editor/parser/Point";
import { SVGFill } from "el/editor/property-parser/SVGFill";
import { SVGBrushItem } from "@items/layers/SVGBrushItem";
import { registElement } from "el/sapa/functions/registElement";
import { EditorElement } from "../common/EditorElement";

import './BrushDrawView.scss';

const FIELDS = ['fill', 'stroke-width']

export default class BrushDrawView extends EditorElement {

    initialize() {
        super.initialize();

        this.pathParser = new PathParser();
    }

    initState() {
        return {
            changeEvent: 'updatePathItem', 
            points: [],
            $target: null, 
            fill: 'black',
            stroke: 'black',
            'fill-opacity': null,
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            tolerance: 1,
            screenX: 0,
            screenY: 0,
            screenWidth: 0,
            screenHeight: 0
        }
    }


    [SUBSCRIBE('changeDrawManager')] (obj) {
        this.setState({ ...obj }, false);
        this.renderPath()
    }


    get scale () {
        return this.$viewport.scale; 
    }

    template() {
        return /*html*/`
        <div class='elf--brush-draw-view' tabIndex="-1">
            <div class='brush-draw-container' ref='$view'></div>
        </div>`
    }

    initRect (isForce  = false) {
        if (!this.state.rect || isForce) {
            this.state.rect = this.parent.refs.$body.rect();
        }
    }

    [KEYUP('document') + IF('isShow') + ESCAPE + ENTER] () {
        this.trigger('hideBrushDrawEditor');        
    }

    [SUBSCRIBE("DrawEditorDone")] () {
        this.trigger("hideBrushDrawEditor");
    }


    get totalPathLength () {
        if (!this.refs.$view) return 0 
        var $obj = this.refs.$view.$('path.object');
        if (!$obj) return 0; 

        return $obj.totalLength
    }

    makeBrushLayer (pathRect) {
        var project = this.$selection.currentProject
        var layer; 
        if (project) {

            var x = pathRect.x / this.scale;
            var y = pathRect.y / this.scale;
            var width = pathRect.width / this.scale;
            var height = pathRect.height / this.scale; 

            // rect 기준으로 상대 좌표로 다시 변환 
            const simplyPoints = Point.simply(this.state.points, this.state.tolerance)
            const parser = new PathParser(PathStringManager.makePathByPoints(simplyPoints))
            const d = PathGenerator.generatorPathString(parser.convertGenerator(), x, y, this.scale);

            layer = project.add(new SVGBrushItem({
                width: width,
                height: height,
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

    addBrushLayer() {
        var pathRect = this.getPathRect()

        if (pathRect.width !==  0 && pathRect.height !== 0) {

            var layer = this.makeBrushLayer(pathRect)
            if (layer) {
                this.$selection.select(layer.id);
                this.emit('refreshAll')
                this.emit('refreshSelection');
            }
        }
        
    }

    changeMode (obj) {       
        this.setState({
            ...this.initState(),
            ...obj
        }, false)    

        this.emit('push.mode.view', 'PathDrawView');
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

    [SUBSCRIBE('showBrushDrawEditor')] (obj = {}) {

        this.changeMode(obj);

        this.$el.show();
        this.$el.focus();

        this.emit('showDrawManager', {
            fill: this.state.fill,
            stroke: this.state.stroke,
            'fill-opacity': this.state['fill-opacity'],
            'stroke-width': this.state['stroke-width'],
            'stroke-linecap': this.state['stroke-linecap'],
            'stroke-linejoin': this.state['stroke-linejoin'],            
        });        


    }

    [SUBSCRIBE('initBrushDrawEditor')] () {
        this.pathParser.reset('');
        this.refs.$view.empty()
    }

    [SUBSCRIBE('hideBrushDrawEditor')] () {
        this.trigger('initBrushDrawEditor')
        this.$el.hide();
        // this.emit('finishPathEdit')
        this.emit('hideDrawManager');
        this.emit('pop.mode.view', 'PathDrawView');        
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
                    fill="transparent"
                    stroke="${this.toFillValue === 'transparent' ? 'black' : this.toFillValue}"
                    d="${PathStringManager.makePathByPoints(this.state.points)}" />
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

        var pathRect = {x: 0, y: 0,  width: 0, height: 0}
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
        this.addBrushLayer(); 
        this.trigger('initBrushDrawEditor') 
    }   

} 

registElement({ BrushDrawView })