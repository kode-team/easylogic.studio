import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, BIND, MOVE, END, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP, POINTERMOVE } from "@core/Event";
import Color from "@core/Color";
import { Length } from "@unit/Length";
import PathStringManager from "@parser/PathStringManager";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";
import { rectToVerties } from "@core/functions/collision";
import { vertiesMap } from "@core/functions/math";
import { vec3 } from "gl-matrix";

export default class LayerAppendView extends UIElement {

    template() {
        return /*html*/`
        <div class='layer-add-view'>
            <div class='area' ref='$area'></div>
            <div class='area-rect' ref='$areaRect'></div>
            <div class='area-pointer' ref='$mousePointer'></div>
        </div>
        `
    }

    initState() {
        return {
            dragStart: false, 
            dragXY: { x: -10000, y : 0},
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            color: Color.random(),
            fontSize: 30,
            showRectInfo: false, 
            content: 'Insert a text',
            pathManager: new PathStringManager()
        }
    }

    get scale () {
        return this.$viewport.scale; 
    }  

    checkNotDragStart () {
        return Boolean(this.state.dragStart) === false;
    }
    
    [POINTERMOVE('$el') + IF('checkNotDragStart')] (e) {
        const {x, y} = e.xy; 
        const containerRect = this.$el.rect();


        const vertext = [
            Math.floor(x - containerRect.x),
            Math.floor(y - containerRect.y),
            0
        ]

        // 영역 드래그 하면서 snap 하기 
        const verties = vertiesMap([vertext], this.$viewport.matrixInverse);
        const snap = this.$snapManager.check(verties);

        if (snap) {
            this.state.target = vec3.add([], vertext, snap);
            this.state.targetGuides = this.$snapManager.findGuide([this.state.target]);
        } else {
            this.state.target = null; 
            this.state.targetGuides = [];
        }

        this.bindData('$mousePointer')
    }

    [POINTERSTART('$el') + MOVE() + END()] (e) {

        const {x, y} = e.xy; 
        const containerRect = this.$el.rect();

        this.state.dragXY = this.state.target ? {
            x: this.state.target[0],
            y: this.state.target[1]
        } : {
            x: Math.floor(x - containerRect.x),
            y: Math.floor(y - containerRect.y),
        }; 

        this.state.dragStart = true;
        this.state.color = Color.random()
        this.state.text = 'Insert a text';
        this.state.x = this.state.dragXY.x;
        this.state.y = this.state.dragXY.y; 
        this.state.width = 0;
        this.state.height = 0; 

        this.bindData('$area');
        this.bindData('$areaRect');

    }

