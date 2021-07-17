import Dom from "el/base/Dom";

import { SUBSCRIBE } from "el/base/Event";
import { makeGuidePoint } from "el/base/functions/math";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import "./HoverView.scss";

export default class HoverView extends EditorElement {

    template() {
        return /*html*/`
            <div class='elf--hover-view'>
                <div class='elf--hover-rect' ref='$hoverRect'></div>            
            </div>
        `
    }


    [SUBSCRIBE('config:bodyEvent')]() {
        const $dom = Dom.create(this.$config.get('bodyEvent').target);
        const id = $dom.data('id');

        if (!id) {
            this.$selection.setHoverId('');
            this.renderHoverLayer()
        } else {

            if (this.$selection.setHoverId(id)) {
                this.renderHoverLayer()
            }
        }
    }

    [SUBSCRIBE('updateViewport')]() {
        this.$selection.setHoverId('');
        this.renderHoverLayer()
    }


    renderHoverLayer() {

        const items = this.$selection.hoverItems;

        if (items.length === 0) {
            this.refs.$hoverRect.updateDiff('')
            this.emit('removeGuideLine');


        } else {

            // refresh hover view 
            const verties = items[0].verties;
            const line = this.createPointerLine(this.$viewport.applyVerties(verties));

            this.refs.$hoverRect.updateDiff(line)

            // refresh guide 
            const source = this.$selection.current;

            if (source) {

                const source = this.$selection.current;
                const targetList = [items[0]]

                // x축 가이드 설정하기 
                const xList = targetList.map(target => makeGuidePoint(source, target));

                xList.sort((a, b) => {
                    return a[3] - b[3];
                });

                const list = [xList[0]];

                this.emit('refreshGuideLine', list);
            }

        }
    }


    createPointerLine(pointers) {
        if (pointers.length === 0) return '';
        return /*html*/`
        <svg class='line' overflow="visible">
            <path 
                d="
                    M ${pointers[0][0]}, ${pointers[0][1]} 
                    L ${pointers[1][0]}, ${pointers[1][1]} 
                    L ${pointers[2][0]}, ${pointers[2][1]} 
                    L ${pointers[3][0]}, ${pointers[3][1]} 
                    L ${pointers[0][0]}, ${pointers[0][1]}
                    Z
                " 
                />
        </svg>`
    }

}
