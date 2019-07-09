import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, LOAD, POINTERSTART, MOVE, END, IF, DEBOUNCE } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";

import { editor } from "../../../editor/editor";
import Dom from "../../../util/Dom";
import SelectionToolView from "./SelectionToolView";
import GuideLineView from "./GuideLineView";
import { keyEach } from "../../../util/functions/func";
import { uuid } from "../../../util/functions/math";
import { DomDiff } from "../../../util/DomDiff";




// 그리드 선 그려주는 함수 
// background-image 로 그린다. 
const createGridLine = (width) => {
    var subLineColor = 'rgba(247, 247, 247, 1)'
    var lineColor = 'rgba(232, 232, 232, 1)'
    var superLineColor = 'rgba(148, 148, 148, 0.5)'
    var subWidth = width/5;
    var superWidth = width * 5; 
    return `
        repeating-linear-gradient(to right, transparent 0px ${superWidth-1}px, ${superLineColor} ${superWidth-1}px ${superWidth}px ),
        repeating-linear-gradient(to bottom, transparent 0px ${superWidth-1}px, ${superLineColor} ${superWidth-1}px ${superWidth}px ),        
        repeating-linear-gradient(to right, transparent 0px ${width-1}px, ${lineColor} ${width-1}px ${width}px ),
        repeating-linear-gradient(to bottom, transparent 0px ${width-1}px, ${lineColor} ${width-1}px ${width}px ),
        repeating-linear-gradient(to right, transparent 0px ${subWidth - 1}px, ${subLineColor} ${subWidth - 1}px ${subWidth}px ),
        repeating-linear-gradient(to bottom, transparent 0px ${subWidth - 1}px, ${subLineColor} ${subWidth - 1}px ${subWidth}px )
    `
}

export default class ElementView extends UIElement {

    components() {
        return {
            SelectionToolView,
            GuideLineView
        }
    }

    initialize() {
        super.initialize();

        this.redGLObjectList = {}
    }

    initState() {
        return {
            mode: 'selection',
            left: Length.px(0),
            top: Length.px(0),
            width: Length.px(10000),
            height: Length.px(10000),
            html: ''
        }
    }


    afterRender() {
        setTimeout( () => {
            this.refs.$view.scrollIntoView();

            var $lock = this.parent.refs.$lock

            $lock.addScrollLeft(-100);
            $lock.addScrollTop(-100);
        }, 100);
    }

    template() {
        return `
            <div class='element-view' ref='$body'>
                <div class='canvas-view' ref='$view'></div>
                <div ref='$dragAreaRect' style='pointer-events:none;position: absolute;border:0.5px dashed #556375;box-sizing:border-box;left:-10000px;'></div>
                <GuideLineView ref='$guideLineView' />                
                <SelectionToolView ref='$selectionTool' />

            </div>
        `
    }

    checkEmptyElement (e) {
        var $el = Dom.create(e.target)

        if (this.state.mode !== 'selection') {
            return false; 
        }

        return $el.hasClass('element-item') === false && 
                $el.hasClass('selection-tool-item') === false &&
                $el.hasClass('redgl-canvas-item') === false 
        ;
    }

    [POINTERSTART('$el') + IF('checkEmptyElement') + MOVE('movePointer') + END('moveEndPointer')] (e) {

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


        editor.selection.empty();
        this.selectCurrent();

    }

    movePointer (dx, dy) {

        var obj = {
            left: Length.px(this.dragXY.x + (dx < 0 ? dx : 0)),
            top: Length.px(this.dragXY.y + (dy < 0 ? dy : 0)),
            width: Length.px(Math.abs(dx)),
            height: Length.px(Math.abs(dy))
        }        

        this.refs.$dragAreaRect.css(obj)
    }

    moveEndPointer (dx, dy) {

        var [
            x, y, 
            width, height 
        ] = this.refs.$dragAreaRect
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

        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            Object.keys(rect).forEach(key => {
                rect[key].div(editor.scale)
            })

            var items = artboard.checkInAreaForLayers(rect);

            editor.selection.select(...items);
        }

        this.refs.$dragAreaRect.css({
            left: Length.px(-10000),
            top: Length.px(0),
            width: Length.px(0),
            height: Length.px(0)
        })

        this.selectCurrentForBackgroundView(...items)

