import UIElement, { EVENT } from "../../../util/UIElement";
import { CSS_TO_STRING } from "../../../util/functions/func";
import { LOAD } from "../../../util/Event";
import { editor } from "../../../editor/editor";


/**
 * 객체와의 거리의 가이드 라인을 그려주는 컴포넌트
 */
export default class GridLayoutLineView extends UIElement {

    template() {
        return /*html*/`<div class='grid-layout-line-view' style='width:100%;height:100%;pointer-events:none;'></div>`
    }

    [LOAD('$el')] () {

        var len = editor.selection.length;

        if (len !== 1) {
            return /*html*/'<div></div>'; 
        }

        var current = editor.selection.current;

        if (current.isInGrid()) {
            var layoutContainer = current.parent; 
            var left = layoutContainer.screenX
            var top = layoutContainer.screenY
            var width = layoutContainer.width
            var height = layoutContainer.height
            var grid = layoutContainer.toGridLayoutCSS()

            return /*html*/`<div style='${CSS_TO_STRING({ position: 'absolute', left, top, width, height, border: '1px solid black', ...grid})}'>
                ${layoutContainer.layers.map(it => {
                    var layoutItemCSS = it.toLayoutItemCSS()
                    return /*html*/`<div style='${CSS_TO_STRING({...layoutItemCSS, 'border': '1px solid dashed'})}'></div>`
                })}
            </div>`
        }

        return /*html*/`<div></div>`
    }
    

    [EVENT('refreshGridLayoutLine', 'refreshSelectionTool', 'refreshSelection')] () {        
        this.refresh();
    }
} 