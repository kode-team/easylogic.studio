
import { LOAD, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { CSS_TO_STRING } from "el/utils/func";

/**
 * 그리드 레이아웃 가이드 라인 표시 컴포넌트
 */
export default class GridLayoutLineView extends EditorElement {

    template() {
        return /*html*/`<div class='grid-layout-line-view' style='width:100%;height:100%;pointer-events:none;'></div>`
    }

    [LOAD('$el')] () {

        var len = this.$selection.length;

        if (len !== 1) {
            return /*html*/''; 
        }

        var current = this.$selection.current;

        if (current.isInGrid()) {
            var layoutContainer = current.parent; 
            var left = layoutContainer.screenX
            var top = layoutContainer.screenY
            var width = layoutContainer.width
            var height = layoutContainer.height

            var grid = this.$editor.html.toGridLayoutCSS(layoutContainer)

            return /*html*/`<div style='${CSS_TO_STRING({ position: 'absolute', left, top, width, height, border: '1px solid black', ...grid})}'>
                ${layoutContainer.layers.map(it => {
                    var layoutItemCSS = this.$editor.html.toLayoutItemCSS(it);
                    return /*html*/`<div style='${CSS_TO_STRING({...layoutItemCSS, 'border': '1px solid dashed'})}'></div>`
                }).join('')}
            </div>`
        }

        return /*html*/`<div></div>`
    }
    

    [SUBSCRIBE('refreshGridLayoutLine', 'refreshSelectionTool', 'refreshSelection')] () {        
        this.refresh(); 
    }

    [SUBSCRIBE('updateViewport')] () {
        this.refresh();
    }
} 