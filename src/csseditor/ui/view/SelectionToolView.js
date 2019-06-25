import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";

const roundedLength = (px, fixedRound = 1) => {
    return Length.px(px).round(fixedRound);
}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends UIElement {


    template() {
        return `<div class='selection-view' 
                     ref='$selectionView' 
                     style='pointer-events:none;position:absolute;left:0px;top:0px;right:0px;bottom:0px;'
                ></div>`
    }

    [POINTERSTART('$selectionView .item') + MOVE() + END()] (e) {
        this.pointerType = e.$delegateTarget.attr('data-position')

        editor.selection.setRectCache();        
        this.initSelectionTool();

    }

    move (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
    }

    end (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
    }   

    refreshSelectionToolView (dx, dy, type) {
        var scaledDx = dx / editor.scale
        var scaledDy = dy / editor.scale


        if (type === 'move') {

            editor.selection.each ((item, cachedItem, ) => {

                item.move( 
                    roundedLength(cachedItem.x.value + scaledDx),
                    roundedLength(cachedItem.y.value + scaledDy)
                )
            })
    
        } else {

            if (this.pointerType.includes('right')) {
                editor.selection.each ((item, cachedItem, ) => {

                    item.resizeWidth(
                        roundedLength(cachedItem.width.value + scaledDx)
                    )

                })
            } else if (this.pointerType.includes('left')) {
                editor.selection.each ((item, cachedItem, ) => {

                    if (cachedItem.width.value - scaledDx >= 0) {
                        item.moveX( roundedLength(cachedItem.x.value + scaledDx) )
                        item.resizeWidth( roundedLength(cachedItem.width.value - scaledDx) )
                    }

                })
            } 
    
            if (this.pointerType.includes('bottom')) {      // 밑으로 향하는 애들 
                editor.selection.each ((item, cachedItem, ) => {

                    item.resizeHeight( roundedLength(cachedItem.height.value + scaledDy) )

                })
            } else if (this.pointerType.includes('top')) {
                editor.selection.each ((item, cachedItem, ) => {

                    if ( cachedItem.height.value - scaledDy >= 0 ) {
                        item.moveY( roundedLength(cachedItem.y.value + scaledDy) )                                
                        item.resizeHeight( roundedLength(cachedItem.height.value - scaledDy) )    
                    }

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

    getOriginalArtboardRect () {
        if (!this.originalArtboardRect) {
            this.originalArtboardRect = this.parent.refs.$view.rect();
        }

        return this.originalArtboardRect;
    }    

    [EVENT('refreshSelectionTool')] () {
        this.initSelectionTool();
    }

    [EVENT('initSelectionTool')] () {
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] () {
        this.makeSelectionTool();
    }

    initSelectionTool() {

        this.originalArtboardRect = null
        this.originalRect = null

        var html = editor.selection.items.map(it => {
                return `
                <div class='selection-tool'>
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
        }).join('')

        this.refs.$selectionView.html(html);

        this.cachedSelectionTools = this.refs.$selectionView.$$('.selection-tool');

        this.makeSelectionTool();
    }    

    getWorldPosition () {
        var originalRect = this.getOriginalRect();
        var originalArtboardRect = this.getOriginalArtboardRect();

        return {
            left: originalArtboardRect.left - originalRect.left,
            top: originalArtboardRect.top - originalRect.top
        }
    }

    makeSelectionTool() {
        editor.selection.items.forEach( (item, index) => {
            this.cachedSelectionTools[index].css( this.calculateWorldPosition(item) )
        })
        
    }

    calculateWorldPosition (item) {
        var world = this.getWorldPosition();

        var x = (item.x || Length.px(0));
        var y = (item.y || Length.px(0));

        return {
            left: Length.px(x.value * editor.scale + world.left),
            top: Length.px(y.value * editor.scale + world.top),
            width: Length.px(item.width.value  *  editor.scale),
            height: Length.px(item.height.value  * editor.scale),
            transform: item.transform
        }
    }

    [EVENT('refreshCanvas')] (obj = {}) {
        if (obj.transform) {
            this.makeSelectionTool(obj);
        }
    }

    
} 