import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, LOAD, POINTERSTART, MOVE, END, IF } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../types/event";
import { editor } from "../../../editor/editor";
import Dom from "../../../util/Dom";
import SelectionToolView from "./SelectionToolView";



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
            SelectionToolView
        }
    }

    initState() {
        return {
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
                <SelectionToolView ref='$selectionTool' />
            </div>
        `
    }

    checkEmptyElement (e) {
        var $el = Dom.create(e.target)
        return $el.hasClass('element-item') === false && 
                $el.hasClass('selection-tool-item') === false 
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

        this.selectCurrent(...items)
    }

    [POINTERSTART('$view .element-item') + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.$element = e.$delegateTarget;

        if (this.$element.hasClass('selected')) {
            // NOOP 
        } else {

            var id = this.$element.attr('data-id')
            editor.selection.selectById(id);    
        }

        this.selectCurrent(...editor.selection.items)

        editor.selection.setRectCache()
    }

    calculateMovedElement (dx, dy) {
        this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
        this.updateRealPosition();          
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

    removeRealPosition() {

        editor.selection.items.forEach(item => {
            if (this.cachedCurrentElement[item.id]) {
                this.cachedCurrentElement[item.id].cssText(``)
            }
        })
    }

    calculateEndedElement (dx, dy) {

        this.children.$selectionTool.refreshSelectionToolView(dx, dy, 'move');
        this.updateRealPosition();                        
        this.emit('refreshCanvas', { transform  : true });        
    }

    [BIND('$body')] () {
        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}
        
        var width = Length.px(artboard.width.value + 5000);
        var height = Length.px(artboard.height.value + 5000);

        return {
            style: {
                'position': 'relative',
                width,
                height
            }
        }
    }


    [BIND('$view')] () {
        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}

        var width = Length.px(artboard.width.value)
        var height = Length.px(artboard.height.value)

        return {
            style: {
                "background-color": 'white',
                'background-image': createGridLine(100),
                'box-shadow': '0px 0px 5px 0px rgba(0, 0, 0, .5)',
                'position': 'absolute',
                'left': Length.percent(50),
                'top': Length.percent(50),
                transform: `translate(-50%, -50%) scale(${editor.scale})`,
                width,
                height
            }
        }
    }    

    [LOAD('$view')] () {
        return this.state.html
    }

    [EVENT('addElement')] () {
        var artboard = editor.selection.currentArtboard
        var html = '' 
        if (artboard) {
            html = artboard.layers.map(it => {
                it.selected = editor.selection.current === it;
                return it.html
            }).join('\n')
        }

        this.setState({ html })

        setTimeout(() => {
            this.emit('refreshSelectionTool')
        }, 100)

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

            this.emit(CHANGE_SELECTION)   
            
        }

        this.emit('initSelectionTool')

    }
    
    [EVENT(CHANGE_SELECTION)] () {

        if (!this.state.html) {
            this.trigger('addElement');
        }

        var current = editor.selection.current || { id : ''} 
        this.selectCurrent(current);        
    }

    modifyScale () {
        this.refs.$view.css({
            transform: `translate(-50%, -50%) scale(${editor.scale})`
        })

        this.emit('initSelectionTool');
    }

    [EVENT('changeScale')] () {
       this.modifyScale();
    }

    [EVENT('refreshCanvas')] (obj = {}) {
        if (obj.update === 'tag') {
            this.trigger('addElement');
        }
    }
    
} 