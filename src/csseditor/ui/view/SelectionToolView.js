import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "./GuideView";
import { MovableItem } from "../../../editor/items/MovableItem";



/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends UIElement {

    initialize() {
        super.initialize();

        this.guideView = new GuideView();
    }

    template() {
        return `<div class='selection-view' 
                     ref='$selectionView' 
                     style='pointer-events:none;position:absolute;left:0px;top:0px;right:0px;bottom:0px;'
                >
                    <div class='selection-tool' ref='$selectionTool'>
                        <div class='selection-tool-item' data-position='to top'></div>
                        <div class='selection-tool-item' data-position='to right'></div>
                        <div class='selection-tool-item' data-position='to bottom'></div>
                        <div class='selection-tool-item' data-position='to left'></div>
                        <div class='selection-tool-item' data-position='to top right'></div>
                        <div class='selection-tool-item' data-position='to bottom right'></div>
                        <div class='selection-tool-item' data-position='to top left'></div>
                        <div class='selection-tool-item' data-position='to bottom left'></div>
                    </div>
                </div>`
    }

    [POINTERSTART('$selectionView .selection-tool-item') + MOVE() + END()] (e) {
        this.pointerType = e.$delegateTarget.attr('data-position')

        this.parent.selectCurrent(...editor.selection.items)

        editor.selection.setRectCache();        

        this.initSelectionTool();
    }

    move (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
        this.parent.updateRealPosition();     
    }

    end (dx, dy) {
        this.refreshSelectionToolView(dx, dy);
        this.parent.trigger('removeRealPosition');                
        // this.initSelectionTool();
        this.emit('refreshCanvas', { transform  : true });
    }   

    refreshSelectionToolView (dx, dy, type) {
        this.guideView.move(type || this.pointerType, dx / editor.scale,  dy / editor.scale )

        var drawList = this.guideView.calculate();

        this.makeSelectionTool();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));        
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

    [EVENT('initSelectionTool')] (type = 'move') {
        // this.pointerType = type; 
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] (isScale) {
        if (isScale) {
            this.removeOriginalRect()   
        }
        var drawList = this.guideView.calculate();

        this.makeSelectionTool();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));                
    }

    removeOriginalRect () {
        this.originalArtboardRect = null
        this.originalRect = null
    }

    initSelectionTool() {
        this.removeOriginalRect();

        this.guideView.makeGuideCache();        
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

        // selection 객체는 하나만 만든다. 

        this.guideView.recoverAll();

        var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;

        this.refs.$selectionTool.cssText(`left: ${x};top:${y};width:${width};height:${height}`)
    }

    calculateWorldPositionForGuideLine (list = []) {
        return list.map(it => {

            var A = new MovableItem(this.calculateWorldPosition(it.A))
            var B = new MovableItem(this.calculateWorldPosition(it.B))

            var ax, bx, ay, by; 

            if (isNotUndefined(it.ax)) { ax = it.ax * editor.scale }
            if (isNotUndefined(it.bx)) { bx = it.bx * editor.scale }
            if (isNotUndefined(it.ay)) { ay = it.ay * editor.scale }
            if (isNotUndefined(it.by)) { by = it.by * editor.scale }

            return {
                A, 
                B,
                ax, 
                bx,
                ay,
                by
            }
        })
    }

    calculateWorldPosition (item) {
        var x = (item.x || Length.px(0));
        var y = (item.y || Length.px(0));

        return {
            x: Length.px(x.value * editor.scale),
            y: Length.px(y.value * editor.scale),
            width: Length.px(item.width.value  *  editor.scale),
            height: Length.px(item.height.value  * editor.scale),
            transform: item.transform
        }
    }

    [EVENT('refreshCanvas')] (obj = {}) {
        if (obj.transform) {
            this.makeSelectionTool(obj);
        } else if (obj.init) {

            editor.selection.setRectCache();        

            this.initSelectionTool();
        }
    }

    
} 