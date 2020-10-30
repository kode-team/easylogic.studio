import UIElement, { EVENT } from "@core/UIElement";
import { BIND, POINTERSTART, MOVE, END, IF, KEYUP, DROP, DRAGOVER, PREVENT, FOCUSIN, BLUR } from "@core/Event";
import { Length } from "@unit/Length";

import Dom from "@core/Dom";
import { DomItem } from "@items/DomItem";
import StyleView from "./StyleView";
import { computeVertextData } from "@core/functions/matrix";

import HTMLRenderer from '@renderer/HTMLRenderer';
import SelectionToolView from "@ui/view-items/SelectionToolView";
import GuideLineView from "@ui/view-items/GuideLineView";
import PathEditorView from "@ui/view-items/PathEditorView";
import PathDrawView from "@ui/view-items/PathDrawView";
import LayerAppendView from "@ui/view-items/LayerAppendView";
import GridLayoutLineView from "@ui/view-items/GridLayoutLineView";
import { isFunction } from "@core/functions/func";
import { rectToVerties } from "@core/functions/collision";


export default class HTMLRenderView extends UIElement {

    components() {
        return {
            StyleView,
            SelectionToolView,
            GuideLineView,
            PathEditorView,
            PathDrawView,
            LayerAppendView,
            GridLayoutLineView,
        }
    }

    initState() {
        return {
            mode: 'selection',
            left: Length.z(),
            top: Length.z(),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
            html: '',
        }
    }

    template() {
        return /*html*/`
            <div class='element-view' ref='$body'>
                <div class='canvas-view' ref='$view'></div>
                <div class='drag-area-rect' ref='$dragAreaRect'></div>
                <StyleView ref='$styleView' />
                <GuideLineView ref='$guideLineView' />
                <GridLayoutLineView ref='$gridLayoutLineView' />
                <SelectionToolView ref='$selectionTool' />
                <LayerAppendView ref='$objectAddView' />
                <PathEditorView ref='$pathEditorView' />
                <PathDrawView ref='$pathDrawView' />
            </div>
        `
    }

    getScrollXY () {
        return {
            width: this.refs.$body.scrollWidth(),
            height: this.refs.$body.scrollHeight(),
            left: this.refs.$body.scrollLeft(),
            top: this.refs.$body.scrollTop()
        }
    }

    [EVENT('afterChangeMode')] () {
        this.$el.attr('data-mode', this.$editor.mode);
    }

    [EVENT('refElement')] (id, callback) {
        isFunction(callback) && callback(this.getElement(id))
    }

    getElement (id) {

        if (!this.state.cachedCurrentElement[id]) {
            this.state.cachedCurrentElement[id] = this.refs.$view.$(`[data-id="${id}"]`);
        }

        return this.state.cachedCurrentElement[id];
    }

    checkEmptyElement (e) {
        var $el = Dom.create(e.target)

        if (this.state.mode !== 'selection') {
            return false; 
        }

        return ($el.hasClass('element-item') === false || $el.hasClass('artboard'))
            && $el.hasClass('selection-tool-item') === false 
            && $el.hasClass('pointer') === false
            && $el.hasClass('handle') === false            
            && $el.isTag('svg') === false 
            && $el.isTag('path') === false
            && $el.isTag('textPath') === false
            && $el.isTag('polygon') === false
            && $el.isTag('text') === false
            && $el.isTag('img') === false 
            && $el.attr('data-segment') !== 'true';
    }

    [POINTERSTART('$view') + IF('checkEmptyElement') + MOVE('movePointer') + END('moveEndPointer')] (e) {

        this.$target = Dom.create(e.target);

        this.dragXY = {x: e.xy.x, y: e.xy.y}; 

        this.rect = this.refs.$body.rect();            
        this.canvasOffset = this.refs.$view.rect();

        this.canvasPosition = {
            x: this.canvasOffset.left - this.rect.x,
            y: this.canvasOffset.top - this.rect.y
        }

        this.dragXY.x -= this.rect.x
        this.dragXY.y -= this.rect.y

        if (this.$editor.isSelectionMode()) {

            var obj = {
                left: Length.px(this.dragXY.x),
                top: Length.px(this.dragXY.y),
                width: Length.z(),
                height: Length.z()
            }        
    
            this.refs.$dragAreaRect.css(obj) 

            this.state.cachedCurrentElement = {}       
            this.$el.$$('.selected').forEach(it => it.removeClass('selected'))
        }

    }

