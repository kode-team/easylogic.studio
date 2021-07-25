import { SUBSCRIBE } from "el/base/Event";
import { Length } from "el/editor/unit/Length";

import { EditorElement } from "el/editor/ui/common/EditorElement";

import './SkiaRenderView.scss';
import { vec3 } from "gl-matrix";

export default class SkiaRenderView extends EditorElement {

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
            <div class='elf--element-view' ref='$body'>
                <canvas class='canvas-view' id="skia-render-canvas" ref='$view'></canvas>
            </div>
        `
    }

    [SUBSCRIBE('afterChangeMode')]() {
        this.$el.attr('data-mode', this.$editor.mode);
    }


    moveTo(newDist) {

        newDist = vec3.floor([], newDist);

        //////  snap 체크 하기 
        const snap = this.$snapManager.check(this.$selection.cachedRectVerties.map(v => {
            return vec3.add([], v, newDist)
        }), 3);

        const localDist = vec3.add([], snap, newDist);

        const result = {}
        this.$selection.cachedItemVerties.forEach(it => {
            result[it.id] = {
                x: Length.px(it.x + localDist[0]).round(1000),          // 1px 단위로 위치 설정 
                y: Length.px(it.y + localDist[1]).round(1000),
            }
        })
        this.$selection.reset(result);
    }

    [SUBSCRIBE('selectionToolView.moveTo')](newDist) {
        this.moveTo(newDist);
        this.emit('refreshSelectionTool', true);
    }    

    /**
     * canvas 전체 다시 그리기 
     */
    [SUBSCRIBE('refreshAllCanvas')]() {

        const project = this.$selection.currentProject
        const results = this.$editor.renderer('skia').render(project, null, 'skia-render-canvas');

        console.log(results);
        // const html = this.$editor.html.render(project, null, this.$editor) || '';

        // this.setState({ html }, false)
        // this.refs.$view.updateDiff(html)

        // this.bindData('$view');

        // // 최초 전체 객체를 돌면서 update 함수를 실행해줄 트리거가 필요하다. 
        // this.trigger('updateAllCanvas', project);
    }

    [SUBSCRIBE('updateAllCanvas')](parentLayer) {

    }

    [SUBSCRIBE('updateViewport')]() {
        const { canvasSize } = this.$viewport;

        if (JSON.stringify(this.cachedSize) !== JSON.stringify(canvasSize)) {
            this.refs.$view.setAttr({
                width: canvasSize.width,
                height: canvasSize.height
            });

            this.cachedSize = canvasSize;

            // this.$editor.renderer('skia').updateViewport();
        }

    }

}