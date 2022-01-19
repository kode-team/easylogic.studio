import { POINTERSTART, IF, SUBSCRIBE } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import { KEY_CODE } from "el/editor/types/key";
import { END, MOVE } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './DragAreaView.scss';
import { vec3 } from "gl-matrix";

export default class DragAreaView extends EditorElement {

    initState() {
        return {
            mode: 'selection',
            x: 0,
            y: 0,
            width: 10000,
            height: 10000,
            cachedCurrentElement: {},
            html: '',
        }
    }

    template() {
        return /*html*/`
            <div class="elf--drag-area-view" ref="$dragAreaView"></div>            
        `
    }


    checkSelectionArea(e) {
        const mousePoint = this.$viewport.getWorldPosition(e);

        // select된 객체에 포지션이 있으면  움직일 수 있도록 한다. 
        if (this.$selection.hasPoint(mousePoint)) {
            return true;
        }
    }


    /**
     * 레이어를 움직이기 위한 이벤트 실행 여부 체크 
     * 
     * @param {PointerEvent} e 
     */
    checkEditMode(e) {

        // hand tool 이 on 되어 있으면 드래그 하지 않는다. 
        if (this.$config.get('set.tool.hand')) {
            return false;
        }

        // space 키가 눌러져있을 때는 실행하지 않는다. 
        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {
            return false;
        }


        // selection 영역에 속할 때 
        const mousePoint = this.$viewport.getWorldPosition(e);
        this.inSelection = false;
        if (this.$selection.hasPoint(mousePoint)) {
            this.inSelection = true;

            // 선택한 영역이 artboard 이고, 하위 레이어가 있다면 움직이지 않는다. 
            if (this.$selection.current.is('artboard')) {
                if (this.$selection.current.hasChildren()) {
                    // drag 모드로 변신 
                    this.$config.init('set.dragarea.mode', true);
                    this.$config.init('set.move.mode', false);

                    return true;
                } else {
                    // 움직임 
                    this.$config.init('set.dragarea.mode', false);
                    this.$config.init('set.move.mode', true);

                    return true;
                }
            } else {
                // 움직임 
                this.$config.init('set.dragarea.mode', false);
                this.$config.init('set.move.mode', true);
                return true;
            }
        }

        this.mouseOverItem = this.$selection.filteredLayers[0];

        if (this.mouseOverItem) {
            // move 모드로 변신 
            this.$config.init('set.dragarea.mode', false);
            this.$config.init('set.move.mode', true);

        } else {
            // drag 모드로 변신 
            this.$config.init('set.dragarea.mode', true);
            this.$config.init('set.move.mode', false);

        }

        return true;
    }

    [POINTERSTART('$dragAreaView') + IF('checkEditMode') + MOVE('movePointer') + END('moveEndPointer')](e) {

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('startDragAreaView');
        } else if (this.$config.get('set.move.mode')) {


            // 움직임 처리 
            this.initMousePoint = this.$viewport.getWorldPosition();

            this.mouseOverItem = this.$selection.filteredLayers[0];

            // mouse point 기준으로 item 찾기 구현 필요 
            // shift key 를 누른 상태로 선택 안되어 있는 객체나, 선택 되어 있는 객체를 체크 해야함 

            // alt(option) + pointerstart 시점에 Layer 카피하기         
            if (e.altKey) {

                if (this.$selection.isEmpty === false && this.$selection.hasPoint(this.initMousePoint)) {
                    // 선택된 모든 객체 카피하기 
                    this.$selection.selectAfterCopy();
                    this.trigger('refreshAllCanvas')
                    this.emit('refreshLayerTreeView')

                    // this.selectCurrent(...this.$selection.items)
                    this.initializeDragSelection();
                    this.emit('history.refreshSelection');
                }

            } else {
                // mouse over item 이 있을 때 
                if (this.mouseOverItem) {
                    const id = this.mouseOverItem.id;

                    // shift key 는 selection 을 토글한다. 
                    if (e.shiftKey) {
                        this.$selection.toggleById(id);
                    } else {
                        // 선택이 안되어 있으면 선택 
                        if (this.$selection.check({ id }) === false) {

                            const current = this.$model.get(id);
                            if (current && current.is('artboard') && current.hasChildren()) {
                                // NOOP
                                // artboard 인데 자식이 있으면 선택을 하지 않는다. 
                            } else {
                                this.$selection.selectByGroup(id);
                            }

                        }
                    }

                }


                this.initializeDragSelection();
                this.emit('history.refreshSelection');
            }

        }

    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();

        this.emit('refreshSelectionTool', true);
    }



    movePointer(dx, dy) {
        if (this.$config.get('set.dragarea.mode')) {
            this.emit('moveDragAreaView');
        } else if (this.$config.get('set.move.mode')) {
            // 움직임 처리 

            // // layout item 은 움직이지 않고 layout 이 좌표를 그리도록 한다. 
            // if (this.$selection.isLayoutItem) {
            //     return;
            // }

            // const targetMousePoint = this.$viewport.getWorldPosition();

            // const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

            // this.moveTo(newDist);

            // // 최종 위치에서 ArtBoard 변경하기 
            // if (this.$selection.changeArtBoard()) {
            //     this.initMousePoint = targetMousePoint;
            //     this.$selection.reselect();
            //     this.$snapManager.clear();

            //     this.emit('refreshAllCanvas')

            //     // ArtBoard 변경 이후에 LayerTreeView 업데이트
            //     this.emit('refreshLayerTreeView')
            // }

            // this.emit('setAttributeForMulti', this.$selection.pack('x', 'y'));
            // this.emit('refreshSelectionTool', true);
        }

    }


    moveEndPointer() {

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('endDragAreaView');
        } else if (this.$config.get('set.move.mode')) {

            // const targetMousePoint = this.$viewport.getWorldPosition();
            // const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));



            // if (newDist < 1) {
            //     if (this.$selection.current.isSVG()) {
            //         this.emit('open.editor');
            //         this.emit('removeGuideLine');
            //         return;
            //     }
            // } else {
            //     this.$selection.reselect();
            //     this.$snapManager.clear();
            //     // this.emit('removeGuideLine');
            //     this.command(
            //         'setAttributeForMulti',
            //         "move item",
            //         this.$selection.pack('x', 'y')
            //     );
            // }

            // this.emit('refreshSelectionTool', true);
        }
        this.$config.init('set.dragarea.mode', false)
        this.$config.init('set.move.mode', false)

    }
}