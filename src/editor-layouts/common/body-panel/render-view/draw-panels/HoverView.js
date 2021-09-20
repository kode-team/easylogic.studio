import { CONFIG, SUBSCRIBE, IF } from "el/sapa/Event";
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

    checkModeView () {
        return this.$modeView.isCurrentMode('CanvasView');
    }

    /**
     * CanvasView 모드일 때만  HoverView 동작하도록 설정 
     * 
     * @returns 
     */
    [CONFIG('bodyEvent') + IF('checkModeView')]() {
        if (this.$config.get('hoverView') === false || this.$config.true("set.move.control.point")) {
            this.$selection.setHoverId('');
            this.renderHoverLayer()            
            return;
        }

        const items = this.$selection.filteredLayers.filter(it => it.isNot('artboard'))

        const id = items[0]?.id;

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


            this.emit('refreshGuideLineByTarget', [items[0].verties]);

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
