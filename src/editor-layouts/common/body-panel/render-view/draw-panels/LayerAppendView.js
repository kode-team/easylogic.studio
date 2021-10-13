
import { POINTERSTART, BIND, KEYUP, IF, ESCAPE, ENTER, PREVENT, STOP, POINTERMOVE, CHANGE, SUBSCRIBE, KEYDOWN } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import PathStringManager from "el/editor/parser/PathStringManager";
import { rectToVerties, vertiesToRectangle } from "el/utils/collision";
import { vec3 } from "gl-matrix";
import Dom from "el/sapa/functions/Dom";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";
import "./LayerAppendView.scss";
import { CSS_TO_STRING } from "el/utils/func";
import PathParser from 'el/editor/parser/PathParser';

export default class LayerAppendView extends EditorElement {

    template() {
        return /*html*/`
        <div class='elf--layer-append-view'>
            <div class='area' ref='$area'></div>
            <div class='area-rect' ref='$areaRect'></div>
            <div class='area-pointer' ref='$mousePointer'></div>
            <div class='area-pointer-view' ref='$mousePointerView'></div>            
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
            color: 'black',
            fontSize: 30,
            showRectInfo: false,          
            areaVerties: rectToVerties(0, 0, 0, 0),
            content: 'Insert a text',
            pathManager: new PathStringManager(),
            rect: {},
            options: {},
            containerItem: undefined,
            patternInfo: {}
        }
    }

    get scale () {
        return this.$viewport.scale; 
    }  

    checkNotDragStart () {
        return Boolean(this.state.dragStart) === false;
    }
    
    [POINTERMOVE('$el') + IF('checkNotDragStart')] (e) {

        const vertex = this.$viewport.getWorldPosition(e);        

        // 영역 드래그 하면서 snap 하기 
        const newVertex = this.$snapManager.checkPoint(vertex);

        if (vec3.equals(newVertex, vertex) === false) {
            this.state.target = newVertex;
            this.state.targetVertex = this.$viewport.applyVertex(this.state.target);
            this.state.targetPositionVertex = vec3.clone(this.state.target);            
            this.state.targetGuides = this.$snapManager.findGuideOne([this.state.target]);
        } else {
            this.state.target = vec3.floor([], vertex); 
            this.state.targetVertex = vec3.floor([], this.$viewport.applyVertex(this.state.target));
            this.state.targetGuides = [];
            this.state.targetPositionVertex = null;
        }

        this.bindData('$mousePointer')
        this.bindData('$mousePointerView');
    }

    [POINTERSTART('$el') + MOVE() + END() + PREVENT + STOP] (e) {

        this.initMousePoint = this.state.targetPositionVertex ? this.state.targetPositionVertex : this.$viewport.getWorldPosition(e);

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
        const { type, text, color, inlineStyle } = this.state;

        switch(type) {
        case 'artboard':
            return /*html*/`<div class='draw-item' style='background-color: white; ${inlineStyle}'></div>`;
        case 'rect':
            return /*html*/`<div class='draw-item' style='background-color: ${color}; ${inlineStyle}'></div>`
        case 'circle':
            return /*html*/`<div class='draw-item' style='background-color: ${color}; border-radius: 100%; ${inlineStyle}'></div>`
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
                    <path d="${PathParser.makeRect(0, 0, width, height).d}" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `
        case 'svg-circle':
            return /*html*/`
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path d="${PathParser.makeCircle(0, 0, width, height).d}" stroke-width="1" stroke="black" fill="transparent" />
                </svg>
            </div>
            `
        case 'svg-path':
            const newD = this.state.d.clone().scale(width/this.state.bboxRect.width, height/this.state.bboxRect.height).d;
            const options = this.state.options;
            return /*html*/`
            <div class='draw-item'>
                <svg width="${width}" height="${height}" style="width:100%; height:100%;" overflow="visible">
                    <path   d="${newD}" 
                            stroke-width="${options['stroke-width'] || 1}" 
                            stroke="${options['stroke'] || "black"}" 
                            fill="${options['fill'] || 'transparent'}" 
                    />
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
            return /*html*/`<div class='draw-item' style='outline: 1px solid blue; ${inlineStyle}'></div>`        
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
            innerHTML: `x: ${Math.round(newVerties[0][0])}, y: ${Math.round(newVerties[0][1])}, ${width.value} x ${height.value}`
        }
    }

    [BIND('$mousePointerView')] () {

        const { areaVerties, showRectInfo} = this.state; 
        const {target = vec3.create(), targetVertex = vec3.create()} = this.state; 

        return {
            style: {
                display: !showRectInfo ? 'inline-block' : 'none',
                left: Length.px(targetVertex[0] || -10000),
                top: Length.px(targetVertex[1] || -10000),
            },
            innerHTML: `x: ${Math.round(target[0])}, y: ${Math.round(target[1])}`
        }
    }

    makeMousePointer () {

        if (this.state.dragStart) return '';

        const {target, targetVertex} = this.state; 

        if (!target) return '';

        const guides = (this.state.targetGuides || []).filter(Boolean);

        // if (guides.length === 0) return; 

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
        const targetMousePoint = this.$viewport.getWorldPosition();     
        const newMousePoint = this.$snapManager.checkPoint(targetMousePoint);

        if (vec3.equals(newMousePoint, targetMousePoint) === false) {
            this.state.target = newMousePoint;
            this.state.targetVertex = this.$viewport.applyVertex(newMousePoint);
            this.state.targetGuides = this.$snapManager.findGuideOne([newMousePoint]).filter(Boolean);
        } else {
            this.state.target = undefined; 
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
        this.bindData('$mousePointerView');

    }

    end (dx, dy) {
        const isAltKey = this.$config.get('bodyEvent').altKey;        
        let { color, content, fontSize, areaVerties, patternInfo} = this.state; 

        // viewport 좌표를 world 좌표로 변환 
        const rectVerties = this.$viewport.applyVertiesInverse(areaVerties);

        // artboard 가 아닐 때만 parentArtBoard 가 존재 
        const parentArtBoard = this.$selection.getArtboardByPoint(rectVerties[0]);

        let {x, y, width, height } = vertiesToRectangle(rectVerties);
        let hasArea = true; 
        if (width.value === 0 && height.value === 0) {

            switch(this.state.type) {
            case "text": 
                content = ''; 
                height.set(this.state.fontSize);
                hasArea = false; 
                break;
            default:
                width = Length.px(100)
                height = Length.px(100)
                break;
            }
        }

        var rect = { 
            x,  y, width,  height, 
            'background-color': color,
            'content': content,
            'font-size': fontSize,
            ...patternInfo.attrs,
            ...this.state.options
        }

        switch(this.state.type) {
        case 'text': 
        case 'svg-text':
        case 'svg-textpath': 
            delete rect['background-color']; 
            break;         
        case "svg-path":
            rect['d'] = this.state.d.clone().scale(width/this.state.bboxRect.width, height/this.state.bboxRect.height).d;
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
        this.state.target = undefined;
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
        this.state.inlineStyle = CSS_TO_STRING(this.$editor.html.toCSS(this.$model.createModel({
            itemType: type,
            ...options
        }, false), {
            top: true,
            left: true,
            width: true,
            height: true,
            transform: true,
            "transform-origin": true,
        }))

        if (options.d) {
            this.state.d = new PathParser(options.d);
            this.state.bboxRect = this.state.d.rect();
        }

        this.emit('push.mode.view', 'LayerAppendView');
    }

    [SUBSCRIBE('hideLayerAppendView')] () {

        if (this.$el.isShow()) {
            this.state.isShow = false;
            // this.refs.$area.empty()
            this.$el.hide();
            this.emit('pop.mode.view', 'LayerAppendView');
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

    [SUBSCRIBE('setPatternInfo')] (patternInfo) {
        this.state.patternInfo = patternInfo;
    }

    [SUBSCRIBE('updateViewport')] () {
        this.$snapManager.clear();       
        this.bindData('$mousePointer')
        this.bindData('$mousePointerView');
    }
} 