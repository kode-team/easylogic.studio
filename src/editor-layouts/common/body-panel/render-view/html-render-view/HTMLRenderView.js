import { vec3 } from "gl-matrix";

import { BIND, POINTERSTART, IF, KEYUP, DOUBLECLICK, FOCUSOUT, SUBSCRIBE, CONFIG, DEBOUNCE, FRAME } from "el/sapa/Event";
import Dom from "el/sapa/functions/Dom";
import { clone, isFunction } from "el/sapa/functions/func";
import { KEY_CODE } from "el/editor/types/key";
import { END, FIRSTMOVE, MOVE } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import StyleView from "./StyleView";

import './HTMLRenderView.scss';
import { createComponent } from "el/sapa/functions/jsx";

export default class HTMLRenderView extends EditorElement {

    /** initialize setting */
    components() {
        return {
            StyleView,
        }
    }

    initState() {
        return {
            mode: 'selection',
            x: 0,
            y: 0,
            width: 10000,
            height: 10000,
            cachedCurrentElement: {},
        }
    }

    /** template */
    template() {
        return /*html*/`
            <div class='elf--element-view' ref='$body'>
                ${createComponent('StyleView', { ref: '$styleView'})}
                <div class='canvas-view' 
                        data-renderer-id='${this.$editor.EDITOR_ID}' 
                        ref='$view' 
                        data-outline="${this.$config.get('show.outline')}"
                ></div>
                ${this.$injectManager.generate("render.view")}
            </div>
        `
    }


    [BIND('$body')]() {
        const { canvasWidth, canvasHeight } = this.$editor;

        var width = canvasWidth;
        var height = canvasHeight;

        return {
            'tabIndex': -1,
            style: {
                width,
                height,
            }
        }
    }

    [BIND('$view')]() {

        const { translate, transformOrigin: origin, scale } = this.$viewport;

        const transform = `translate(${translate[0]}px, ${translate[1]}px) scale(${scale || 1})`;
        const transformOrigin = `${origin[0]}px ${origin[1]}px`

        return {
            style: {
                'transform-origin': transformOrigin,
                transform
            }
        }
    }


    /**
     * initialize message 
     */
    [CONFIG('show.outline')] () {
        this.refs.$view.attr('data-outline', this.$config.get('show.outline'));
    }

    [SUBSCRIBE('refElement')](id, callback) {
        isFunction(callback) && callback(this.getElement(id))
    }


    // 객체를 부분 업데이트 하기 위한 메소드 
    [SUBSCRIBE('refreshSelectionStyleView')](obj) {
        this.refreshSelectionStyleView(obj);
    }    


    [SUBSCRIBE('updateViewport')]() {
        this.bindData('$view');
    }

    /**
     * 기본 커서 제어 
     */
    [CONFIG('bodyEvent')]() {

        // TODO: 커서를 제어하는 element 가 아니면 기본 커서로 지정해야할 듯 
        const number = Dom.create(this.$config.get('bodyEvent').target).data('number')

        if (!number) {
            this.emit('recoverCursor')
        }
    }    

    [SUBSCRIBE('refreshAllElementBoundSize')]() {
        this.refreshAllElementBoundSize();
    }

    [SUBSCRIBE('refreshElementBoundSize') + FRAME] (parentObj) {
        this.refreshElementBoundSize(parentObj);
    }    


    [SUBSCRIBE('updateAllCanvas')](parentLayer) {
        this.updateAllCanvas(parentLayer);
    }

    /**
     * canvas 전체 다시 그리기 
     */
     [SUBSCRIBE('refreshAllCanvas')]() {
        this.refreshAllCanvas();
    }    


    [SUBSCRIBE('playTimeline', 'moveTimeline')]() {

        const project = this.$selection.currentProject;
        var timeline = project.getSelectedTimeline();

        if (timeline) {
            timeline.animations.map(it => this.$model.get(it.id)).forEach(current => {
                this.updateTimelineElement(current, true, false);
            })
        }

    }


    /**
     * Interfaction (Dom Event)
     */

    /**
     * 캐쉬된 element 를 모두 삭제함 
     * 캐쉬된 element 는  몇 가지 용도에 의해서 update 할 때 실제 객체를 넘겨주게 되어 있음. 
     * 
     * 1. HTMLRenderView 는 html element 로 렌더링을 하기 때문에 렌더링 주체를 가지고 있어야 함. 
     * 2. svg 관련 객체의 경우 element 를 가지고 내부의 path 를 조회해서 좌표가 존재하는지 체크할 수 있어야 함. 
     */
    clearElementAll() {
        this.state.cachedCurrentElement = {};
    }

    clearElement(id) {
        this.state.cachedCurrentElement[id] = undefined
    }

