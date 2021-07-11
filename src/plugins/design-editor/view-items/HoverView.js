import Dom from "el/base/Dom";

import { SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class HoverView extends EditorElement {

    template() {
        return /*html*/`
            <div class='hover-view'>
                <div class='hover-rect' ref='$hoverRect'></div>            
            </div>
        `
    }

    
    [SUBSCRIBE('config:bodyEvent')] () {
        const $dom = Dom.create(this.$config.get('bodyEvent').target);
        const id = $dom.data('id');

        if (this.$editor.isPointerUp) {
            this.$selection.setHoverId('');
            this.renderHoverLayer()
        } else {

            if (this.$selection.setHoverId(id)) {
                this.renderHoverLayer()
            }
        }
    }

    [SUBSCRIBE('updateViewport')] () {
        this.$selection.setHoverId('');
        this.renderHoverLayer()
    }


    renderHoverLayer () {

        const items = this.$selection.hoverItems;

        if (items.length === 0) {
            this.refs.$hoverRect.updateDiff('')
        } else {
            const verties = items[0].verties;
            const line = this.createPointerLine(this.$viewport.applyVerties(verties));   
            
            this.refs.$hoverRect.updateDiff(line)
        }
    }


    createPointerLine (pointers) {
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
