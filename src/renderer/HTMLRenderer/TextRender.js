import Dom from "@sapa/Dom";
import LayerRender from "./LayerRender";

export default class TextRender extends LayerRender {
    


    toNestedCSS(item) {
        
        return [
            { 
                selector: '> *', cssText: `
                    pointer-events: none;
                `
            }
        ]
    }  

    /**
     * 
     * @param {Item} item 
     */
    toCSS(item) {

        let css = super.toCSS(item)

        css.margin = css.margin || '0px'

        return css
    }
    

    /**
     * 
     * @param {Item} item 
     */
    render (item) {
        var {id, content} = item;

        return /*html*/`<p class='element-item text' tabIndex="-1" data-id="${id}">${content}</p>`
    }

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
    update (item, currentElement) {
        var {content} = item;

        currentElement.updateDiff(content);
    }

}