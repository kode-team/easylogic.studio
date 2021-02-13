import UIElement, { EVENT } from "@core/UIElement";
import { BIND, POINTERSTART, MOVE, END, IF, KEYUP, DOUBLECLICK, FOCUSOUT } from "@core/Event";
import { Length } from "@unit/Length";

import Dom from "@core/Dom";
import StyleView from "./StyleView";

import HTMLRenderer from '@renderer/HTMLRenderer';
import SelectionToolView from "@ui/view-items/SelectionToolView";
import GroupSelectionToolView from "@ui/view-items/GroupSelectionToolView";
import GuideLineView from "@ui/view-items/GuideLineView";
import PathEditorView from "@ui/view-items/PathEditorView";
import PathDrawView from "@ui/view-items/PathDrawView";
import LayerAppendView from "@ui/view-items/LayerAppendView";
import GridLayoutLineView from "@ui/view-items/GridLayoutLineView";
import HoverView from "@ui/view-items/HoverView";

import { isFunction } from "@core/functions/func";
import { KEY_CODE } from "@types/key";
import { vec3 } from "gl-matrix";


export default class HTMLRenderView extends UIElement {

    components() {
        return {
            StyleView,
            HoverView,
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
            x: Length.z(),
            y: Length.z(),
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
                <HoverView ref='$hoverView' />                
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
        return this.$selection.isMany ? this.children.$groupSelectionTool : this.children.$selectionTool;
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

        const mousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);        
        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {        // space 키가 눌러져있을 때는 실행하지 않는다. 
            return false;
        } 

        if (this.state.mode !== 'selection') {
            return false; 
        }

        // altKey 를 누르고 있으면 동작하지 않음 
        // altKey 는 복제용도로 사용함 
        if (e.altKey) {
            return false; 
        }

        // artboard 에서 드래그 할 수 있도록 예외 처리 
        if ($el.hasClass('artboard')) {
            if (this.$selection.check({ id: $el.attr('data-id') })) {
                // selection 이 이미 되어 있는 상태면 선택 영역을 그리지 않는다. 
                return false; 
            }

            // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
            if (this.$selection.hasPoint(mousePoint)) {
                return false;
            }            

            return true; 
        }


        // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
        if (this.$selection.hasPoint(mousePoint)) {
            return false;
        }            


        return $el.hasClass('element-item') === false
            && $el.hasClass('artboard-title') === false 
            && $el.hasClass('selection-tool-item') === false 
            && $el.hasClass('pointer') === false
            && $el.hasClass('rotate-pointer') === false            
            && $el.hasClass('layer-add-view') === false                        
            && $el.hasClass('handle') === false            
            && $el.hasClass('path-draw-container') === false
            && $el.isTag('svg') === false 
            && $el.isTag('path') === false
            && $el.isTag('textPath') === false
            && $el.isTag('polygon') === false
            && $el.isTag('text') === false
            && $el.isTag('img') === false 
            && $el.attr('data-segment') !== 'true';
    }