    movePointer (dx, dy) {
        const isShiftKey = this.$config.get('bodyEvent').shiftKey;

        if (isShiftKey) {
            dy = dx; 
        }

        var obj = {
            left: Length.px(this.dragXY.x + (dx < 0 ? dx : 0)),
            top: Length.px(this.dragXY.y + (dy < 0 ? dy : 0)),
            width: Length.px(Math.abs(dx)),
            height: Length.px(Math.abs(dy))
        }        

        this.refs.$dragAreaRect.css(obj)

        if (this.$editor.isSelectionMode()) {

            var {left: x, top: y, width, height } = obj
            var rect = {
                x: (x.value -  this.canvasPosition.x) * this.$editor.scale, 
                y: (y.value - this.canvasPosition.y) * this.$editor.scale, 
                width: (width.value) * this.$editor.scale, 
                height: (height.value) * this.$editor.scale
            }
    
            var areaVerties = rectToVerties(rect.x, rect.y, rect.width, rect.height)        

            var artboard = this.$selection.currentArtboard;
            if (artboard) {    
                var items = artboard.checkInAreaForLayers(areaVerties);

                if (rect.width === 0 && rect.height === 0) {
                    items = [] 
                }                 
    
                if (this.$selection.select(...items)) {
                    this.selectCurrentForBackgroundView(...items)
                }

            }
        }
    }

    moveEndPointer (dx, dy) {
        var [x, y, width, height ] = this.refs.$dragAreaRect
                .styles('left', 'top', 'width', 'height')
                .map(it => Length.parse(it))

        var rect = {
            x: (x.value -  this.canvasPosition.x) * this.$editor.scale, 
            y: (y.value - this.canvasPosition.y) * this.$editor.scale, 
            width: (width.value) * this.$editor.scale, 
            height: (height.value) * this.$editor.scale
        }

        var areaVerties = rectToVerties(rect.x, rect.y, rect.width, rect.height)

        this.refs.$dragAreaRect.css({
            left: Length.px(-10000),
            top: Length.z(),
            width: Length.z(),
            height: Length.z()
        })


        if (this.$editor.isSelectionMode()) {

            var artboard = this.$selection.currentArtboard;
            var items = [] 
            if (artboard) {

                items = artboard.checkInAreaForLayers(areaVerties);

                console.log(items);

                if (rect.width === 0 && rect.height === 0) {
                    items = [] 
                }                 

                if (this.$selection.select(...items)) {
                    this.selectCurrentForBackgroundView(...items)
                }
    
                if (items.length) {
                    // this.emit('refreshSelection')
                } else {
                    this.$selection.select();
                    // this.emit('emptySelection')
                }                
            } else {
                this.$selection.select();                
                // this.emit('emptySelection')            
            }
            this.emit('history.refreshSelection')
        }

        this.sendHelpMessage();
        this.emit('removeGuideLine')
    }

    sendHelpMessage () {

        if (this.$selection.length === 1) {
            var current = this.$selection.current;

            if (current.is('svg-path', 'svg-brush', 'svg-polygon', 'svg-textpath')) {
                this.emit('addStatusBarMessage', 'Please click if you want to edit to path ');
            }

        } 

    }

    [FOCUSIN('$view .element-item.text')] (e) {
        e.$dt.css('height', 'auto');
    }

    [BLUR('$view .element-item.text')] (e) {
        e.$dt.css('height', undefined)
    }


    [KEYUP('$view .element-item.text')] (e) {
        var content = e.$dt.html()
        var text = e.$dt.text().trim()
        var id = e.$dt.attr('data-id');
        const rect = e.$dt.rect()

        var arr = [] 
        this.$selection.items.filter(it => it.id === id).forEach(it => {
            it.reset({ 
                content, 
                text,
                height: Length.px(rect.height)
            })
            arr.push({id:it.id, content, text})            
        })

        this.emit('refreshContent', arr);
        this.children.$selectionTool.initMoveType();

        this.emit('refreshSelectionTool');        
    }

    checkEditMode () {
        return this.$editor.isSelectionMode()
    }


    [POINTERSTART('$view .element-item') + IF('checkEditMode')  + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.$element = e.$dt;

        if (this.$element.hasClass('text')  || this.$element.hasClass('artboard') || this.$element.hasClass('selected')) {
            return false; 
        }

        var id = this.$element.attr('data-id')        

        if (e.shiftKey) {
            this.$selection.toggleById(id);
        } else {
            this.$selection.selectById(id);
        }

        this.selectCurrent(...this.$selection.items)
        this.children.$selectionTool.initMoveType();

        this.emit('history.refreshSelection');        
    }



    calculateMovedElement (dx, dy) {
        this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
        this.updateRealPosition();   
    }

    /**
     * item 의  Rectangle 을 업데이트 한다. 
     * 
     * @param {DomItem} item 
     */
    updateRealPositionByItem (item) {
        var {x, y, width, height} = item.toBound();
        var cachedItem = this.getElement(item.id)

        if (cachedItem) {
            cachedItem.cssText(`
                left: ${x};
                top:${y};
                width:${width};
                height:${height}; 
                transform: ${HTMLRenderer.toTransformCSS(item).transform};
            `)
        }
    }

    updateRealPosition() {
        this.$selection.each(item => {
            this.updateRealPositionByItem(item);
        })

        this.emit('refreshRect');        
    }
    [EVENT('refreshArtBoardName')] (id, title) {
        this.$el.$(`[data-id='${id}']`).attr('data-title', title);
    }

