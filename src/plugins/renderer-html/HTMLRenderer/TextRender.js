import Dom from "el/sapa/functions/Dom";
import LayerRender from "./LayerRender";
import { Overflow } from 'el/editor/types/model';

export default class TextRender extends LayerRender {

    /**
     * 
     * @param {Item} item 
     */
    toCSS(item) {

        let css = super.toCSS(item)

        css.margin = css.margin || '0px'

        if (item.overflow !== Overflow.SCROLL) {
            css.height = 'auto'
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