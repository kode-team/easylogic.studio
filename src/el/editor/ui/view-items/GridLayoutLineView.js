
import { CSS_TO_STRING } from "el/base/functions/func";
import { LOAD, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";
import HTMLRenderer from "el/editor/renderer/HTMLRenderer";

/**
 * 객체와의 거리의 가이드 라인을 그려주는 컴포넌트
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
            var grid = HTMLRenderer.toGridLayoutCSS(layoutContainer)

            return /*html*/`<div style='${CSS_TO_STRING({ position: 'absolute', left, top, width, height, border: '1px solid black', ...grid})}'>
                ${layoutContainer.layers.map(it => {
                    var layoutItemCSS = HTMLRenderer.toLayoutItemCSS(it);
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

registElement({ GridLayoutLineView })