    [POINTERSTART('$body') + IF('checkEmptyElement') + MOVE('movePointer') + END('moveEndPointer')] (e) {
        this.$target = Dom.create(e.target);

        this.dragXY =  {x: e.xy.x, y: e.xy.y}; 

        this.rect = this.refs.$body.rect();            
        this.canvasOffset = this.refs.$view.rect();

        this.canvasPosition = {
            x: this.canvasOffset.left,
            y: this.canvasOffset.top
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
            // this.$el.$$('.selected').forEach(it => it.removeClass('selected'))


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
                    } else if (layer.is('artboard') && layer.checkInArea(areaVerties) && layer.hasChildren() === false) {        
                        items.push(layer);                            
                    } else {
                        items.push.apply(items, layer.checkInAreaForAll(areaVerties))
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
                x: x.value, 
                y: y.value, 
                width: width.value,
                height: height.value
            }
    
            var areaVerties = this.$viewport.createAreaVerties(rect.x, rect.y, rect.width, rect.height);

            var project = this.$selection.currentProject;
            if (project) {    
                const selectedItems = this.getSelectedItems(rect, areaVerties)

                if (this.$selection.select( ...selectedItems)) {
                    this.selectCurrent(...selectedItems);
                    this.emit('refreshSelectionTool', true);
                }


            }
        }
    }

    moveEndPointer (dx, dy) {

        var [x, y, width, height ] = this.refs.$dragAreaRect
                .styles('left', 'top', 'width', 'height')
                .map(it => Length.parse(it))

        var rect = {
            x: x.value, 
            y: y.value, 
            width: width.value, 
            height: height.value
        }

        var areaVerties = this.$viewport.createAreaVerties(rect.x, rect.y, rect.width, rect.height);

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

    // text 의 경우 doubleclick 을 해야 포커스를 줄 수 있고 
    // 그 이후에 편집이 가능하다. 
    [DOUBLECLICK('$view .element-item.text')] (e) {
        e.$dt.addClass('focused');
        e.$dt.attr('contenteditable', 'true');
        e.$dt.focus();
        e.$dt.select();
    }

    [FOCUSOUT('$view .element-item.text')] (e) {
        e.$dt.removeAttr('contenteditable');
        e.$dt.removeClass('focused');
    }

    [KEYUP('$view .element-item.text')] (e) {
        var content = e.$dt.html()
        var text = e.$dt.text();
        var id = e.$dt.attr('data-id');
        //FIXME: matrix에 기반한 좌표 연산이 필요하다. 

        var arr = [] 
        this.$selection.items.filter(it => it.id === id).forEach(it => {
            it.reset({ 
                content, 
                text,
            })
            arr.push({id:it.id, content, text})            
        })

        this.emit('refreshContent', arr);

        this.emit('refreshSelectionTool', false);        
    }

    /**
     * 레이어를 움직이기 위한 이벤트 실행 여부 체크 
     * 
     * @param {PointerEvent} e 
     */
    checkEditMode (e) {
        const mousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        if (this.$selection.hasPoint(mousePoint)) {
            return true;            
        }

        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {        // space 키가 눌러져있을 때는 실행하지 않는다. 
            return false;
        }

        const $target = Dom.create(e.target);
        const $element = $target.closest('element-item');

        if ($element) {
            // text 에 focus 가 가있는 경우는 움직이지 않는다. 
            if ($element.hasClass('focused')) {
                return false; 
            }

            var id = $element.attr('data-id')            

            // altKey 눌러서 copy 하지 않고 드랙그만 하게 되면  
            if (e.altKey === false) {
                if ($element.hasClass('artboard')) {
                    const artboard = this.$selection.currentProject.searchById(id);
        
                    if (artboard && artboard.hasChildren() && $target.hasClass('artboard-title') === false) {
                        return false; 
                    }
                }        
        
            }

        } else {
            // 움직일 수 있는 영역이 아니기 때문에 false 리턴해서 드래그를 막는다. 
            return false; 
        }


        return this.$editor.isSelectionMode()
    }

    /**
     * 드래그 해서 객체 옮기기 
     *
     * ctrl + pointerstart 하는  시점에 카피해보자.  
     * 
     * @param {PointerEvent} e 
     */
    [POINTERSTART('$view') + IF('checkEditMode')  + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.initMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);
        let isInSelectedArea = this.$selection.hasPoint(this.initMousePoint)
        const $target = Dom.create(e.target);
        const $element = $target.closest('element-item');

        var id = $element && $element.attr('data-id');

        // 선택한 영역이 있지만 artboard 가 아닌 경우 객체 선택으로 한다. 
        if (isInSelectedArea && $element && $element.hasClass('artboard') === false) {
            isInSelectedArea = false; 
        }

        // alt(option) + pointerstart 시점에 Layer 카피하기         
        if (e.altKey) {


            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {
                // artboard-title 을 선택하고 드래그 할 때 artboard 전체를 copy 한다. 
                if ($target.hasClass('artboard-title')) {      
                    this.$selection.selectById(id);
                } else {
                    if (this.$selection.check({ id }) === false) { 
                        // 선택된게 없으면 id 로 선택 
                        this.$selection.selectById(id);
                    }
                }
            }
            
            if (this.$selection.isEmpty === false) {
                // 선택된 모든 객체 카피하기 
                this.$selection.selectAfterCopy();
                this.trigger('refreshAllCanvas')         
                this.emit('refreshLayerTreeView')         

                this.selectCurrent(...this.$selection.items)
                this.initializeDragSelection();
                this.emit('history.refreshSelection');         
            }

        } else {

            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {

                // artboard title 인 경우는 artboard 를 선택한다.         
                if ($target.hasClass('artboard-title')) {      
                    this.$selection.selectById(id);
                } else {
                    // shift key 는 selection 을 토글한다. 
                    if (e.shiftKey) {
                        this.$selection.toggleById(id);
                    } else {
                        // 선택이 안되어 있으면 선택 
                        if (this.$selection.check({ id }) === false) { 

                            const current = this.$selection.currentProject.searchById(id);
                            if (current && current.is('artboard') && current.hasChildren()) {
                                // NOOP
                            } else {
                                this.$selection.selectById(id);
                            }

                        }
                    }
                }
            }


            this.selectCurrent(...this.$selection.items)
            this.initializeDragSelection();
            this.emit('history.refreshSelection');      
        }
  
    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();

        this.emit('refreshSelectionTool');
    }


    calculateMovedElement () {
        const e = this.$config.get('bodyEvent')
        const targetMousePoint = this.$viewport.createWorldPosition(e.clientX, e.clientY);

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        this.selectionToolView.moveTo(newDist);       
        
        // 최종 위치에서 ArtBoard 변경하기 
        if (this.$selection.changeArtBoard()) {
            this.initMousePoint = targetMousePoint;
            this.$selection.reselect();
            this.$snapManager.clear();    
            this.trigger('refreshAllCanvas')

            // ArtBoard 변경 이후에 LayerTreeView 업데이트
            this.emit('refreshLayerTreeView')                        
            this.emit('refreshSelectionTool', true);         
        }

        this.nextTick(() => {

            this.emit('refreshSelectionStyleView');
            this.emit('refreshSelectionTool', false);       
            this.emit('refreshRect'); 
        })

    }

    /**
     * ArtBoard title 변경하기 
     * @param {string} id 
     * @param {string} title 
     */
    [EVENT('refreshArtBoardName')] (id, title) {
        this.$el.$(`[data-id='${id}'] > .artboard-title`).html(title);
    }

    calculateEndedElement (dx, dy) {
        const targetXY = this.$config.get('bodyEvent').xy;

        const realDx = targetXY.x - this.startXY.x;
        const realDy = targetXY.y - this.startXY.y;

        if (realDx === 0 && realDy === 0) {
            if (this.$selection.current.isSVG()) {
                this.emit('openPathEditor');
                return; 
            }
        } else {              
            // this.emit('removeGuideLine');

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
            'tabIndex': -1,
            style: { 
                width, 
                height, 
            }
        }
    }

    [BIND('$view')] () {

        const { translate, transformOrigin: origin, scale} = this.$viewport;      
        
        const transform =  `translate(${translate[0]}px, ${translate[1]}px) scale(${scale || 1})`;
        const transformOrigin = `${origin[0]}px ${origin[1]}px`

        this.refs.$view.$$('.artboard-title').forEach($title => {
            $title.css('transform-origin', `bottom left`)
            $title.css('transform', `scale(${1/scale})`)
        })

        return {
            style: { 
                'transform-origin': transformOrigin,
                transform
            }
        }
    }    


    selectCurrent (...args) {
        this.state.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement.length) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }


        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);

            if (list.length) {
                list.forEach(it => {
                    this.state.cachedCurrentElement[it.attr('data-id')] = it; 
                    it.addClass('selected')
                })
            }

        }    
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

        this.selectCurrent(...items);
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

    [EVENT('playTimeline', 'moveTimeline')] () {

        const project = this.$selection.currentProject;
        var timeline = project.getSelectedTimeline();
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

        this.bindData('$view');
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

    [EVENT('updateViewport')] () {
        this.bindData('$view');        
    }

}