    createLayerTemplate () {
        const { type, text, color, width, height } = this.state;
        switch(type) {
        case 'artboard':
            return /*html*/`<div class='draw-item' style='background-color: white;'></div>`;
        case 'rect':
            return /*html*/`<div class='draw-item' style='background-color: ${color};border:1px solid black;'></div>`
        case 'circle':
            return /*html*/`<div class='draw-item' style='background-color: ${color}; border-radius: 100%;border:1px solid black;'></div>`
        case 'video':
        case 'audio':
        case 'image':            
        case 'cube':
        case 'cylinder':
            return /*html*/`<div class='draw-item' style='outline: 1px solid blue;'></div>`        
        case 'text':
        case 'svg-text':
            return /*html*/`<div class='draw-item' style='font-size: 30px;outline: 1px solid blue;'>${text}</div>`
        case 'svg-rect':
            return /*html*/`
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${PathStringManager.makeRect(0, 0, width, height)}" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `
        case 'svg-circle':
            return /*html*/`
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${PathStringManager.makeCircle(0, 0, width, height)}" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `
        case 'svg-textpath':
            return /*html*/`
            <div class='draw-item' style='outline: 1px solid blue;'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;font-size: ${height}px;" overflow="visible">
                    <defs>
                        <path id='layer-add-path' d="${PathStringManager.makeLine(0, height, width, height)}" />
                    </defs>
                    <text>
                        <textPath ${OBJECT_TO_PROPERTY({
                          'xlink:href' :`#layer-add-path`,
                          textLength: Length.percent(100),
                          lengthAdjust: 'spacingAndGlyphs',
                          startOffset: Length.em(0),
                        })} >${text}</textPath>
                    </text>
                </svg>
            </div>
            `            
        }
    }

    [BIND('$area')] () {
        return {
            style: {
                left: Length.px(this.state.x),
                top: Length.px(this.state.y),
                width: Length.px(this.state.width),
                height: Length.px(this.state.height)
            },
            innerHTML : this.createLayerTemplate()
        }
    }

    [BIND('$areaRect')] () {

        const { x, y, width, height, showRectInfo} = this.state; 

        return {
            style: {
                display: showRectInfo ? 'inline-block' : 'none',
                left: Length.px(x + width),
                top: Length.px(y + height),
            },
            innerHTML: `${width} x ${height}`
        }
    }

    makeMousePointer () {

        const target = this.state.target 

        if (!target) return '';

        const guides = this.state.targetGuides || []

        return /*html*/`
        <svg width="100%" height="100%">
            ${guides.map(guide => {
                this.state.pathManager.reset();

                return this.state.pathManager
                            .M({x: guide[0][0], y: guide[0][1]})                            
                            .L({x: guide[1][0], y: guide[1][1]})
                            .X({x: guide[0][0], y: guide[0][1]})
                            .X({x: guide[1][0], y: guide[1][1]})                            
                            .toString('layer-add-snap-pointer')
            }).join('\n')}
        </svg>
    `
    }

    [BIND('$mousePointer')] () {

        const html = this.makeMousePointer()
        
        if (html === '') return;

        return {
            innerHTML: html
        }
    }

    move (dx, dy) {
        const isShiftKey = this.$config.get('bodyEvent').shiftKey;

        if (isShiftKey) {
            dy = dx; 
        }

        // 영역 드래그 하면서 snap 하기 
        const verties = vertiesMap(rectToVerties(this.state.dragXY.x,this.state.dragXY.y, dx, dy), this.$viewport.matrixInverse);
        const snap = this.$snapManager.check(verties);

        dx += snap[0];
        dy += snap[1];

        var obj = {
            left: Length.px(this.state.dragXY.x + (dx < 0 ? dx : 0)),
            top: Length.px(this.state.dragXY.y + (dy < 0 ? dy : 0)),
            width: Length.px(Math.abs(dx)).floor(),
            height: Length.px(Math.abs(dy)).floor()
        }        

        this.state.x = obj.left.value;
        this.state.y = obj.top.value;
        this.state.width = obj.width.value;
        this.state.height = obj.height.value;
        this.state.showRectInfo = true; 


        this.bindData('$area');
        this.bindData('$areaRect'); 
    }

    end (dx, dy) {
        const isAltKey = this.$config.get('bodyEvent').altKey;        
        let { x, y, width, height, color, text, fontSize} = this.state; 


        const verties = vertiesMap(rectToVerties(x, y, width, height), this.$viewport.matrixInverse)

        x = Length.px(verties[0][0]).floor();
        y = Length.px(verties[0][1]).floor();
        width = Length.px(vec3.dist(verties[0], verties[1])).floor();
        height = Length.px(vec3.dist(verties[0], verties[3])).floor();

        var rect = { 
            x,  y, width,  height, 
            'background-color': color,
            'content': text,
            'font-size': fontSize,
        }

        switch(this.state.type) {
        case 'text': 
        case 'svg-text':
        case 'svg-textpath': 
            delete rect['background-color']; 
            break;         
        default: 
            delete rect['content']; 
            break; 
        }

        switch(this.state.type) {
        case 'image': this.emit('openImage', rect); break;
        case 'video': this.emit('openVideo', rect); break; 
        case 'audio': this.emit('openAudio', rect); break;             
        default: this.emit('newComponent', this.state.type, rect, /* isSelected */ true );break;
        }
        

        if (!isAltKey) {
            this.trigger('hideLayerAppendView')
        }

        this.state.dragStart = false;        
        this.state.showRectInfo = false; 
        this.state.target = null;
        this.bindData('$areaRect');         
    }    

    [EVENT('showLayerAppendView')] (type) {
        this.state.type = type; 

        this.state.isShow = true; 
        this.refs.$area.empty()
        this.$el.show();
        this.$el.focus();
        this.$snapManager.clear();        
        this.emit('change.mode.view', 'CanvasView');
    }

    [EVENT('hideLayerAppendView')] () {

        if (this.$el.isShow()) {
            this.state.isShow = false;
            // this.refs.$area.empty()
            this.$el.hide();
            this.emit('change.mode.view');               
        }

    }

    [EVENT('hideAddViewLayer')] () {
        this.state.isShow = false;
        this.$el.hide();
    }


    isShow () {
        return this.state.isShow
    }    

    [KEYUP('document') + IF('isShow') + ESCAPE + ENTER + PREVENT + STOP] () {
        this.trigger('hideLayerAppendView');        
    }    
} 