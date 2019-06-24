import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND, LOAD, POINTERSTART, MOVE, END, IF } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { CHANGE_SELECTION, SCALE_DIRECTION_IN } from "../../types/event";
import { editor } from "../../../editor/editor";
import Dom from "../../../util/Dom";

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


    initState() {
        return {
            left: Length.px(0),
            top: Length.px(0),
            width: Length.px(10000),
            height: Length.px(10000),
            html: ''
        }
    }


    template() {
        return `
            <div class='element-view' ref='$body'>
                <div class='canvas-view' ref='$view'></div>
                <div ref='$dragAreaRect' style='pointer-events:none;position: absolute;border:0.5px dashed #556375;box-sizing:border-box;left:-10000px;'></div>
                <div class='selection-view' ref='$selectionView' style='pointer-events:none;position:absolute;left:0px;top:0px;right:0px;bottom:0px;'></div>
            </div>
        `
    }

    checkEmptyElement (e) {
        return Dom.create(e.target).hasClass('item') === false;
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

    [POINTERSTART('$view .item') + MOVE('moveElement') + END('moveEndElement')] (e) {
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

    caculateMovedElement (dx, dy) {
        var scaledDx = dx / editor.scale
        var scaledDy = dy / editor.scale

        editor.selection.each ((item, cachedItem, ) => {
            item.reset({
                x: Length.px(cachedItem.x.value + scaledDx).round(1),
                y: Length.px(cachedItem.y.value + scaledDy).round(1)
            })

            var tempRect = this.originalItemRect[item.id];
            
            //변화량만 따로 관리 한다. 
            this.scaledItemRect[item.id] = {
                x: Length.px(tempRect.x + dx).round(1).value, 
                y: Length.px(tempRect.y + dy).round(1).value,
                width: tempRect.width,
                height: tempRect.height 
            }
        })



        this.emit('refreshCanvas');
        this.emit('refreshRect');

        this.makeSelectionTool()        

    }

    moveElement (dx, dy) {
        this.caculateMovedElement(dx, dy);
       
    }

    moveEndElement (dx, dy) {
        this.caculateMovedElement(dx, dy);
    }

    [BIND('$body')] () {
        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}
        
        var width = Length.px(artboard.width.value + 400);
        var height = Length.px(artboard.height.value + 400);

        return {
            style: {
                'position': 'relative',
                width,
                height
            }
        }
    }


    [BIND('$view')] () {
        var tempScale = 1;

        var artboard = editor.selection.currentArtboard || { width: Length.px(1000), height: Length.px(1000)}

        var width = Length.px(artboard.width.value  * tempScale)
        var height = Length.px(artboard.height.value  * tempScale)

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
            this.initSelectionTool();
            this.makeSelectionTool();        
        }, 100)

    }

    selectCurrent (...args) {
        var $selectedElement = this.$el.$$('.selected');

        if ($selectedElement) {
            $selectedElement.forEach(it => it.removeClass('selected'))
        }

        if(args.length) {

            var selector = args.map(it => `[data-id='${it.id}']`).join(',')

            var list = this.$el.$$(selector);
            
            list.forEach(it => {
                it.addClass('selected')
            })

            this.emit(CHANGE_SELECTION)   
            
        }

        this.initSelectionTool();

    }


    initSelectionTool() {

        // selection tool 을 관리하기 위해 
        // 원본 originalItemRect 와 
        // 변화량을 가지고 있는 scaledItemRect 를 정의한다. 
        //  scaledItemRect.x ===  originalItemRect.x + dx  형태로 되어 있다. 
        // 최종 결과물은 scaledItemRect 를 통해서 표현한다. 
        this.originalRect = this.refs.$body.rect();
        this.originalItemRect = {}
        this.scaledItemRect = {} 

        var html = editor.selection.items.map(it => {

            var $el = this.$el.$(`[data-id='${it.id}']`);

            if ($el) {
                var r = $el.rect();

                this.originalItemRect[it.id] = r;

                r.x -= this.originalRect.x;
                r.y -= this.originalRect.y;

                var temp = [
                    `left:${Length.px(r.x)};`,
                    `top:${Length.px(r.y)};`,
                    `width:${Length.px(r.width)};`,
                    `height:${Length.px(r.height)};`
                ].join('')
                return `<div class='selection-tool' style='position:absolute;${temp};outline:1px solid blue;'></div>`
            }

            return '';
        }).join('')

        this.refs.$selectionView.html(html);

        this.cachedSelectionItems = this.refs.$view.$$('.selected');
        this.cachedSelectionTools = this.refs.$selectionView.$$('.selection-tool');
    }    

    makeSelectionTool() {
        // 딜레이가 너무 심하다.
        // 왜 그런지 알아보자. 

        editor.selection.items.filter(it => {
            return this.scaledItemRect[it.id] 
        }).forEach( (it, index) => {
            var r = this.scaledItemRect[it.id];

            this.cachedSelectionTools[index].css({
                left: Length.px(r.x),
                top: Length.px(r.y),
                width: Length.px(r.width),
                height: Length.px(r.height)
            })
        })
        
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

        this.initSelectionTool();
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