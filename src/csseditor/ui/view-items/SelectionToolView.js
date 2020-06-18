import UIElement, { EVENT } from "../../../util/UIElement";
import { POINTERSTART, MOVE, END, BIND, IF, CLICK } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { isNotUndefined } from "../../../util/functions/func";
import GuideView from "../view/GuideView";
import AreaItem from "../../../editor/items/AreaItem";
import icon from "../icon/icon";

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

var iconType = {
    'artboard': 'artboard',
    'rect': 'rect',
    'circle': 'lens',
    'text': 'title',
    'image': 'image',
    'svg-path': 'edit',
    'svg-textpath': 'text_rotate',
    'svg-text': 'title',
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
    }

    [EVENT('openPathEditor')] () {
        var current = this.$selection.current;
        if (current && current.is('svg-path', 'svg-brush', 'svg-textpath')) {
            this.toggleEditingPath(true);

            // box 모드 
            // box - x, y, width, height 고정된 상태로  path 정보만 변경 
            // canvas - x, y, width, height 를 path 좌표로 재구성 
            this.emit('showPathEditor', 'modify', {
                changeEvent: 'updatePathItem',
                current,
                d: current.d,
                // box: current.is('svg-textpath') ? 'box': 'canvas', 
                box: 'box',
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

    [EVENT('updatePathItem')] (pathObject) {

        var current = this.$selection.current;
        if (current) {
            if (current.updatePathItem) {
                current.updatePathItem(pathObject);

                this.parent.selectCurrent(...this.$selection.items)

                this.$selection.setRectCache();        
                    
                this.emit('refreshSelectionStyleView', current, true, true);

            }
        }

    } 


    [EVENT('refreshSelectionTool')] () { 
        this.initSelectionTool();
    }

    [EVENT('makeSelectionTool')] (isScale) {
        if (isScale) {
            this.removeOriginalRect()   
        }
        let drawList = this.guideView.calculate();

        this.makeSelectionTool();

        if (this.$selection.length === 0){
            drawList = []                
        }

        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));
    }

}

const SelectionToolBind = class extends SelectionToolEvent {

    [BIND('$selectionTool')] () {

        var current = this.$selection.current;
        var isLayoutItem = current && current.isLayoutItem()
        var hasLayout = current && current.hasLayout()
        var layout = current && (current.layout || current.parent.layout);

        return {
            'data-is-layout-item': isLayoutItem,
            'data-is-layout-container': hasLayout,
            'data-layout-container': layout,
            // 1개의 객체를 선택 했을 때 move 판은 이벤트를 걸지 않기 
            'data-selection-length': this.$selection.length
        }
    }
}

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class SelectionToolView extends SelectionToolBind {

    initialize() {
        super.initialize();

        this.guideView = new GuideView(this.$editor);
    }

    template() {
        return /*html*/`
    <div class='selection-view' ref='$selectionView' >
        <div class='selection-tool' ref='$selectionTool' style='left:-100px;top:-100px;'>
            <div class='selection-tool-item' data-position='move' ref='$selectionMove' title='move'>
                <span class='icon' ref='$selectionIcon'>${icon.flag}</span>
                <span ref='$selectionTitle'></span>
            </div>       
            <div class='selection-tool-item' data-position='to top'></div>            
            <div class='selection-tool-item' data-position='to bottom'></div>            
            <div class='selection-tool-item' data-position='to left'></div>            
            <div class='selection-tool-item' data-position='to right'></div>
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
    
    checkEditMode () {
        return this.$editor.isSelectionMode(); 
    }

    [POINTERSTART('$selectionView .selection-tool-item') + IF('checkEditMode') + MOVE() + END()] (e) {
        this.initMoveType(e.$dt);

        this.parent.selectCurrent(...this.$selection.items)

        this.$selection.setRectCache(this.pointerType === 'move' ? false: true);

        this.initSelectionTool();
    }

    initMoveType ($target) {

        this.$target = $target || this.refs.$selectionTool.$('.selection-tool-item[data-position="move"]');

        if (this.$target) {
            this.pointerType = this.$target.attr('data-position')

            this.refs.$selectionTool.attr('data-selected-position', this.pointerType);
            this.refs.$selectionTool.attr('data-selected-movetype', moveType[this.pointerType]);
        }
    }

    move (dx, dy) {

        var e = this.$config.get('bodyEvent');


        if (e.shiftKey) {
            dy = dx; 
        }

        this.refreshSelectionToolView(dx, dy);
        this.parent.updateRealPosition();    
        this.emit('refreshSelectionDragStyleView', null, true)     
    }

    [EVENT('moveByKey')] (dx, dy) {

        if (dx === 0 && dy === 0) {
            return;  
        }

        this.pointerType = 'move'; 
        this.$selection.move(dx, dy);
        this.parent.selectCurrent(...this.$selection.items)

        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refs.$selectionTool.attr('data-selected-movetype', '');

        this.guideView.move(this.pointerType, dx,  dy)

        var drawList = this.guideView.calculate();
        this.emit('refreshGuideLine', this.calculateWorldPositionForGuideLine(drawList));                    

        this.makeSelectionTool();           
    }

    end () {
        this.refs.$selectionTool.attr('data-selected-position', '');
        this.refs.$selectionTool.attr('data-selected-movetype', '');


        this.$selection.setRectCache();

        this.emit('refreshAllElementBoundSize');
        this.emit('removeGuideLine')
    }   

    refreshSelectionToolView (dx, dy, type) {
        if (dx === 0 && dy === 0) {
            // console.log(' not moved', dx, dy)
        } else {
            this.guideView.move(type || this.pointerType, dx / this.$editor.scale,  dy / this.$editor.scale )

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

        var current = this.$selection.current;
        if (current) {
            var isPath = current.is('svg-path', 'svg-brush', 'svg-textpath');
            this.refs.$selectionTool.toggleClass('path', isPath);            
        }

        if (this.$editor.isSelectionMode() && this.$el.isHide()) {
            this.$el.show();
        }

        this.bindData('$selectionTool')

        this.makeSelectionTool();

    }    

    makeSelectionTool() {

        // selection 객체는 하나만 만든다. 
        this.guideView.recoverAll();

        var x = Length.px(0), y = Length.px(0), width = Length.px(0), height = Length.px(0);

        if (this.guideView.rect) {
            var {x, y, width, height} = this.calculateWorldPosition(this.guideView.rect) ;
        }

        if(x.is(0) && y.is(0) && width.is(0) && height.is(0)) {
            x.add(-10000);
            y.add(-10000);       
        } else if (!this.$selection.currentArtboard) {
            x.add(-10000);
            y.add(-10000);            
        }

        var left = x, top = y;

        this.refs.$selectionTool.css({ left, top, width, height })
        
        this.refreshPositionText(x, y, width, height)

    }


    refreshPositionText (x, y, width, height) {

        if (this.$selection.currentArtboard) {
            var newX = Length.px(x.value - this.$selection.currentArtboard.x.value / this.$editor.scale).round(1);
            var newY = Length.px(y.value - this.$selection.currentArtboard.y.value / this.$editor.scale).round(1);
            var newWidth = Length.px(width.value / this.$editor.scale).round(1);
            var newHeight = Length.px(height.value / this.$editor.scale).round(1);

            var text = ''
            switch(this.pointerType) {
                case 'move': text =  `X: ${newX}, Y: ${newY}`; break;
                case 'to top': text =  `Y: ${newY}, H: ${newHeight}`; break;         
                case 'to bottom': text =  `Y: ${newY}, H: ${newHeight}`; break;
                case 'to left': text =  `X: ${newX}, W: ${newWidth}`; break;
                case 'to right': text =  `X: ${newX}, W: ${newWidth}`; break;
                case 'to top right': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
                case 'to top left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
                case 'to bottom right': text =  `W: ${newWidth}, H: ${newHeight}`; break;
                case 'to bottom left': text =  `X: ${newX}, Y: ${newY}, W: ${newWidth}, H: ${newHeight}`; break;
            }
            
            this.setPositionText(text);

            var length = this.$selection.length;
            var title = ''; 

            if (length === 1) {
                var current = this.$selection.current
                title = current.title || current.getDefaultTitle();
                const iconString = icon[iconType[current.itemType] || iconType.rect]
                this.refs.$selectionIcon.html(iconString);  
            } else if (length >= 2) {
                title = `multi : ${length}`;
                this.refs.$selectionIcon.html(icon.flag);                
            }
 
            this.refs.$selectionTitle.text(title)
            this.refs.$selectionMove.attr('title', title)
        }
    }

    setPositionText (text) {
        if (this.$target) {

            if (this.$selection.current && this.$selection.current.is('artboard')) {
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

            if (isNotUndefined(it.ax)) { ax = it.ax * this.$editor.scale }
            if (isNotUndefined(it.bx)) { bx = it.bx * this.$editor.scale }
            if (isNotUndefined(it.ay)) { ay = it.ay * this.$editor.scale }
            if (isNotUndefined(it.by)) { by = it.by * this.$editor.scale }

            return { A,  B, ax,  bx, ay, by}
        })
    }

    calculateWorldPosition (item) {
        return {
            x: Length.px(item.screenX.value * this.$editor.scale),
            y: Length.px(item.screenY.value * this.$editor.scale),
            width: Length.px(item.width.value  *  this.$editor.scale),
            height: Length.px(item.height.value  * this.$editor.scale),
            transform: item.transform
        }
    }

    
} 