    calculateEndedElement (dx, dy) {

        if (dx === 0 && dy === 0) {
            if (this.$selection.current.isSVG()) {
                this.emit('openPathEditor');
                return; 
            }

        } else {           

            this.$selection.setRectCache();

            this.emit('removeGuideLine')      
    
            this.nextTick(() => {
                this.command(
                    'setAttributeForMulti',
                    "move item",                    
                    this.$selection.cloneValue('x', 'y', 'width', 'height')
                );  
            })
        }
    }

    [BIND('$body')] () {
        const { canvasWidth, canvasHeight, mode} = this.$editor;
        var width = Length.px(canvasWidth);
        var height = Length.px(canvasHeight);

        return {
            'data-mode': mode,
            style: { position: 'relative', width, height }
        }
    }

    selectCurrent (...args) {
        this.state.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }

        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);
            
            list.forEach(it => {
                this.state.cachedCurrentElement[it.attr('data-id')] = it; 
                it.addClass('selected')
            })
            
        } else {
            this.$selection.select(this.$selection.currentArtboard)
        }    

        this.emit('refreshSelectionTool')

    }


    selectCurrentForBackgroundView (...args) {
        this.state.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }

        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);
            
            list.forEach(it => {
                this.state.cachedCurrentElement[it.attr('data-id')] = it; 
                it.addClass('selected')
            })
            
        } else {
            // this.$selection.select()
        }
        this.emit('refreshSelection')           

        this.emit('refreshSelectionTool')

    }    

    modifyScale () {
        this.refs.$view.css({
            transform: `scale(${this.$editor.scale})`
        })

        this.emit('makeSelectionTool', true);
    }

    [EVENT('changeScale')] () {
       this.modifyScale();
    }

    // 객체를 부분 업데이트 하기 위한 메소드 
    [EVENT(
        'refreshCanvasForPartial', 
        'refreshSelectionStyleView', 
    )] (obj) {
        var items = obj ? [obj] : this.$selection.items;

        items.forEach(current => {
            this.updateElement(current);
        })
    }

    updateElement (item) {
        if (item) { 
            HTMLRenderer.update(item, this.getElement(item.id))
            this.updateRealPositionByItem(item);
        }

    }

    // 타임라인에서 객체를 업데이트 할 때 발생함. 
    updateTimelineElement (item) {
        if (item) {
            HTMLRenderer.update(item, this.getElement(item.id))
            this.updateRealPositionByItem(item);
        }

    }    

    [EVENT('playTimeline', 'moveTimeline')] () {

        var project = this.$selection.currentProject;

        var timeline = project.getSelectedTimeline();
        timeline.animations.map(it => project.searchById(it.id)).forEach(current => {
            this.updateTimelineElement(current, true, false);
        })
    }    

    [EVENT('refreshAllCanvas')] () {

        // 나중에 project 기반으로 바꿔야 함 
        var artboard = this.$selection.currentArtboard
        var html = HTMLRenderer.render(artboard) || '';

        this.setState({ html }, false)
        this.refs.$view.updateDiff(html)
    }

    [EVENT('refreshAllElementBoundSize')] () {

        var selectionList = this.$selection.items.map(it => it.is('artboard') ? it : it.parent)

        var list = [...new Set(selectionList)];
        list.forEach(it => {
            this.trigger('refreshElementBoundSize', it);
        })
    }

    [EVENT('refreshElementBoundSize')] (parentObj) {
        if (parentObj) {
            parentObj.layers.forEach(it => {
                if (it.isLayoutItem()) {
                    var $el = this.getElement(it.id);

                    if ($el) {
                        const {x, y, width, height} = $el.offsetRect();

                        // console.log(x, y, width, height, $el, it);

                        it.reset({
                            x: Length.px(x),
                            y: Length.px(y),
                            width: Length.px(width),
                            height: Length.px(height)
                        })
    
                        // if (it.is('component')) {
                        //     this.emit('refreshStyleView', it, true);
                        // }
    
                        // svg 객체  path, polygon 은  크기가 바뀌면 내부 path도 같이 scale up/down  이 되어야 하는데 
                        // 이건 어떻게 적용하나 ....                     
                        this.trigger('refreshSelectionStyleView', it, true);
                    }
                }

                this.trigger('refreshElementBoundSize', it);  
            })
        }
    }   

    [DRAGOVER('view') + PREVENT] () {}
    [DROP('$view') + PREVENT] (e) {

        const id = Dom.create(e.target).attr('data-id');

        if (id) {

            if (this.$selection.length) {
                this.emit('drop.asset', {
                    gradient: e.dataTransfer.getData('text/gradient'),
                    color: e.dataTransfer.getData('text/color'),
                    imageUrl: e.dataTransfer.getData('image/info')
                })
            } else {
                this.emit('drop.asset', {
                    gradient: e.dataTransfer.getData('text/gradient'),
                    color: e.dataTransfer.getData('text/color'),
                    imageUrl: e.dataTransfer.getData('image/info')
                }, id)
            }


        } else {
            const imageUrl = e.dataTransfer.getData('image/info')
            this.emit('dropImageUrl', imageUrl)
        }

    }
}