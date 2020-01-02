import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, IF, CLICK } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "./GuideView";
import { Transform } from "../../../editor/css-property/Transform";
import Dom from "../../../util/Dom";
import { calculateAngle } from "../../../util/functions/math";
import AreaItem from "../../../editor/items/AreaItem";

var moveType = {
    'move': 'move',
    'to top': 'move',    
    'to top right': 'move',
    'to top left': 'move',
    'to bottom': 'move',    
    'to bottom right': 'move',
    'to bottom left': 'move',
    'to left': 'move',    
    'to right': 'move',
    'translate': 'transform',
    'transform-origin': 'transform',
    'rotate3d': 'transform'
}

const SelectionToolEvent = class  extends UIElement {

    [EVENT('hideSelectionToolView')] () {
        this.refs.$selectionTool.css({
            left: '-10000px',
            top: '-10000px'
        })
    }

    [EVENT('hideSubEditor')] (e) {
        this.toggleEditingPath(false);
        this.toggleEditingPolygon(false);
    }

    [EVENT('openPathEditor')] () {
        var current = editor.selection.current;
        if (current && current.is('svg-path', 'svg-textpath')) {
            this.toggleEditingPolygon(false);
            this.toggleEditingPath(true);

            this.emit('showPathEditor', 'modify', {
                changeEvent: 'updatePathItem',
                current,
                d: current.d,
                box: current.is('svg-textpath') ? 'box': 'canvas', 
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
                changeEvent: 'updatePolygonItem',
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
            if (current.updatePathItem) {
                current.updatePathItem(pathObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
                    
                this.emit('refreshSelectionStyleView', current, true, true);

            }
        }

    }


    [EVENT('updatePolygonItem')] (polygonObject) {

        var current = editor.selection.current;
        if (current) {
            if (current.updatePolygonItem) {
                current.updatePolygonItem(polygonObject);

                this.parent.selectCurrent(...editor.selection.items)

                editor.selection.setRectCache();        
    
                this.emit('refreshSelectionStyleView', current, true, true);

            }
        }

    }    


    [EVENT('refreshSelectionTool', 'initSelectionTool')] () { 
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] (isScale) {
        if (isScale) {
            this.removeOriginalRect()   
        }
        let drawList = this.guideView.calculate();

        this.makeSelectionTool();

        if (editor.selection.length === 0){
            drawList = []                
        }

        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));
    }

}

const SelectionToolBind = class extends SelectionToolEvent {

    [BIND('$selectionTool')] () {

        var current = editor.selection.current;
        var isLayoutItem = current && current.isLayoutItem()
        var hasLayout = current && current.hasLayout()
        var layout = current && (current.layout || current.parent.layout);

        return {
            'data-is-layout-item': isLayoutItem,
            'data-is-layout-container': hasLayout,
            'data-layout-container': layout,
            // 1개의 객체를 선택 했을 때 move 판은 이벤트를 걸지 않기 
            'data-selection-length': editor.selection.length
        }
    }
}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends SelectionToolBind {

    initialize() {
        super.initialize();

        this.guideView = new GuideView();
    }

    template() {
        return /*html*/`
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool' style='left:-100px;top:-100px;'>
            <div class='selection-tool-item' data-position='move'></div>       

            <div class='selection-tool-item' data-position='to top'></div>
            <div class='selection-tool-item' data-position='to right'></div>
            <div class='selection-tool-item' data-position='to bottom'></div>
            <div class='selection-tool-item' data-position='to left'></div>
            <div class='selection-tool-item' data-position='to top right'></div>
            <div class='selection-tool-item' data-position='to bottom right'></div>
            <div class='selection-tool-item' data-position='to top left'></div>
            <div class='selection-tool-item' data-position='to bottom left'></div>
        </div>
        <div class='selection-pointer' ref='$selectionPointer'></div>
    </div>`
    }

    [CLICK('$selectionTool .selection-tool-item[data-position="path"]')] (e) {
        this.trigger('openPathEditor');
    }        

    toggleEditingPath (isEditingPath) {
        this.refs.$selectionTool.toggleClass('editing-path', isEditingPath);
    }

    toggleEditingPolygon (isEditingPolygon) {
        this.refs.$selectionTool.toggleClass('editing-polygon', isEditingPolygon);
    }   
    
    checkEditMode () {
        return editor.isSelectionMode(); 
    }

    [POINTERSTART('$selectionView .selection-tool-item') + IF('checkEditMode') + MOVE() + END()] (e) {
        this.$target = e.$delegateTarget;
        this.pointerType = e.$delegateTarget.attr('data-position')

        this.refs.$selectionTool.attr('data-selected-position', this.pointerType);
        this.refs.$selectionTool.attr('data-selected-movetype', moveType[this.pointerType]);        
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
        this.emit('refreshCanvasForPartial', null, false)     
        

        if (this.pointerType === 'move') {

        } else {
            editor.selection.each(item => {
                if (item.is('component')) {
                    this.emit('refreshStyleView', item);  
                }
            });
        }

    }

    [EVENT('moveByKey')] (dx, dy) {

        if (dx === 0 && dy === 0) {
            return;  
        }

        this.pointerType = 'move'; 
        editor.selection.move(dx, dy);
        this.parent.selectCurrent(...editor.selection.items)

        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refs.$selectionTool.attr('data-selected-movetype', '');

        this.guideView.move(this.pointerType, dx,  dy)

        var drawList = this.guideView.calculate();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));                    

        this.makeSelectionTool();           
    }

    end (dx, dy) {

        if (this.pointerType === 'move') {
            if (dx === 0 && dy === 0) {
                this.trigger('openPathEditor');
                return; 
            }
        }

        var e = editor.config.get('bodyEvent');

        if (e.altKey) {
            dy = dx; 
        }

        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refs.$selectionTool.attr('data-selected-movetype', '');

        this.emit('refreshCanvasForPartial', null, false, true)
        this.refreshSelectionToolView(dx, dy);   

        this.emit('refreshAllElementBoundSize');            

        this.emit('removeGuideLine')
    }   

    refreshSelectionToolView (dx, dy, type) {
        if (dx === 0 && dy === 0) {
            // console.log(' not moved', dx, dy)
        } else {
            this.guideView.move(type || this.pointerType, dx / editor.scale,  dy / editor.scale )

            var drawList = this.guideView.calculate();
            this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));            
        }

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


    removeOriginalRect () {
        this.originalArtboardRect = null
        this.originalRect = null
    }

    initSelectionTool() {

        this.removeOriginalRect();

        this.guideView.makeGuideCache();        

        var current = editor.selection.current;
        if (current) {
            var isPath = current.is('svg-path', 'svg-textpath');
            this.refs.$selectionTool.toggleClass('path', isPath);            

            var isPolygon = current.is('svg-polygon');
            this.refs.$selectionTool.toggleClass('polygon', isPolygon);
        }

        if (editor.isSelectionMode() && this.$el.isHide()) {
            this.$el.show();
        }

        this.bindData('$selectionTool')

        this.makeSelectionTool();

    }    

    isNoMoveArea () {
        return editor.selection.items.length === 1 && editor.selection.current.is('text')
    }

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 
        this.guideView.recoverAll();

        var x = Length.px(0), y = Length.px(0), width = Length.px(0), height = Length.px(0);

        if (this.guideView.rect) {
            var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;
        }

        if (this.isNoMoveArea()) {
            this.refs.$selectionTool.addClass('remove-move-area')
        } else {
            this.refs.$selectionTool.removeClass('remove-move-area')
        }

        if(x.is(0) && y.is(0) && width.is(0) && height.is(0)) {
            x.add(-10000);
            y.add(-10000);       
        } else if (!editor.selection.currentArtboard) {
            x.add(-10000);
            y.add(-10000);            
        }

        var left = x, top = y;

        this.refs.$selectionTool.css({ left, top, width, height })
        
        this.refreshPositionText(x, y, width, height)

    }


    refreshPositionText (x, y, width, height) {

        if (editor.selection.currentArtboard) {
            var newX = Length.px(x.value - editor.selection.currentArtboard.x.value / editor.scale).round(1);
            var newY = Length.px(y.value - editor.selection.currentArtboard.y.value / editor.scale).round(1);
            var newWidth = Length.px(width.value / editor.scale).round(1);
            var newHeight = Length.px(height.value / editor.scale).round(1);

            var text = ''
            switch(this.pointerType) {
            case 'move': text =  `X: ${newX}, Y: ${newY}`; break;
            case 'to right': text =  `W: ${newWidth}`; break;
            case 'to left': text =  `X: ${newX}, W: ${newWidth}`; break;
            case 'to top': text =  `Y: ${newY}, H: ${newHeight}`; break;
            case 'to bottom': text =  `H: ${newHeight}`; break;
            case 'to top right': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            case 'to top left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            case 'to bottom right': text =  `W: ${newWidth}, H: ${newHeight}`; break;
            case 'to bottom left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            }
            
            this.setPositionText(text);
        }
    }

    setPositionText (text) {
        if (this.$target) {

            if (editor.selection.current && editor.selection.current.is('artboard')) {
                text = text.split(',').filter(it => {
                    return !it.includes('X:') && !it.includes('Y:');
                }).join(',');
            }

            this.$target.attr('data-position-text', text);
        }

    }
    

    calculateWorldPositionForGuideLine (list = []) {
        return list.map(it => {

            var A = new AreaItem(this.calculateWorldPosition(it.A))
            var B = new AreaItem(this.calculateWorldPosition(it.B))

            var ax, bx, ay, by; 

            if (isNotUndefined(it.ax)) { ax = it.ax * editor.scale }
            if (isNotUndefined(it.bx)) { bx = it.bx * editor.scale }
            if (isNotUndefined(it.ay)) { ay = it.ay * editor.scale }
            if (isNotUndefined(it.by)) { by = it.by * editor.scale }

            return { A,  B, ax,  bx, ay, by}
        })
    }

    calculateWorldPosition (item) {
        return {
            x: Length.px(item.screenX.value * editor.scale),
            y: Length.px(item.screenY.value * editor.scale),
            width: Length.px(item.width.value  *  editor.scale),
            height: Length.px(item.height.value  * editor.scale),
            transform: item.transform
        }
    }

    
} 