    getElement(id) {

        if (!this.state.cachedCurrentElement[id]) {
            this.state.cachedCurrentElement[id] = this.refs.$view.$(`[data-id="${id}"]`);
        }

        return this.state.cachedCurrentElement[id];
    }

    // text 의 경우 doubleclick 을 해야 포커스를 줄 수 있고 
    // 그 이후에 편집이 가능하다. 
    [DOUBLECLICK('$view .element-item.text .text-content')](e) {
        e.$dt.addClass('focused');
        e.$dt.attr('contenteditable', 'true');
        e.$dt.focus();
        e.$dt.select();
    }

    [FOCUSOUT('$view .element-item.text .text-content')](e) {
        e.$dt.removeAttr('contenteditable');
        e.$dt.removeClass('focused');
    }

    [KEYUP('$view .element-item.text .text-content')](e) {

        var content = e.$dt.html()
        var text = e.$dt.text();
        var id = e.$dt.parent().attr('data-id');
        //FIXME: matrix에 기반한 좌표 연산이 필요하다. 

        var arr = []
        this.$selection.items.filter(it => it.id === id).forEach(item => {
            item.reset({
                content,
                text,
            })
            arr.push({ id: item.id, content, text })

            var $el = this.getElement(item.id);

            const { width, height } = $el.offsetRect();
            item.reset({
                width,
                height
            })

            this.emit('refreshSelectionStyleView', item);
        })



        this.emit('refreshContent', arr);

        this.emit('refreshSelectionTool', false);
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

        // 전체 캔버스 영역을 클릭하면 selection 하지 않는다. 
        const $target = Dom.create(e.target);
        if ($target.hasClass('canvas-view')) {
            return false;
        }

        if (!e.shiftKey) {
            const mousePoint = this.$viewport.getWorldPosition(e);
            if (this.$selection.hasPoint(mousePoint)) {
    
                // selection 영역과 hover item 이 겹치면  hover item 을 선택한걸로 한다. 
                if (this.$selection.hasHoverItem()) {
                    // selection 영역이 동일하고 
                    // hover 된 id 가 부모가 아니면 
                    // hover 된 아이템을 선택하게 된다. 
                    if (this.$selection.hasParent(/*parentId*/this.$selection.hoverId) === false) {
                        this.$selection.selectHoverItem();
                    }
    
                }
    
                return true;
            }

            // hover item 이 있으면 클릭 대상이 있다고 간주한다. 
            if (this.$selection.hasHoverItem()) { 
                this.$selection.selectHoverItem();
                return true;
            }
        }


        const $element = $target.closest('element-item');

        if ($element) {
            // text 에 focus 가 가있는 경우는 움직이지 않는다. 
            if ($element.hasClass('focused')) {
                return false;
            }

            var id = $element.attr('data-id')

            // altKey 눌러서 copy 하지 않고 드랙그만 하게 되면  
            if (e.altKey === false) {
                const item = this.$model.get(id);

                // artboard 가 자식이 있으면 움직이지 않음 
                if (item.is('artboard') && item.hasChildren()) {
                    this.$config.init('set.dragarea.mode', true);
                    return true;
                }

            }

        } else {
            // 움직일 수 있는 영역이 아니기 때문에 false 리턴해서 드래그를 막는다. 
            return false;
        }


        return true;
    }

    [DOUBLECLICK('$view')](e) {

        const $item = Dom.create(e.target).closest('element-item');

        if ($item) {
            const id = $item.attr('data-id');

            this.nextTick(() => {
                this.emit('doubleclick.item', e, id);
            }, 100)
    
        }
    }

