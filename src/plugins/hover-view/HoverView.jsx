import { CONFIG, SUBSCRIBE, IF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import "./HoverView.scss";
import Dom from 'el/sapa/functions/Dom';

export default class HoverView extends EditorElement {

    template() {
        return (
            <div class="elf--hover-view sepia(0.2)">
                <div class="elf--hover-rect" ref="$hoverRect"></div>
            </div>
        )
    }

    checkModeView () {

        const e = this.$config.get('bodyEvent');

        // viewport 영역에 있을 때만 이벤트 발생 
        if (!this.$viewport.checkInViewport(this.$viewport.getWorldPosition(e))) {
            return false; 
        }

        const canvas = Dom.create(e.target).closest('elf--page-container');

        if (!canvas) return false; 

        return this.$modeView.isCurrentMode('CanvasView');
    }

    /**
     * CanvasView 모드일 때만  HoverView 동작하도록 설정 
     */
    [CONFIG('bodyEvent') + IF('checkModeView')]() {

        if (this.$config.true("set.move.control.point")) {
            this.$selection.setHoverId('');
            this.renderHoverLayer()            
            return;
        }

        const filteredList = this.$selection.filteredLayers;
        const point = this.$viewport.getWorldPosition(this.$config.get('bodyEvent'));

        const items = filteredList.filter(it => it.hasPoint(point[0], point[1])).filter(it => it.isNot('artboard'))

        // 그룹에 속해 있으면 삭제한다. 
        let hoverItems = items; //this.$model.convertGroupItems(items);

        // 계층 구조에서 마지막 객체를 선택 
        let id = hoverItems[0]?.id;

        if (this.$selection.isEmpty) {
            id = hoverItems[0]?.id;
        } else if (this.$selection.isOne) {
            const pathIds = this.$selection.current.pathIds;
            hoverItems = hoverItems.filter(it => pathIds.includes(it.id) === false || it.id === this.$selection.current.id);

            id = hoverItems[0]?.id;
        }

        if (!id) {
            this.$selection.setHoverId('');
            this.renderHoverLayer()
        } else {

            if (this.$selection.setHoverId(id)) {
                this.renderHoverLayer()
            }
        }
    }

    [SUBSCRIBE('refreshHoverView')](id) {
        if (this.$selection.setHoverId(id)) {
            this.renderHoverLayer()
        }
    }

    [SUBSCRIBE('updateViewport', 'refreshSelectionStyleView')]() {
        this.$selection.setHoverId('');
        this.renderHoverLayer()
    }


    createVisiblePath (current) {
        if (!current.is('boolean-path')) {
            return '';
        }

        const newPath = current.absolutePath();
        newPath.transformMat4(this.$viewport.matrix);

        return /*html*/`
        <svg overflow="visible">
            <path
                d="${newPath.d}"
                stroke="red"
                stroke-width="2"
                fill="none"
                />
        </svg>
        `;
    }

    renderHoverLayer() {

        const items = this.$selection.hoverItems;

        if (items.length === 0) {
            this.refs.$hoverRect.updateDiff('')
            this.emit('removeGuideLine');
        } else {

            // refresh hover view 
            const verties = items[0].verties;

            const title = items[0].is('boolean-path') ? items[0]['boolean-operation'] : items[0].itemType;

            const line = this.createPointerLine(this.$viewport.applyVerties(verties), title);

            this.refs.$hoverRect.updateDiff(line)

            this.emit('refreshGuideLineByTarget', [items[0].verties]);

        }
    }


    createPointerLine(pointers) {
        if (pointers.length === 0) return '';

        return /*html*/`
        <svg overflow="visible">
            <path 
                class='line' 
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
