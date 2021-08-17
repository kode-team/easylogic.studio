import Dom from "el/sapa/functions/Dom";

import { CONFIG, SUBSCRIBE } from "el/sapa/Event";
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

    get filteredLayers () {

        return this.$selection.currentProject.filteredAllLayers((item) => {

            // 빠른 필터링을 위해서 area 로 구분된 영역을 먼저 필터링을 하고 
          const areaPosition = item.areaPosition;
    
          if (!areaPosition) {
            return false;
          }
    
          const {column, row} = areaPosition 
    
          return (column[0] <= this.column && this.column <= column[1]) && 
                 (row[0] <= this.row && this.row <= row[1]);
        })
        .filter(item => {
          // group 은 바로 hover 대상에 포함하지 않는다. 
          // 왜냐하면 비어있는 영역을 클릭하는 형태가 되기 때문이다. 
          return !item.hasChildren() && item.hasPoint(this.pos[0], this.pos[1])
        })
        .map(item => {
            // 최종 결과물에서 hover 된 아이템의 group item 을 조회한다. 
            return this.modelManager.findGroupItem(item.id)
        });
    
      }


    [CONFIG('bodyEvent')]() {
        const items = this.$selection.filteredLayers.filter(it => it.isNot('artboard'))

        const id = items[0]?.id;

        if (!id || this.$config.get('hoverView') === false) {
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