        if (items.length) {
            this.emit('refreshSelection')
            this.emit('changeSelection')
        } else {
            editor.selection.select();            
            this.emit('emptySelection')
        }
    }

    [POINTERSTART('$view .element-item') + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.$element = e.$delegateTarget;
        this.isRedGL = this.$element.hasClass('redgl-canvas');
        if (this.$element.hasClass('selected')) {
            // NOOP 
        } else {

            var id = this.$element.attr('data-id')
            editor.selection.selectById(id);    
        }

        this.selectCurrent(...editor.selection.items)
        this.emit('refreshSelection');
        editor.selection.setRectCache()
    }

    calculateMovedElement (dx, dy) {
        if (this.isRedGL) {
            // console.log(this.isRedGL);
        } else {
            this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
            this.updateRealPosition();     
        }
    }

    updateRealPosition() {
        editor.selection.items.forEach(item => {
            var {x, y, width, height} = item.toBound();
            if (this.cachedCurrentElement[item.id]) {
                this.cachedCurrentElement[item.id].cssText(`left: ${x};top:${y};width:${width};height:${height}`)
            }
        })

        this.emit('refreshRect');        
    }

    [EVENT('removeRealPosition')] () {
        editor.selection.items.forEach(item => {
            if (this.cachedCurrentElement[item.id]) {
                this.cachedCurrentElement[item.id].cssText(``)
            }
        })
    }

    calculateEndedElement (dx, dy) {

        if (this.isRedGL) {

        } else {
            this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
            var current = editor.selection.items.length === 1 ? editor.selection.current : null;
    
            if(current && current.is('redgl-canvas')) {
    
            } else {
                this.emit('refreshElement', current);
            }
    
        }
        this.emit('removeGuideLine')        
        this.trigger('removeRealPosition');   

    }

    [BIND('$body')] () {
        var width = Length.px(10000);
        var height = Length.px(10000);

        return {
            'data-mode': this.state.mode,
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
                transform: `translate(-50%, -50%) scale(${editor.scale})`
            },
            innerHTML: this.state.html
        }
    }    

    [EVENT('addElement')] () {
        var artboard = editor.selection.currentArtboard
        var html = artboard.html

        this.setState({ html }, false)
        var $div = Dom.create('div').html(html);
        DomDiff(this.refs.$view, $div)

        this.trigger('refreshRedGL', true)
        this.emit('refreshSelectionTool')
    }

    [EVENT('refreshRedGL')] (isRemove = false) {
        var artboard = editor.selection.currentArtboard;

        if (artboard) {
            // console.log(artboard.allLayers);
            artboard.allLayers.filter(item => item.is('redgl-canvas')).forEach(item => {
                if (isRemove && !item.redGL) {item.removeRedGL()}
                var $canvas = this.refs.$view.$(`[data-id="${item.id}"] canvas`);
                this.runRedGL($canvas, item, false);
            })
        }

    }

    selectCurrent (...args) {
        this.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }

        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);
            
            list.forEach(it => {
                this.cachedCurrentElement[it.attr('data-id')] = it; 
                it.addClass('selected')
            })
            
        } else {
            editor.selection.select(editor.selection.currentArtboard)
        }
        // this.emit('refreshSelection')           

        this.emit('initSelectionTool')

    }


    selectCurrentForBackgroundView (...args) {
        this.cachedCurrentElement = {}
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }

        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);
            
            list.forEach(it => {
                this.cachedCurrentElement[it.attr('data-id')] = it; 
                it.addClass('selected')
            })
            
        } else {
            editor.selection.select()
        }
        this.emit('refreshSelection')           

        this.emit('initSelectionTool')

    }    
    
    [EVENT('refreshSelection')] () {

        if (!this.state.html) {
            this.trigger('addElement');
        }

        // var current = editor.selection.current || { id : ''} 
        // this.selectCurrent(current);        
        this.emit('initSelectionTool')
    }

    modifyScale () {
        this.refs.$view.css({
            transform: `translate(-50%, -50%) scale(${editor.scale})`
        })

        this.emit('makeSelectionTool', true);
    }

    [EVENT('changeScale')] () {
       this.modifyScale();
    }

    runRedGL($canvas, item, isRefresh = false) {
        if (item.redGL) {
            $canvas.width(item.width)
            $canvas.height(item.height);            
            item.initRedGLSize();      
            // console.log(item);       
        } else {
            var self = this; 
            $canvas.width(item.width)
            $canvas.height(item.height);

            if (item.redGL && isRefresh) {
                item.initRedGLSize(); 
            } else {
                item.initRedGL($canvas);
            }

        }

    }

    [EVENT('refreshCanvas')] (obj) {
        if (obj) {
            // 하나 짜리 바뀌는건 element view 에서 적용하지 않는다. 
            if (!this.currentElement) {
                this.currentElement = this.refs.$view.$(`[data-id="${obj.id}"]`);
            } else if (this.currentElement && this.currentElement.attr('data-id') != obj.id) {
                this.currentElement = this.refs.$view.$(`[data-id="${obj.id}"]`);
            }

            if (this.currentElement) {
                var $content = this.currentElement.$('.content')    

                if (obj.itemType === 'redgl-canvas') {
                    this.runRedGL(this.currentElement.$('canvas'), obj, true);
                } else if (obj.elementType === 'image') {
                    this.currentElement.attr('src', obj.src);
                } else {

                    if (obj.content) {
                        if(!$content) {
                            this.currentElement.prepend(Dom.create('div', 'content'))
                            $content = this.currentElement.$('.content')
                        }
                        $content && $content.text(obj.content);
                    } else {
                        $content && $content.remove();
                    }
                }

            }
        } else {
            this.trigger('addElement')
        }

    }

    refresh() {
        if (this.state.html != this.prevState.html) {
            this.load();
        } else {
            // NOOP 
        }
    }
    
} 