    /**
     * 드래그 해서 객체 옮기기 
     *
     * ctrl + pointerstart 하는  시점에 카피해보자.  
     * 
     * @param {PointerEvent} e 
     */
    [POINTERSTART('$view') + IF('checkEditMode')
        + MOVE('calculateMovedElement')
        + FIRSTMOVE('calculateFirstMovedElement')
        + END('calculateEndedElement')
    ](e) {
        this.initMousePoint = this.$viewport.getWorldPosition(e);
        this.$config.init('set.move.control.point', true);
        if (this.$config.get('set.dragarea.mode')) {
            this.emit('startDragAreaView');    

            return;
        }

        let isInSelectedArea = this.$selection.hasPoint(this.initMousePoint)
        const $target = Dom.create(e.target);

        if ($target.hasClass('canvas-view')) {
            this.$selection.select();
            this.initializeDragSelection();
            this.emit('history.refreshSelection');

            return false;
        }

        const $element = $target.closest('element-item');

        var id = $element && $element.attr('data-id');

        // alt(option) + pointerstart 시점에 Layer 카피하기         
        if (e.altKey) {

            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {
                if (this.$selection.check({ id }) === false) {
                    // 선택된게 없으면 id 로 선택 
                    this.$selection.selectByGroup(id);
                }
            }

            if (this.$selection.isEmpty === false) {
                // 선택된 모든 객체 카피하기 
                this.$selection.selectAfterCopy();
                this.refreshAllCanvas()
                this.emit('refreshLayerTreeView')

                this.initializeDragSelection();
                this.emit('history.refreshSelection');
            }

        } else {
            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {
                // shift key 는 selection 을 토글한다. 
                if (e.shiftKey) {
                    this.$selection.toggleById(id);
                } else {
                    // 선택이 안되어 있으면 선택 
                    if (this.$selection.check({ id }) === false) {

                        const current = this.$model.get(id);

                        if (current && current.is('artboard') && current.hasChildren()) {
                            // NOOP
                        } else if (current.hasChildren()) {
                            // 자식이 있으면 그대로 드래그 할 수 있도록 맞춘다.
                            this.$selection.selectByGroup(id);
                        } else {
                            // group 선택을 한다. 
                            // group 선택은 현재 선택된 객체가 속한 그룹의 최상의 부모를 선택하게 한다. 
                            // 이 때 artboard 가 최상위이면 현재 객체를 그대로 선택한다. 
                            this.$selection.selectByGroup(id);
                        }

                    }
                }

            }

            this.initializeDragSelection();
            this.emit('history.refreshSelection');
        }

    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();
    
        this.emit('startGhostToolView');

        this.emit('refreshSelectionTool', true);
    }

    calculateFirstMovedElement () {
        this.emit('hideSelectionToolView');
        this.emit('moveFirstGhostToolView');              
    }

    calculateMovedElement() {
        if (this.$config.get('set.dragarea.mode')) {
            this.emit('moveDragAreaView');            
            return;    
        }

        this.emit('moveGhostToolView');          

        // layout item 은 움직이지 않고 layout 이 좌표를 그리도록 한다. 
        if (this.$selection.isLayoutItem) {
            return;
        }          

        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        this.moveTo(newDist);

        // 최종 위치에서 ArtBoard 변경하기 
        // 마우스 위치에 따라 root 를 어디로 할지 정의 해야함 
        // 레이아웃도 있기 때문에 구조를 다시 맞춰야 함 . 
        if (this.$selection.changeInLayoutArea(this.$viewport.applyVertexInverse(targetMousePoint))) {
            this.initMousePoint = targetMousePoint;
            this.$selection.reselect();
            this.$snapManager.clear();
            this.refreshAllCanvas()

            // ArtBoard 변경 이후에 LayerTreeView 업데이트
            this.emit('refreshLayerTreeView')
        }

        this.emit('setAttributeForMulti', this.$selection.pack('x', 'y'));

    }

    /**
     * 선택된 레이어 이동하기 
     * 
     * 1. 마우스 포인트로 이동한 거리 생성 
     * 2. world 포인트로 이동한 거리 생성 
     * 3. world 포인트로 snap 체크 
     * 4. snap 만큼 이동 
     * 5. 캐쉬된 개별 레어이의 verties 에 localDist 더함 
     * 6. 처음 포인트와 새로운 포인트를 부모의 Matrix 의 역을 곱함 
     * 7. 둘 사이의 차이를 구해서 실질적으로 움직인 dist 를 찾아냄 
     * 
     * @param {vec3} dist 
     */
    moveTo(dist) {

        //////  snap 체크 하기 
        const snap = this.$snapManager.check(this.$selection.cachedRectVerties.map(v => {
            return vec3.add([], v, dist)
        }), 3);

        const localDist = vec3.add([], snap, dist);

        const result = {}
        this.$selection.cachedItemMatrices.forEach(it => {

            // newVerties 에 실제 움직인 좌표로 넣고 
            const oldVertex = it.verties[4];
            const newVertex = vec3.add([], oldVertex, localDist)

            // 첫번째 좌표 it.rectVerties[0] 과 
            // 마지막 좌표 newVerties[0] 를 
            // parentMatrixInverse 기준으로 다시 원복하고 거리를 잰다 
            // 그게 실제적인 distance 이다. 
            const newDist = vec3.subtract(
                [], 
                vec3.transformMat4([], newVertex, it.parentMatrixInverse), 
                vec3.transformMat4([], oldVertex, it.parentMatrixInverse)
            )

            result[it.id] = {
                x: Math.floor(it.x + newDist[0]),          // 1px 단위로 위치 설정 
                y: Math.floor(it.y + newDist[1]),
            }
        })

        this.$selection.reset(result);
    }

    calculateEndedElement(dx, dy) {
        const targetMousePoint = this.$viewport.getWorldPosition();
        const newDist = vec3.dist(targetMousePoint, this.initMousePoint);
        this.$config.init('set.move.control.point', false);

        this.emit('endGhostToolView'); 

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('endDragAreaView');
            this.$config.init('set.dragarea.mode', false)
            return; 
        }

