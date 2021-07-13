
import { POINTERSTART, BIND, MOVE, END, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP, POINTERMOVE, CHANGE, SUBSCRIBE, KEYDOWN } from "el/base/Event";
import Color from "el/base/Color";
import { Length } from "el/editor/unit/Length";
import PathStringManager from "el/editor/parser/PathStringManager";
import { rectToVerties, vertiesToRectangle } from "el/base/functions/collision";
import { vec3 } from "gl-matrix";
import Dom from "el/base/Dom";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import "./LayerAppendView.scss";

export default class LayerAppendView extends EditorElement {

    template() {
        return /*html*/`
        <div class='elf-layer-append-view'>
            <div class='area' ref='$area'></div>
            <div class='area-rect' ref='$areaRect'></div>
            <div class='area-pointer' ref='$mousePointer'></div>
            <input type='file' accept='image/*' multiple="true" ref='$file' class='embed-file-input'/>
            <input type='file' accept='video/*' multiple="true" ref='$video' class='embed-video-input'/>            
        </div>
        `
    }

    initState() {
        return {
            dragStart: false, 
            width: 0,
            height: 0,
            color: Color.random(),
            fontSize: 30,
            showRectInfo: false,          
            areaVerties: rectToVerties(0, 0, 0, 0),
            content: 'Insert a text',
            pathManager: new PathStringManager(),
            rect: {},
            options: {},
            containerItem: undefined
        }
    }

    get scale () {
        return this.$viewport.scale; 
    }  

    checkNotDragStart () {
        return Boolean(this.state.dragStart) === false;
    }
    
    [POINTERMOVE('$el') + IF('checkNotDragStart')] (e) {

        const vertex = this.$viewport.createWorldPosition(e.clientX, e.clientY);        

        // 영역 드래그 하면서 snap 하기 
        const newVertex = this.$snapManager.checkPoint(vertex);

        if (vec3.equals(newVertex, vertex) === false) {
            this.state.target = newVertex;
            this.state.targetVertex = this.$viewport.applyVertex(this.state.target);
            this.state.targetPositionVertext = vec3.clone(this.state.target);            
            this.state.targetGuides = this.$snapManager.findGuideOne([this.state.target]);
        } else {
            this.state.target = null; 
            this.state.targetGuides = [];
            this.state.targetPositionVertext = null;
        }

        this.bindData('$mousePointer')
    }

    [POINTERSTART('$el') + MOVE() + END()] (e) {

        this.initMousePoint = this.state.targetPositionVertext ? this.state.targetPositionVertext : this.$viewport.createWorldPosition(e.clientX, e.clientY);

        this.state.dragStart = true;
        this.state.color = '#C4C4C4'; //Color.random()
        this.state.text = '';

        const minX = this.initMousePoint[0];
        const minY = this.initMousePoint[1];      

        const verties = rectToVerties(minX, minY, 0, 0);                
        this.state.areaVerties = this.$viewport.applyVerties(verties);        

        this.bindData('$area');
        this.bindData('$areaRect');

    }

