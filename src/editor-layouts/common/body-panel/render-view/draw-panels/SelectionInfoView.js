

import { DOMDIFF, LEFT_BUTTON, LOAD, POINTERSTART, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { vec3 } from "gl-matrix";
import { END, MOVE } from "el/editor/types/event";
import './SelectionInfoView.scss';

export default class SelectionInfoView extends EditorElement {

    template() {
        return /*html*/`<div class='elf--selection-info-view'></div>`
    }

    /**
     * 드래그 해서 객체 옮기기 
     *
     * ctrl + pointerstart 하는  시점에 카피해보자.  
     * 
     * @param {PointerEvent} e 
     */
     [POINTERSTART('$el [data-artboard-title-id]') + LEFT_BUTTON + MOVE('calculateMovedElement') + END('calculateEndedElement')] (e) {
        this.startXY = e.xy ; 
        this.initMousePoint = this.$viewport.getWorldPosition(e);
        const id = e.$dt.attr('data-artboard-title-id');        
        this.$selection.select(id);            

        // alt(option) + pointerstart 시점에 Layer 카피하기         
        if (e.altKey) {
            // 선택된 모든 객체 카피하기 
            this.$selection.selectAfterCopy();
            this.emit('refreshAllCanvas')         
            this.emit('refreshLayerTreeView')          
        }

        this.initializeDragSelection();
        this.emit('history.refreshSelection');                 
  
    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();

        this.emit('refreshSelectionTool');
    }


    calculateMovedElement () {
        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        this.emit('selectionToolView.moveTo', newDist);

        this.nextTick(() => {
            this.emit('refreshSelectionStyleView');
            this.emit('refreshSelectionTool', false);       
            // this.emit('refreshRect'); 
            this.refresh();            
        })

    }

    /**
     * ArtBoard title 변경하기 
     * @param {string} id 
     * @param {string} title 
     */
    [SUBSCRIBE('refreshItemName')] (id, title) {
        this.emit(
            'setAttributeForMulti',
            {
                [id]: { name: title }
            }
        );  
        this.$el.$(`[data-artboard-title-id='${id}']`)?.text(title);
    }

    calculateEndedElement (dx, dy) {
        this.command(
            'setAttributeForMulti',
            "move item",                    
            this.$selection.pack('x', 'y')
        );  
        this.emit('refreshSelectionTool', true);
    }

    [SUBSCRIBE('updateViewport')] () {
        this.refresh();
    }

    [SUBSCRIBE('refreshSelectionStyleView')] () {
        if (this.$selection.current) {
            if (this.$selection.current.is('artboard')) {
                if (this.$selection.hasChangedField('x', 'y', 'width', 'height', 'transform', 'transform-origin')) {
                    this.refresh();
                }

            }
        }

    }


    [LOAD('$el') + DOMDIFF] () {
        return this.$selection.currentProject.artboards.map(it => {
            return { title: it.name, id: it.id, rect: [
                this.$viewport.applyVertex(it.verties[0]),
                this.$viewport.applyVertex(it.verties[1]),
            ]}
        }).map(it => this.makeArtboardTitleArea(it))

    }

    makeArtboardTitleArea (it) {
        return /*html*/`
            <div class="artboard-title is-not-drag-area" 
                 data-artboard-title-id="${it.id}" 
                 style="left: ${it.rect[0][0]}px;top:${it.rect[0][1]}px;"
            >${it.title}</div>`
    }    

} 