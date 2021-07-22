import { POINTERSTART, MOVE, END, IF } from "el/base/Event";
import { Length } from "el/editor/unit/Length";
import Dom from "el/base/Dom";
import { KEY_CODE } from "el/editor/types/key";

import { EditorElement } from "el/editor/ui/common/EditorElement";

import './DragAreaView.scss';

export default class DragAreaView extends EditorElement {

    initState() {
        return {
            mode: 'selection',
            x: Length.z(),
            y: Length.z(),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
            html: '',
        }
    }

    template() {
        return /*html*/`
            <div class="elf--drag-area-view" ref="$dragAreaView"></div>            
        `
    }


    checkSelectionArea (e) {
        const mousePoint = this.$viewport.getWorldPosition(e);        

        // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
        if (this.$selection.hasPoint(mousePoint)) {
            return true;
        }            
    }

    checkEmptyElement (e) {
        var $el = Dom.create(e.target)

        // hand tool 이 on 되어 있으면 드래그 하지 않는다. 
        if (this.$config.get('set.tool.hand')) {
            return false; 
        }

        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {        // space 키가 눌러져있을 때는 실행하지 않는다. 
            return false;
        } 

        const mousePoint = this.$viewport.getWorldPosition(e);        

        if (this.state.mode !== 'selection') {
            return false; 
        }

        // altKey 를 누르고 있으면 동작하지 않음 
        // altKey 는 복제용도로 사용함 
        if (e.altKey) {
            return false; 
        }

        // artboard 에서 드래그 할 수 있도록 예외 처리 
        if ($el.hasClass('artboard')) {
            if (this.$selection.check({ id: $el.attr('data-id') })) {
                // selection 이 이미 되어 있는 상태면 선택 영역을 그리지 않는다. 
                return false; 
            }

            // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
            if (this.$selection.hasPoint(mousePoint)) {
                return false;
            }            

            return true; 
        }

        // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
        if (this.$selection.hasPoint(mousePoint)) {
            return false;
        }            

        if ($el.hasClass('is-not-drag-area')) {
            return false; 
        }

        if ($el.closest('element-item')) {
            return false;
        }

        return $el.hasClass('element-item') === false
            && $el.hasClass('selection-tool-item') === false 
            && $el.hasClass('pointer') === false
            && $el.hasClass('rotate-pointer') === false            
            && $el.hasClass('layer-add-view') === false                        
            && $el.hasClass('handle') === false            
            && $el.hasClass('path-draw-container') === false
            && $el.isTag('svg') === false 
            && $el.isTag('path') === false
            && $el.isTag('textPath') === false
            && $el.isTag('polygon') === false
            && $el.isTag('text') === false
            && $el.isTag('img') === false 
            && $el.attr('data-segment') !== 'true';
    }
    

    [POINTERSTART('$dragAreaView') + IF('checkEmptyElement') + MOVE('movePointer') + END('moveEndPointer')] (e) {
        this.emit('startDragAreaView');
    }


    movePointer (dx, dy) {
        this.emit('moveDragAreaView');        
    }

    moveEndPointer () {
        this.emit('endDragAreaView');
    }
}