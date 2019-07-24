import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, DOUBLECLICK, KEYUP, KEY, PREVENT, STOP } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "./GuideView";
import { MovableItem } from "../../../editor/items/MovableItem";
import icon from "../icon/icon";

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends UIElement {

    initialize() {
        super.initialize();

        this.guideView = new GuideView();
    }

    template() {
        return `
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool'>
            <div class='selection-tool-item' data-position='move'></div>
            <div class='selection-tool-item' data-position='path'>${icon.scatter}</div>
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

    [DOUBLECLICK('$selectionTool .selection-tool-item[data-position="move"]')] (e) {
        this.trigger('openPathEditor');
    }    

    toggleEditingPath (isEditingPath) {
        this.refs.$selectionTool.toggleClass('editing-path', isEditingPath);
    }

    toggleEditingPolygon (isEditingPolygon) {
        this.refs.$selectionTool.toggleClass('editing-polygon', isEditingPolygon);
    }    

    [EVENT('openPathEditor')] () {
        var current = editor.selection.current;
        if (current && current.is('svg-path')) {
            this.toggleEditingPolygon(false);
            this.toggleEditingPath(true);
            this.emit('showPathEditor', 'modify', {
                current,
                d: current.d,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        } else if (current.is('svg-polygon')) {
            this.trigger('openPolygonEditor');
        }
    }


    [EVENT('openPolygonEditor')] () {
        var current = editor.selection.current;
        if (current && current.is('svg-polygon')) {
            this.toggleEditingPath(false);            
            this.toggleEditingPolygon(true);
            this.emit('showPolygonEditor', 'modify', {
                current,
                points: current.points,
                screenX: current.screenX,
                screenY: current.screenY,
                screenWidth: current.screenWidth,
                screenHeight: current.screenHeight,
            }) 
        }
    }    

    [EVENT('finishPathEdit')] () {
        this.toggleEditingPath(false);
    }

    [EVENT('finishPolygonEdit')] () {
        this.toggleEditingPolygon(false);
    }    

    [EVENT('updatePathItem')] (pathObject) {

        var current = editor.selection.current;
        if (current) {
            if (current.is('svg-path')) {
                current.updatePathItem(pathObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
    
                
                this.emit('refreshSelectionStyleView')
            }
        }

    }


    [EVENT('updatePolygonItem')] (polygonObject) {

        var current = editor.selection.current;
        if (current) {
            if (current.is('svg-polygon')) {
                current.updatePolygonItem(polygonObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
    
                this.emit('refreshSelectionStyleView')
                this.emit('refreshCanvasForPartial', current);

            }
        }

    }    

    [POINTERSTART('$selectionView .selection-tool-item') + MOVE() + END()] (e) {
        this.$target = e.$delegateTarget;
        this.pointerType = e.$delegateTarget.attr('data-position')

        if (this.pointerType === 'path' || this.pointerType === 'polygon') {
            this.trigger('openPathEditor');
            return false;
        }

        this.refs.$selectionTool.attr('data-selected-position', this.pointerType);

        this.parent.selectCurrent(...editor.selection.items)

        editor.selection.setRectCache(this.pointerType === 'move' ? false: true);        

        this.initSelectionTool();
    }

    move (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }

        this.refreshSelectionToolView(dx, dy);
        this.parent.updateRealPosition();    
        this.emit('refreshCanvasForPartial')         
        // this.emit('refreshRedGL', false)        
    }

    end (dx, dy) {

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }
                
        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refreshSelectionToolView(dx, dy);
        this.parent.trigger('removeRealPosition');                
        // this.initSelectionTool();

        // this.emit('refreshRedGL', false)
        this.emit('refreshCanvasForPartial')
        this.emit('refreshStyleView');
        this.emit('removeGuideLine')
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

        var current = editor.selection.current;
        if (current) {
            var isPath = current.is('svg-path');
            this.refs.$selectionTool.toggleClass('path', isPath);            

            var isPolygon = current.is('svg-polygon');
            this.refs.$selectionTool.toggleClass('polygon', isPolygon);
        }

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

    isNoMoveArea () {
        return editor.selection.items.length === 1 && editor.selection.current.is('redgl-canvas', 'text')
    }

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 

        this.guideView.recoverAll();

        var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;


        if (this.isNoMoveArea()) {
            this.refs.$selectionTool.addClass('remove-move-area')
        } else {
            this.refs.$selectionTool.removeClass('remove-move-area')
        }

        this.refs.$selectionTool.cssText(`left: ${x};top:${y};width:${width};height:${height}`)

        var newX = Length.px(x.value - editor.selection.currentArtboard.x.value / editor.scale).round(1);
        var newY = Length.px(y.value - editor.selection.currentArtboard.y.value / editor.scale).round(1);
        var newWidth = Length.px(width.value / editor.scale).round(1);
        var newHeight = Length.px(height.value / editor.scale).round(1);

        switch(this.pointerType) {
        case 'move': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}`); break; 
        case 'to right': this.$target.attr('data-position-text', `W: ${newWidth}`); break; 
        case 'to left': this.$target.attr('data-position-text', `X: ${newX}, W: ${newWidth}`); break; 
        case 'to top': this.$target.attr('data-position-text', `Y: ${newY}, H: ${newHeight}`); break; 
        case 'to bottom': this.$target.attr('data-position-text', `H: ${newHeight}`); break; 
        case 'to top right': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY} W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to top left': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to bottom right': this.$target.attr('data-position-text', `W: ${newWidth}, H: ${newHeight}`); break; 
        case 'to bottom left': this.$target.attr('data-position-text', `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`); break; 
        }
        
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
        editor.selection.setRectCache();        

        this.initSelectionTool();
    }

    
} 