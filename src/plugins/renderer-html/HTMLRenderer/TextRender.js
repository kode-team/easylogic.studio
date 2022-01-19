import Dom from "el/sapa/functions/Dom";
import LayerRender from "./LayerRender";
import { Overflow } from 'el/editor/types/model';
import { Length } from 'el/editor/unit/Length';

export default class TextRender extends LayerRender {

    /**
     * 
     * @param {Item} item 
     */
    toCSS(item) {

        let css = super.toCSS(item)

        css.margin = css.margin || '0px'


        // text 는 혼자 존재할 때는 height 를 고정하고 
        // 다른 것에 연결되어 있을 때는 height: auto 로 크기를 자동으로 변경한다. 
        if (item.parent.is("project")) {
            css.height = Length.px(item.screenHeight);
        } else {
            if (item.overflow !== Overflow.SCROLL) {
                css.height = 'auto'
            }
    
        }



        return css
    }
    
    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
     update (item, currentElement) {

        const $textElement = currentElement.$(`.text-content`);
        if ($textElement) {
            var {content} = item;
            $textElement.updateDiff(content);
        }

        super.update(item, currentElement);        
    }    

    /**
     * 
     * @param {Item} item 
     */
    render (item) {
        var {id, content} = item;

        return /*html*/`
            <div class='element-item text' data-id="${id}">
                ${this.toDefString(item)}
                <div class="text-content" tabIndex="-1" data-id="${id}">${content}</div>
            </div>
        `
    }


}