        if (newDist < 1) {
            // NOOP 
            // 마우스를 움직이지 않은 상태 
        } else {
            this.$selection.reselect();
            this.$snapManager.clear();
            // this.emit('removeGuideLine');
            this.command(
                'setAttributeForMulti',
                "move item",
                this.$selection.pack('x', 'y')
            );

            this.nextTick(() => {
                // boolean path 의 조정이 끝나면 
                // box 를 재구성한다. 
                this.emit('recoverBooleanPath');
            })

        }

        this.nextTick(() => {
            this.emit('refreshSelection');
            this.emit('refreshSelectionTool', true)   
        }, 100);
    }



    refreshSelectionStyleView(obj) {

        if (obj) {
            this.updateElement(obj);
        } else {
            this.$selection.items.forEach(current => {
                this.updateElement(current);
            })
        }
    }

    updateElement(item) {
        if (item) {
            this.$editor.html.update(item, this.getElement(item.id), this.$editor)
        }

    }

    // 타임라인에서 객체를 업데이트 할 때 발생함. 
    updateTimelineElement(item) {
        if (item) {
            this.$editor.html.update(item, this.getElement(item.id), this.$editor)
        }

    }


    refreshAllCanvas() {

        this.clearElementAll();

        const project = this.$selection.currentProject

        const html = this.$editor.html.render(project, null, this.$editor) || '';

        this.refs.$view.updateDiff(html, undefined, {
            checkPassed: (oldEl, newEl) => {
                // data-id 가 동일하면 dom diff 를 하지 않고 넘겨버린다. 
                const isPassed =  oldEl.getAttribute("data-id") === newEl.getAttribute("data-id")
                return isPassed
            }
        })

        this.bindData('$view');

        // 최초 전체 객체를 돌면서 update 함수를 실행해줄 트리거가 필요하다. 
        this.updateAllCanvas(project);
    }

    updateAllCanvas(parentLayer) {
        parentLayer.layers.forEach(item => {
            this.updateElement(item, this.getElement(item.id));
            this.updateAllCanvas(item);            
        })
    }


    
    refreshAllElementBoundSize() {
        var selectionList = this.$selection.items.map(it => {
            if (it.is('artboard')) {
                return it; 
            }

            return it.parent;
        })

        var list = [...new Set(selectionList)];

        if (list.length) {
            list.forEach(it => {
                this.refreshElementBoundSize(it);
            })
        } else {
            // FIXME: selection 이 없는 경우 
            // FIXME: 모든 요소에 대해 bounding size 를 다시 맞추기 때문에 
            // FIXME: 성능상의 문제가 될수도 있음. 
            this.$selection.currentProject.artboards.forEach(it => {
                this.refreshElementBoundSize(it);
            });
        }

    }


    refreshElementBoundSize(parentObj) {
        if (parentObj) {
            if (parentObj.hasChildren() === false) {
                // 크기 변경이 없으면 bound size 를 수정하지 않는다. 
                // 다른 레이아웃으로 들어가게 되면 크기의 변경이 있을 수도 있다. 
                // 그 때는 레이아웃 기준으로 bound size 를 다시 잡을거라 괜찮다. 
                if (parentObj.hasChangedField('x', 'y', 'width', 'height', 'border', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom') === false) {
                    return;
                }

                var $el = this.getElement(parentObj.id);                
                const { x, y, width, height } = $el.offsetRect();

                if (width > 0 && height > 0 ) {
                    parentObj.reset({ x, y, width, height })

                    this.refreshSelectionStyleView(parentObj);                    
                }


                return;
            }


            // FIXME: text component 도 같이 업데이트 해준다.
            const hasChangedDimension = parentObj.changedLayout || parentObj.hasChangedField(
                'children', 
                'box-model', 
                'width', 
                'height', 
            )

            parentObj.layers.forEach(it => {
                var $el = this.getElement(it.id);

                // offset 크기를 정하는건 따로 정의를 해야할 듯 
                // 매번 offsetRect 를 구하는건 비효율적이다.
                // 하지만 레이아웃이 적용이 되어 있기 때문에 selection 표현을 위해서는 어쩔 수 없다. 
                // 그럼 drag 하는 상태처럼 selection 을 드래그 하는 동안은 그냥 막을까? 
                if ($el && (hasChangedDimension ||  it.isLayoutItem())) {
                    const { x, y, width, height } = $el.offsetRect();

                    if (width > 0 && height > 0 ) {
                        it.reset({ x, y, width, height })
    
                        this.refreshSelectionStyleView(it);
                    }
                }

                this.trigger('refreshElementBoundSize', it);
            })
        }
    }

}