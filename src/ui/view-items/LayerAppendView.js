import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, BIND, MOVE, END, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP } from "@core/Event";
import Color from "@core/Color";
import { Length } from "@unit/Length";
import PathStringManager from "@parser/PathStringManager";
import { OBJECT_TO_PROPERTY } from "@core/functions/func";

export default class LayerAppendView extends UIElement {
    template() {
        return /*html*/`
        <div class='layer-add-view'>
            <div class='area' ref='$area'></div>
            <div class='area-rect' ref='$areaRect'></div>
        </div>
        `
    }

    initState() {
        return {
            dragXY: { x: -10000, y : 0},
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            color: Color.random(),
            fontSize: 30,
            showRectInfo: false, 
            content: 'Insert a text'
        }
    }

    get scale () {
        return this.$editor.scale; 
    }    

    [POINTERSTART('$el') + MOVE() + END()] (e) {

        const {x, y} = e.xy; 
        const containerRect = this.$el.rect();

        this.state.dragXY = {
            x: Math.floor(x - containerRect.x),
            y: Math.floor(y - containerRect.y),
        }; 

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
        case 'rect':
            return /*html*/`<div class='draw-item' style='background-color: ${color}'></div>`
        case 'circle':
            return /*html*/`<div class='draw-item' style='background-color: ${color}; border-radius: 100%;'></div>`
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
                    <path d="${PathStringManager.makeRect(0, 0, width, height)}" stroke-width="5" stroke="black" fill="transparent" />
                </svg>
            </div>
            `
        case 'svg-circle':
            return /*html*/`
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${PathStringManager.makeCircle(0, 0, width, height)}" stroke-width="5" stroke="black" fill="transparent" />
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
                left: Length.px(this.state.dragXY.x),
                top: Length.px(this.state.dragXY.y),
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

    move (dx, dy) {
        const isShiftKey = this.$config.get('bodyEvent').shiftKey;

        if (isShiftKey) {
            dy = dx; 
        }

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


        x = Length.px(x).div(this.scale).floor();
        y = Length.px(y).div(this.scale).floor();
        width = Length.px(width).div(this.scale).floor();
        height = Length.px(height).div(this.scale).floor();

        var rect = { 
            x,  y, width,  height, 
            x2: Length.px(x.value + width.value),
            y2: Length.px(y.value + height.value),
            'background-color': color,
            'content': text,
            'font-size': fontSize,
        }

        switch(this.state.type) {
        case 'text': 
        case 'svg-text':
        case 'svg-textpath': 

            if (rect.width.value === 0) rect.width.set(200);
            if (rect.height.value === 0) rect.height.set(50);

            rect.x2 = Length.px(rect.x.value + rect.width.value);
            rect.y2 = Length.px(rect.y.value + rect.height.value);
            
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
        default: this.emit('newComponent', this.state.type, rect, /* isSelected */ false );break;
        }
        

        if (!isAltKey) {
            this.trigger('hideLayerAppendView')
        }

        this.state.showRectInfo = false; 
        this.bindData('$areaRect');         
    }    

    [EVENT('showLayerAppendView')] (type) {
        this.state.type = type; 

        this.state.isShow = true; 
        this.refs.$area.empty()
        this.$el.show();
        this.$el.focus();
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