    createLayerTemplate (width, height) {
        const { type, text, color } = this.state;
        switch(type) {
        case 'artboard':
            return /*html*/`<div class='draw-item' style='background-color: white;'></div>`;
        case 'rect':
            return /*html*/`<div class='draw-item' style='background-color: ${color};'></div>`
        case 'circle':
            return /*html*/`<div class='draw-item' style='background-color: ${color}; border-radius: 100%;'></div>`
        case 'text':
        case 'svg-text':
            return /*html*/`
                <div 
                    class='draw-item' 
                    
                    style='font-size: 30px;outline: 1px solid blue;white-space:nowrap'
                >
                    <p contenteditable="true" style="margin:0px;display: inline-block;outline:none;" ></p>
                </div>`
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
                        <textPath 
                          xlink:href="#layer-add-path"
                          textLength="100%"
                          lengthAdjust="spacingAndGlyphs"
                          startOffset="0em"
                        >${text}</textPath>
                    </text>
                </svg>
            </div>
            `      
        default:
            return /*html*/`<div class='draw-item' style='outline: 1px solid blue;'></div>`        
        }
    }

    [BIND('$area')] () {

        const { areaVerties } = this.state;

        const {left, top, width, height } = vertiesToRectangle(areaVerties);

        return {
            style: { left, top, width, height },
            innerHTML : this.createLayerTemplate(width.value, height.value)
        }
    }

    [BIND('$areaRect')] () {

        const { areaVerties, showRectInfo} = this.state; 

        const newVerties = this.$viewport.applyVertiesInverse(areaVerties);

        const {width, height } = vertiesToRectangle(newVerties);

        return {
            style: {
                display: showRectInfo ? 'inline-block' : 'none',
                left: Length.px(areaVerties[2][0]),
                top: Length.px(areaVerties[2][1]),
            },
            innerHTML: `${width.value} x ${height.value}`
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

                guide = this.$viewport.applyVerties([ guide[0], guide[1] ])

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
        
        // if (html === '') return;

        return {
            innerHTML: html
        }
    }

    move () {
        const e = this.$config.get('bodyEvent');
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);     
        const newMousePoint = this.$snapManager.checkPoint(targetMousePoint);

        if (vec3.equals(newMousePoint, targetMousePoint) === false) {
            this.state.target = newMousePoint;
            this.state.targetVertex = this.$viewport.applyVertex(newMousePoint);
            this.state.targetGuides = this.$snapManager.findGuideOne([newMousePoint]);
        } else {
            this.state.target = null; 
            this.state.targetGuides = [];
        }

        const isShiftKey = e.shiftKey;

        const minX = Math.min(newMousePoint[0], this.initMousePoint[0]);
        const minY = Math.min(newMousePoint[1], this.initMousePoint[1]);

        const maxX = Math.max(newMousePoint[0], this.initMousePoint[0]);
        const maxY = Math.max(newMousePoint[1], this.initMousePoint[1]);        
        
        let dx = maxX - minX;
        let dy = maxY - minY; 

        if (isShiftKey) {
            dy = dx; 
        }

        // 영역 드래그 하면서 snap 하기 
        const verties = rectToVerties(minX, minY, dx, dy);                
        this.state.areaVerties = this.$viewport.applyVerties(verties);

        this.state.showRectInfo = true; 


        this.bindData('$area');
        this.bindData('$areaRect'); 
        this.bindData('$mousePointer')

    }

    end (dx, dy) {
        const isAltKey = this.$config.get('bodyEvent').altKey;        
        let { color, content, fontSize, areaVerties} = this.state; 

        // viewport 좌표를 world 좌표로 변환 
        const rectVerties = this.$viewport.applyVertiesInverse(areaVerties);

        // artboard 가 아닐 때만 parentArtBoard 가 존재 
        const parentArtBoard = this.$selection.getArtboardByPoint(rectVerties[0]);

        const {x, y, width, height } = vertiesToRectangle(rectVerties);
        let hasArea = true; 
        if (width.value === 0 && height.value === 0) {

            switch(this.state.type) {
            case "text": 
                content = ''; 
                height.set(this.state.fontSize);
                hasArea = false; 
                break;
            default:
                width.set(100);
                height.set(100);
                break;
            }
        }

        var rect = { 
            x,  y, width,  height, 
            'background-color': color,
            'content': content,
            'font-size': fontSize,
            ...this.state.options
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
        case 'image': this.trigger('openImage', rect, parentArtBoard); break;
        case 'video': this.trigger('openVideo', rect, parentArtBoard); break; 
        case 'audio': this.trigger('openAudio', rect, parentArtBoard); break;    
        case 'text':  

            if (hasArea) {
                // NOOP
                // newComponent 를 그대로 실행한다. 
                rect['font-size'] = Length.px(this.state.fontSize / this.$viewport.scale);
            } else {
                const scaledFontSize = this.state.fontSize / this.$viewport.scale;
                const $drawItem = this.refs.$area.$(".draw-item > p");
                $drawItem.parent().css('height', `${scaledFontSize}px`);            
                $drawItem.parent().css('font-size', `${scaledFontSize}px`);                        
                $drawItem.select();
                $drawItem.focus();
                return;        
            }

        default: this.emit('newComponent', this.state.type, rect, /* isSelected */ true, parentArtBoard );break;
        }
        

        if (!isAltKey) {
            this.trigger('hideLayerAppendView')
        }

        this.state.dragStart = false;        
        this.state.showRectInfo = false; 
        this.state.target = null;
        this.bindData('$areaRect');         
    }    

    [SUBSCRIBE('showLayerAppendView')] (type, options = {}) {
        this.state.type = type; 
        this.state.options = options; 
        this.state.isShow = true; 
        this.refs.$area.empty()
        this.$el.show();
        this.$el.focus();
        this.$snapManager.clear();        
        this.emit('change.mode.view', 'CanvasView');
    }

    [SUBSCRIBE('hideLayerAppendView')] () {

        if (this.$el.isShow()) {
            this.state.isShow = false;
            // this.refs.$area.empty()
            this.$el.hide();
            this.emit('change.mode.view');               
        }

    }

    [SUBSCRIBE('hideAddViewLayer')] () {
        this.state.isShow = false;
        this.$el.hide();
    }


    isShow () {
        return this.state.isShow
    }    

    [KEYDOWN('document') + IF('isShow') + ESCAPE + ENTER + PREVENT + STOP] (e) { 
        // NOOP
    }
    [KEYUP('document') + IF('isShow') + ESCAPE + ENTER + PREVENT + STOP] (e) { 

        switch(this.state.type) {
        case "text":
            const $t = Dom.create(e.target);

            let { fontSize, areaVerties} = this.state; 

            // viewport 좌표를 world 좌표로 변환 
            const rectVerties = this.$viewport.applyVertiesInverse(areaVerties);
            const {x, y } = vertiesToRectangle(rectVerties);
            const {width, height} = $t.rect();
            const text = $t.text();

            console.log(text, height);

            if (text.length === 0) {
                break; 
            }

            const [
                [newWidth, newHeight, newFontSize]
            ] = this.$viewport.applyScaleVertiesInverse([
                [width, height, fontSize]
            ])


            const rect = {
                x, 
                y, 
                width: Length.px(newWidth), 
                height: Length.px(newHeight),
                'content': text.trim(),
                'font-size': Length.px(newFontSize),
            }
            
            // artboard 가 아닐 때만 parentArtBoard 가 존재 
            const parentArtBoard = this.$selection.getArtboardByPoint(rectVerties[0]);        

            this.emit('newComponent', this.state.type, rect, /* isSelected */ true, parentArtBoard );
            break;
        }


        this.state.dragStart = false;        
        this.state.showRectInfo = false; 
        this.state.target = null;
        this.bindData('$areaRect');            
        this.trigger('hideLayerAppendView')
    }    

    [KEYUP('$el') + IF('isShow')] (e) { 
        switch(this.state.type) {
        case "text":
            const $t = Dom.create(e.target);
            const {width, height} = $t.rect();


            break; 
        }
    }        

    [CHANGE('$file')] (e) {
        this.refs.$file.files.forEach(item => {
          this.emit('updateImage', item, this.state.rect, this.state.containerItem);
        })
    }
    [CHANGE('$video')] (e) {
        this.refs.$video.files.forEach(item => {
          this.emit('updateVideo', item, this.state.rect, this.state.containerItem);
        })
    }    

    [SUBSCRIBE('openImage')] (rect, containerItem) {
        this.state.rect = rect; 
        this.state.containerItem = containerItem;
        this.refs.$file.click();
    }

    [SUBSCRIBE('openVideo')] (rect, containerItem) {
        this.state.rect = rect; 
        this.state.containerItem = containerItem;        
        this.refs.$video.click();
    }        
} 