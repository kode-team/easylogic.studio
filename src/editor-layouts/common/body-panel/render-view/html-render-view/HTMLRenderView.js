import { vec3 } from "gl-matrix";

import { BIND, POINTERSTART, IF, KEYUP, DOUBLECLICK, FOCUSOUT, SUBSCRIBE, CONFIG } from "el/sapa/Event";
import { Length } from "el/editor/unit/Length";
import Dom from "el/sapa/functions/Dom";
import { isFunction } from "el/sapa/functions/func";
import { KEY_CODE } from "el/editor/types/key";
import { END, FIRSTMOVE, MOVE } from "el/editor/types/event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import StyleView from "./StyleView";

import './HTMLRenderView.scss';

export default class HTMLRenderView extends EditorElement {

    components() {
        return {
            StyleView,
        }
    }

    initState() {
        return {
            mode: 'selection',
            x: Length.z(),
            y: Length.z(),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
        }
    }

    template() {
        return /*html*/`
            <div class='elf--element-view' ref='$body'>
                <object refClass='StyleView' ref='$styleView' />
                <div class='canvas-view' ref='$view' data-outline="${this.$config.get('show.outline')}"></div>
                ${this.$injectManager.generate("render.view")}
            </div>
        `
    }

    [CONFIG('show.outline')] () {
        this.refs.$view.attr('data-outline', this.$config.get('show.outline'));
    }

    [SUBSCRIBE('refElement')](id, callback) {
        isFunction(callback) && callback(this.getElement(id))
    }

    clearElementAll() {
        this.$selection.each(item => {
            this.clearElement(item.id);
        });
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
        this.$selection.items.filter(it => it.id === id).forEach(it => {
            it.reset({
                content,
                text,
            })
            arr.push({ id: it.id, content, text })
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

        const $target = Dom.create(e.target);
        if ($target.hasClass('canvas-view')) {
            return false;
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
                    this.$config.set('set.dragarea.mode', true);
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
        + END('calculateEndedElement')
    ](e) {
        this.initMousePoint = this.$viewport.getWorldPosition(e);

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
                this.trigger('refreshAllCanvas')
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

        this.emit('refreshSelectionTool', true);
    }

    calculateMovedElement() {

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('moveDragAreaView');            
            return;    
        }

        // layout item 은 움직이지 않고 layout 이 좌표를 그리도록 한다. 
        if (this.$selection.isLayoutItem) {
            return;
        }

        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        this.moveTo(newDist);

        // 최종 위치에서 ArtBoard 변경하기 
        if (this.$selection.changeArtBoard()) {
            this.initMousePoint = targetMousePoint;
            this.$selection.reselect();
            this.$snapManager.clear();
            this.clearElementAll();

            this.trigger('refreshAllCanvas')

            // ArtBoard 변경 이후에 LayerTreeView 업데이트
            this.emit('refreshLayerTreeView')
        }

        this.emit('setAttributeForMulti', this.$selection.pack('x', 'y'));
        this.emit('refreshSelectionTool', true);

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
            const newVerties = it.verties.map(v => {
                return vec3.add([], v, localDist)
            })

            // 첫번째 좌표 it.rectVerties[0] 과 
            // 마지막 좌표 newVerties[0] 를 
            // parentMatrixInverse 기준으로 다시 원복하고 거리를 잰다 
            // 그게 실제적인 distance 이다. 
            const newDist = vec3.subtract(
                [], 
                vec3.transformMat4([], newVerties[0], it.parentMatrixInverse), 
                vec3.transformMat4([], it.verties[0], it.parentMatrixInverse)
            )

            result[it.id] = {
                x: Length.px(it.x + newDist[0]).floor(),          // 1px 단위로 위치 설정 
                y: Length.px(it.y + newDist[1]).floor(),
            }
        })
        this.$selection.reset(result);
    }

    [SUBSCRIBE('selectionToolView.moveTo')](newDist) {
        this.moveTo(newDist);
        this.emit('refreshSelectionTool', true);
    }

    calculateEndedElement(dx, dy) {
        const targetMousePoint = this.$viewport.getWorldPosition();
        const newDist = vec3.dist(targetMousePoint, this.initMousePoint);

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('endDragAreaView');
            this.$config.set('set.dragarea.mode', false)
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
        }

        this.emit('refreshSelectionTool', true);
    }

    [BIND('$body')]() {
        const { canvasWidth, canvasHeight } = this.$editor;

        var width = Length.px(canvasWidth);
        var height = Length.px(canvasHeight);

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



    // 객체를 부분 업데이트 하기 위한 메소드 
    [SUBSCRIBE('refreshSelectionStyleView')](obj) {
        var items = obj ? [obj] : this.$selection.items;

        items.forEach(current => {
            this.updateElement(current);
        })
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
     * canvas 전체 다시 그리기 
     */
    [SUBSCRIBE('refreshAllCanvas')]() {

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
        this.trigger('updateAllCanvas', project);
    }

    [SUBSCRIBE('updateAllCanvas')](parentLayer) {
        parentLayer.layers.forEach(item => {
            this.updateElement(item, this.getElement(item.id));
            this.trigger('updateAllCanvas', item);
        })
    }

    [SUBSCRIBE('refreshAllElementBoundSize')]() {

        var selectionList = this.$selection.items.map(it => it.is('artboard') ? it : it.parent)

        var list = [...new Set(selectionList)];
        list.forEach(it => {
            this.trigger('refreshElementBoundSize', it);
        })
    }

    [SUBSCRIBE('refreshElementBoundSize')](parentObj) {
        if (parentObj) {

            const hasChangedDimension = parentObj.changedBoxModel || parentObj.hasChangedField('box-model', 'width', 'height', 'layout', 'flex-layout', 'grid-layout');
            
            parentObj.layers.forEach(it => {
                // if (it.isLayoutItem()) {
                var $el = this.getElement(it.id);

                if ($el && hasChangedDimension) {
                    const { x, y, width, height } = $el.offsetRect();

                    it.reset({
                        x: Length.px(x),
                        y: Length.px(y),
                        width: Length.px(width),
                        height: Length.px(height)
                    })

                    this.updateElement(it, $el);
                    this.trigger('refreshSelectionStyleView', it, true);
                }
                // }

                this.trigger('refreshElementBoundSize', it);
            })
        }
    }

    [SUBSCRIBE('updateViewport')]() {
        this.bindData('$view');
    }

}