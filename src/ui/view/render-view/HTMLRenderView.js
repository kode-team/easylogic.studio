import UIElement, { EVENT } from "@core/UIElement";
import { BIND, POINTERSTART, MOVE, END, IF, KEYUP, DROP, DRAGOVER, PREVENT, FOCUSIN, BLUR } from "@core/Event";
import { Length } from "@unit/Length";

import Dom from "@core/Dom";
import { DomItem } from "@items/DomItem";
import StyleView from "./StyleView";

import HTMLRenderer from '@renderer/HTMLRenderer';
import SelectionToolView from "@ui/view-items/SelectionToolView";
import GroupSelectionToolView from "@ui/view-items/GroupSelectionToolView";
import GuideLineView from "@ui/view-items/GuideLineView";
import PathEditorView from "@ui/view-items/PathEditorView";
import PathDrawView from "@ui/view-items/PathDrawView";
import LayerAppendView from "@ui/view-items/LayerAppendView";
import GridLayoutLineView from "@ui/view-items/GridLayoutLineView";
import { isFunction } from "@core/functions/func";
import { rectToVerties } from "@core/functions/collision";
import { vertiesMap } from "@core/functions/math";
import { vec3 } from "gl-matrix";


export default class HTMLRenderView extends UIElement {

    components() {
        return {
            StyleView,
            SelectionToolView,
            GroupSelectionToolView,
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
                <GroupSelectionToolView ref='$groupSelectionTool' />
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

    get selectionToolView () {
        return this.$selection.isOne ? this.children.$selectionTool : this.children.$groupSelectionTool;
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

        // artboard 에서 드래그 할 수 있도록 예외 처리 
        if ($el.hasClass('artboard')) {
            return true; 
        }

        return $el.hasClass('element-item') === false
            && $el.hasClass('artboard-title') === false 
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


            // 클릭하는 시점에  item 인스턴스와 , verties() 를 초기화 한다. 
            // 그 이후에 조회 하는 객체에 대해서 verties() 를 맞춘다. 
            // 드래그가 끝날 때까지 쓴다. 
            // this.$selection.currentProject.initCacheVerties();

        }

    }

    getSelectedItems (rect, areaVerties) {

        var project = this.$selection.currentProject;
        let items = []
        let selectedArtboard = []        
        if (project) {    

            if (rect.width === 0 && rect.height === 0) {
                items = [] 
            } else {
                // 프로젝트 내에 있는 모든 객체 검색 

                project.layers.forEach(layer => {

                    if (layer.is('artboard') && layer.isIncludeByArea(areaVerties)) {        
                        selectedArtboard.push(layer);
                    } else if (layer.is('artboard') && layer.checkInArea(areaVerties)) {        
                        items.push(layer);                            
                    } else {
                        items.push(...layer.checkInAreaForAll(areaVerties))
                    }
                })

                if (items.length > 1) {
                    items = items.filter(it => it.is('artboard') === false);
                }
            }   
        }
        const selectedItems = selectedArtboard.length ? selectedArtboard : items; 

        return selectedItems;
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
                x: x.value -  this.canvasPosition.x, 
                y: y.value - this.canvasPosition.y, 
                width: width.value,
                height: height.value
            }
    
            var areaVerties = vertiesMap(rectToVerties(rect.x, rect.y, rect.width, rect.height), this.$editor.matrixInverse);

            var project = this.$selection.currentProject;
            if (project) {    
                const selectedItems = this.getSelectedItems(rect, areaVerties)

                if (this.$selection.select( ...selectedItems)) {
                    this.selectCurrent(...selectedItems)
                }

                this.emit('refreshSelectionTool', true);

            }
        }
    }

    moveEndPointer (dx, dy) {

        var [x, y, width, height ] = this.refs.$dragAreaRect
                .styles('left', 'top', 'width', 'height')
                .map(it => Length.parse(it))

        var rect = {
            x: (x.value -  this.canvasPosition.x), 
            y: (y.value - this.canvasPosition.y), 
            width: width.value, 
            height: height.value
        }

        var areaVerties = vertiesMap(rectToVerties(rect.x, rect.y, rect.width, rect.height), this.$editor.matrixInverse);

        this.refs.$dragAreaRect.css({
            left: Length.px(-10000),
            top: Length.z(),
            width: Length.z(),
            height: Length.z()
        })

        var project = this.$selection.currentProject;
        if (project) {
    
            const selectedItems = this.getSelectedItems(rect, areaVerties)

            if (this.$selection.select(...selectedItems)) {
                this.selectCurrent(...selectedItems)
            }

        } else {
            this.$selection.select();
        }
        this.emit('history.refreshSelection')
        this.emit('refreshSelectionTool', true);            


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

        this.emit('refreshSelectionTool', false);        
    }

    checkEditMode () {
        return this.$editor.isSelectionMode()
    }

    findArtBoard (point) {
        return this.$selection.currentProject.artboards.find(artboard => artboard.hasPoint(point.x, point.y))
    }

    [POINTERSTART('$view .element-item') + IF('checkEditMode')  + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.$element = e.$dt;
        this.$target = Dom.create(e.target);
        this.rect = this.refs.$body.rect();               

        // text, artboard 는 선택하지 않음. 
        if (this.$element.hasClass('text')) {
            return false; 
        }

        if (this.$element.hasClass('artboard') && this.$target.hasClass('artboard-title') === false) {
            return false; 
        }        

        var id = this.$element.attr('data-id')    

        // artboard title 인 경우는 artboard 를 선택한다.         
        if (Dom.create(e.target).hasClass('artboard-title')) {      
            this.$selection.selectById(id);
        } else {
            // shift key 는 selection 을 토글한다. 
            if (e.shiftKey) {
                this.$selection.toggleById(id);
            } else {
                if (this.$selection.check({ id })) {    // 이미 선택되어 있으면 선택하지 않음. 
                    // NOOP
                } else {
                    this.$selection.selectById(id);
                }
            }
        }

        this.selectCurrent(...this.$selection.items)
        this.initializeDragSelection();
        this.emit('history.refreshSelection');        
    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();

        this.emit('refreshSelectionTool');
    }


    calculateMovedElement (dx, dy) {
        this.selectionToolView.refreshSelectionToolView(dx, dy, 'move');        

        this.emit('refreshSelectionStyleView');
        this.emit('refreshSelectionTool', false);        
    }

    /**
     * item 의  Rectangle 을 업데이트 한다. 
     * 
     * @deprecated
     * @param {DomItem} item 
     */
    // updateRealPositionByItem (item) {
    //     return;
    //     var {x, y, width, height} = item.toBound();
    //     var cachedItem = this.getElement(item.id)

    //     if (cachedItem) {
    //         cachedItem.cssText(`
    //             left: ${x};
    //             top:${y};
    //             width:${width};
    //             height:${height}; 
    //             transform: ${HTMLRenderer.toTransformCSS(item).transform};
    //         `)
    //     }
    // // }

    // updateRealPosition() {
    //     // this.$selection.each(item => {
    //     //     this.updateRealPositionByItem(item);
    //     // })

    //     this.emit('refreshRect');        
    // }

    /**
     * ArtBoard title 변경하기 
     * @param {string} id 
     * @param {string} title 
     */
    [EVENT('refreshArtBoardName')] (id, title) {
        this.$el.$(`[data-id='${id}'] > .artboard-title`).html(title);
    }

    calculateEndedElement (dx, dy) {

        if (dx === 0 && dy === 0) {
            if (this.$selection.current.isSVG()) {
                this.emit('openPathEditor');
                return; 
            }
        } else {              
            this.emit('removeGuideLine');

            // 최종 위치에서 ArtBoard 변경하기 
            this.$selection.changeArtBoard();
            // ArtBoard 변경 이후에 LayerTreeView 업데이트
            this.emit('refreshLayerTreeView')            

            // 로컬 html 업데이트 
            this.trigger('refreshAllCanvas');
            this.$selection.reselect(); 
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
        }    
    }

    modifyScale () {
        this.refs.$view.css({
            transform: `scale(${this.$editor.scale})`
        })

        this.emit('refreshSelectionTool', false);
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
            // this.updateRealPositionByItem(item);
        }

    }

    // 타임라인에서 객체를 업데이트 할 때 발생함. 
    updateTimelineElement (item) {
        if (item) {
            HTMLRenderer.update(item, this.getElement(item.id))
            // this.updateRealPositionByItem(item);
        }

    }    

    [EVENT('playTimeline', 'moveTimeline')] (artboard) {

        var timeline = artboard.getSelectedTimeline();
        timeline.animations.map(it => project.searchById(it.id)).forEach(current => {
            this.updateTimelineElement(current, true, false);
        })
    }    

    /**
     * canvas 전체 다시 그리기 
     */
    [EVENT('refreshAllCanvas')] () {

        const project = this.$selection.currentProject
        const html = HTMLRenderer.render(project) || '';

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