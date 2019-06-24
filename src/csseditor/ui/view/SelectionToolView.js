import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";

export default class SelectionToolView extends UIElement {


    template() {
        return `<div class='selection-view' 
                     ref='$selectionView' 
                     style='pointer-events:none;position:absolute;left:0px;top:0px;right:0px;bottom:0px;'
                ></div>`
    }

    [POINTERSTART('$selectionView .item') + MOVE() + END()] (e) {
        this.pointerType = e.$delegateTarget.attr('data-position')

        this.initSelectionTool();
        editor.selection.setRectCache();
    }

    move (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
    }

    end (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
    }    

    modifyScaledItemRect(id, obj) {
        
        var tempRect = this.originalItemRect[id];

        // selection 영역에 대한 크기 재정의 하는 곳 
        if(!this.scaledItemRect[id]) {
            this.scaledItemRect[id] = {}
        }

        //변화량만 따로 관리 한다. 
        this.scaledItemRect[id] = Object.assign({},tempRect,this.scaledItemRect[id], obj)
    }

    refreshSelectionToolView (dx, dy, type) {
        var scaledDx = dx / editor.scale
        var scaledDy = dy / editor.scale


        if (type === 'move') {

            editor.selection.each ((item, cachedItem, ) => {
                item.reset({
                    x: Length.px(cachedItem.x.value + scaledDx).round(1),
                    y: Length.px(cachedItem.y.value + scaledDy).round(1)
                })

                var tempRect = this.originalItemRect[item.id];
                    
                this.modifyScaledItemRect(item.id, { 
                    x: Length.px(tempRect.x + dx).round(1).value, 
                    y: Length.px(tempRect.y + dy).round(1).value
                })
            })
    
        } else {

            if (this.pointerType.includes('right')) {
                editor.selection.each ((item, cachedItem, ) => {
                    item.reset({ width: Length.px(cachedItem.width.value + scaledDx).round(1) })
        
                    var tempRect = this.originalItemRect[item.id];
                    
                    this.modifyScaledItemRect(item.id, { 
                        width: Length.px(tempRect.width + dx).round(1).value
                    })                    

                })
            } else if (this.pointerType.includes('left')) {
                editor.selection.each ((item, cachedItem, ) => {
    
                    item.reset({ 
                        x: Length.px(cachedItem.x.value + scaledDx).round(1),
                        width: Length.px(cachedItem.width.value - scaledDx).round(1) 
                    })
        
                    var tempRect = this.originalItemRect[item.id];

                    this.modifyScaledItemRect(item.id, { 
                        x: Length.px(tempRect.x + dx).round(1).value,
                        width: Length.px(tempRect.width - dx).round(1).value,
                    })                 

                })
            } 
    
            if (this.pointerType.includes('bottom')) {      // 밑으로 향하는 애들 
                editor.selection.each ((item, cachedItem, ) => {
                    item.reset({ height: Length.px(cachedItem.height.value + scaledDy).round(1) })
        
                    var tempRect = this.originalItemRect[item.id];

                    this.modifyScaledItemRect(item.id, { 
                        height: Length.px(tempRect.height + dy).round(1).value
                    })                 

                })
            } else if (this.pointerType.includes('top')) {
                editor.selection.each ((item, cachedItem, ) => {
    
                    item.reset({ 
                        y: Length.px(cachedItem.y.value + scaledDy).round(1),
                        height: Length.px(cachedItem.height.value - scaledDy).round(1) 
                    })
        
                    var tempRect = this.originalItemRect[item.id];

                    this.modifyScaledItemRect(item.id, { 
                        y: Length.px(tempRect.y + dy).round(1).value,
                        height: Length.px(tempRect.height - dy).round(1).value,
                    })
                })
            }          
        }

        this.emit('refreshCanvas');
        this.emit('refreshRect');

        this.makeSelectionTool();
    }

    getOriginalRect () {
        if (!this.originalRect) {
            this.originalRect = this.parent.$el.rect();
        }

        return this.originalRect;
    }

    [EVENT('refreshSelectionTool')] () {
        this.initSelectionTool();
        this.makeSelectionTool();
    }

    [EVENT('initSelectionTool')] () {
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] () {
        this.makeSelectionTool();
    }

    initSelectionTool() {

        // selection tool 을 관리하기 위해 
        // 원본 originalItemRect 와 
        // 변화량을 가지고 있는 scaledItemRect 를 정의한다. 
        //  scaledItemRect.x ===  originalItemRect.x + dx  형태로 되어 있다. 
        // 최종 결과물은 scaledItemRect 를 통해서 표현한다. 
        this.originalItemRect = {}
        this.scaledItemRect = {} 
        var originalRect = this.getOriginalRect()

        var html = editor.selection.items.map(it => {

            var $el = this.parent.refs.$view.$(`[data-id='${it.id}']`);

            if ($el) {
                var r = $el.rect();

                this.originalItemRect[it.id] = r;

                r.x -= originalRect.x;
                r.y -= originalRect.y;

                var temp = [
                    `left:${Length.px(r.x)};`,
                    `top:${Length.px(r.y)};`,
                    `width:${Length.px(r.width)};`,
                    `height:${Length.px(r.height)};`
                ].join('')
                return `
                <div class='selection-tool' style='${temp};'>
                    <div class='item' data-position='top'></div>
                    <div class='item' data-position='right'></div>
                    <div class='item' data-position='bottom'></div>
                    <div class='item' data-position='left'></div>
                    <div class='item' data-position='top-right'></div>
                    <div class='item' data-position='bottom-right'></div>
                    <div class='item' data-position='top-left'></div>
                    <div class='item' data-position='bottom-left'></div>
                </div>
                `
            }

            return '';
        }).join('')

        this.refs.$selectionView.html(html);

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

    
} 