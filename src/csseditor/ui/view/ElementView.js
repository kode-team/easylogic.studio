import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, POINTERSTART, MOVE, END, IF, KEYUP, DROP, DRAGOVER, PREVENT } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";

import Dom from "../../../util/Dom";
import SelectionToolView from "../view-items/SelectionToolView";
import GuideLineView from "../view-items/GuideLineView";
import PathEditorView from "../view-items/PathEditorView";
import GridLayoutLineView from "../view-items/GridLayoutLineView";
import PathDrawView from "../view-items/PathDrawView";
import BrushDrawView from "../view-items/BrushDrawView";



export default class ElementView extends UIElement {

    components() {
        return {
            SelectionToolView,
            GuideLineView,
            PathEditorView,
            PathDrawView,
            BrushDrawView,
            GridLayoutLineView,
        }
    }

    initState() {
        return {
            mode: 'selection',
            left: Length.px(0),
            top: Length.px(0),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
            html: ''
        }
    }

    template() {
        return /*html*/`
            <div class='element-view' ref='$body'>
                <div class='canvas-view' ref='$view'></div>
                <div class='drag-area-rect' ref='$dragAreaRect'></div>
                <GuideLineView ref='$guideLineView' />
                <GridLayoutLineView ref='$gridLayoutLineView' />
                <SelectionToolView ref='$selectionTool' />
                <PathEditorView ref='$pathEditorView' />
                <PathDrawView ref='$pathDrawView' />
                <BrushDrawView ref='$brushDrawView' />
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

    getElement (id) {
        return this.refs.$view.$(`[data-id="${id}"]`);
    }

    checkEmptyElement (e) {
        var $el = Dom.create(e.target)

        if (this.$editor.isAddMode()) {
            return true; 
        }

        if (this.state.mode !== 'selection') {
            return false; 
        }

        return $el.hasClass('element-item') === false 
            && $el.hasClass('selection-tool-item') === false 
            && $el.hasClass('point') === false
            && $el.hasClass('handle') === false            
            && $el.hasClass('perspective-handle') === false
            && $el.hasClass('transform-tool-item') === false
            && $el.hasClass('transform-tool') === false            
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
                width: Length.px(0),
                height: Length.px(0)
            }        
    
            this.refs.$dragAreaRect.css(obj) 

            this.state.cachedCurrentElement = {}
            this.$el.$$('.selected').forEach(it => it.removeClass('selected'))
        } else {
            // add mode 
            // NOOP 
        }

    }

    movePointer (dx, dy) {

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
                x: Length.px(x.value -  this.canvasPosition.x), 
                y: Length.px(y.value - this.canvasPosition.y), 
                width, 
                height
            }

            rect.x2 = Length.px(rect.x.value + rect.width.value);
            rect.y2 = Length.px(rect.y.value + rect.height.value); 

            var artboard = this.$selection.currentArtboard;
            var items = this.$selection.items; 
            if (artboard) {
                Object.keys(rect).forEach(key => {
                    rect[key].div(this.$editor.scale)
                })
    
                var items = artboard.checkInAreaForLayers(rect);

                if (rect.width.value === 0 && rect.height.value === 0) {
                    items = [] 
                }                 
    
                if (this.$selection.select(...items)) {
                    this.selectCurrentForBackgroundView(...items)
                }

            }

            if (this.$selection.select(...items)) {
                this.emit('refreshSelection')
            }

        }
    }

    moveEndPointer (dx, dy) {
        var [x, y, width, height ] = this.refs.$dragAreaRect
                .styles('left', 'top', 'width', 'height')
                .map(it => Length.parse(it))

        var rect = {
            x: Length.px(x.value -  this.canvasPosition.x), 
            y: Length.px(y.value - this.canvasPosition.y), 
            width, 
            height
        }

        rect.x2 = Length.px(rect.x.value + rect.width.value);
        rect.y2 = Length.px(rect.y.value + rect.height.value);

        this.refs.$dragAreaRect.css({
            left: Length.px(-10000),
            top: Length.px(0),
            width: Length.px(0),
            height: Length.px(0)
        })


        if (this.$editor.isSelectionMode()) {

            var artboard = this.$selection.currentArtboard;
            var items = [] 
            if (artboard) {
                Object.keys(rect).forEach(key => {
                    rect[key].div(this.$editor.scale)
                })

                items = artboard.checkInAreaForLayers(rect);

                if (rect.width.value === 0 && rect.height.value === 0) {
                    items = [artboard] 
                } 

                if (items.length === 0) {
                    if (artboard.checkInArea(rect)) {
                        items = [artboard]
                    }
                }

                if (this.$selection.select(...items)) {
                    this.selectCurrentForBackgroundView(...items)
                }
    
                if (items.length) {
                    this.emit('refreshSelection')
                } else {
                    this.$selection.select();
                    this.emit('emptySelection')
                }                
            } else {
                this.$selection.select();                
                this.emit('emptySelection')            
            }
    

        } else {
            var obj = {
                x: Length.px(rect.x.value / this.$editor.scale).floor(),
                y: Length.px(rect.y.value / this.$editor.scale).floor(),
                width: Length.px(rect.width.value / this.$editor.scale).floor(),
                height: Length.px(rect.height.value / this.$editor.scale).floor()
            }

            if (this.$editor.addComponentType === 'image') { 
                this.emit('openImage', obj);
            } else {
                this.emit('newComponent', this.$editor.addComponentType, obj);
            }

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


    [KEYUP('$view .element-item.text')] (e) {
        var content = e.$dt.html()
        var text = e.$dt.text().trim()
        var id = e.$dt.attr('data-id');

        var arr = [] 
        this.$selection.items.filter(it => it.id === id).forEach(it => {
            it.reset({ content, text })
            arr.push({id:it.id, content, text})
        })

        this.emit('refreshContent', arr);
    }

    checkEditMode () {
        return this.$editor.isSelectionMode()
    }

    [POINTERSTART('$view .element-item') + IF('checkEditMode')  + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.$element = e.$dt;

        if (this.$element.hasClass('text') && this.$element.hasClass('selected')) {
            return false; 
        }

        var id = this.$element.attr('data-id')        
        this.hasSVG = false;

        if (e.shiftKey) {
            this.$selection.toggleById(id);
        } else {

            if (this.$selection.check({ id } )) {
                if (this.$selection.current.is('svg-path', 'svg-brush', 'svg-textpath', 'svg-polygon')) {
                    this.hasSVG = true; 
                }
            } else {
                this.$selection.selectById(id);    
            }

        }
    
        this.selectCurrent(...this.$selection.items)
        this.$selection.setRectCache()        
        this.emit('refreshSelection');
        this.children.$selectionTool.initMoveType();
    }

    calculateMovedElement (dx, dy) {
        this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
        this.updateRealPosition();     
    }

    updateRealPositionByItem (item) {
        var {x, y, width, height} = item.toBound();
        var cachedItem = this.state.cachedCurrentElement[item.id]

        if (!cachedItem) {
            this.state.cachedCurrentElement[item.id] = this.getElement(item.id);
            cachedItem = this.state.cachedCurrentElement[item.id]
        }

        if (cachedItem) {
            cachedItem.cssText(`left: ${x};top:${y};width:${width};height:${height}; transform: ${item.transform};`)
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
            if (this.hasSVG) {
                this.emit('openPathEditor');
                return; 
            }

        } else {
            this.$selection.setRectCache()                
            this.emit('removeGuideLine')        
        }
    }

    [BIND('$body')] () {
        var width = Length.px(10000);
        var height = Length.px(10000);

        return {
            'data-mode': this.$editor.mode,
            style: {
                'position': 'relative',
                width,
                height
            }
        }
    }


    [BIND('$view')] () {
        return {
            style: {
                // 'background-image': createGridLine(100),
                // 'box-shadow': '0px 0px 5px 0px rgba(0, 0, 0, .5)',
                transform: `scale(${this.$editor.scale})`
            },
            innerHTML: this.state.html
        }
    }    

    [EVENT('addElement')] () {
        var artboard = this.$selection.currentArtboard || { html : ''} 
        var html = artboard.html;

        this.setState({ html }, false)
        // this.bindData('$view');
        this.refs.$view.updateDiff(html)

        this.emit('refreshSelectionTool')
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

        this.emit('initSelectionTool')

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

        this.emit('initSelectionTool')

    }    
    
    [EVENT('refreshSelection')] () {

        if (!this.state.html) {
            this.trigger('addElement');
        }


        this.emit('initSelectionTool')
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
        'refreshSelectionDragStyleView'     // tool 에서 드래그 할 때 변경 사항 적용 
    )] (obj, isChangeFragment = true,  isLast = false) {
        var items = obj ? [obj] : this.$selection.items;

        items.forEach(current => {
            this.updateElement(current, isChangeFragment, isLast);
        })
    }

    updateElement (item, isChangeFragment = true, isLast = false) {
        item.updateFunction(this.getElement(item.id), isChangeFragment, isLast);
        this.updateRealPositionByItem(item);
    }

    [EVENT('playTimeline', 'moveTimeline')] () {

        var artboard = this.$selection.currentArtboard;

        if (artboard) {
            var timeline = artboard.getSelectedTimeline();
            timeline.animations.map(it => artboard.searchById(it.id)).forEach(current => {
                this.updateElement(current);
            })
        }
    }    

    [EVENT('refreshAllCanvas')] (isRefreshSelectionTool = true) {
        var artboard = this.$selection.currentArtboard || { html : ''} 
        var html = artboard.html

        this.setState({ html }, false)
        // this.bindData('$view');
        this.refs.$view.updateDiff(html)

        if (isRefreshSelectionTool) {
            this.emit('refreshSelectionTool')
        }
    }

    refresh() {
        if (this.state.html != this.prevState.html) {
            this.load();
        } else {
            // NOOP 
        }
    }

    [EVENT('refreshAllElementBoundSize')] () {

        var selectionList = this.$selection.items.map(it => it.is('artboard') ? it : it.parent)

        var list = [...new Set(selectionList)];
        list.forEach(it => {
            this.trigger('refreshElementBoundSize', it);
        })

        this.$selection.setRectCache()
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
    
                        if (it.is('component')) {
                            this.emit('refreshStyleView', it, true);
                        }
    
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