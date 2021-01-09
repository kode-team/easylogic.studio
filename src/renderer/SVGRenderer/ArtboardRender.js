import { CSS_TO_STRING } from "@core/functions/func";
import SVGRender from "./SVGRender";

export default class ArtboardRender extends SVGRender {

    toCSS(item) {

        const css = Object.assign(
            {},
            this.toDefaultCSS(item),
            this.toClipPathCSS(item),
            this.toWebkitCSS(item), 
            this.toTextClipCSS(item),
            this.toBackgroundImageCSS(item),            
        );

        delete css.left;
        delete css.top;
        delete css.width;
        delete css.height;
        delete css.position;

        return css; 
    }
    /**
     * 
     * @param {Item} item 
     * @param {SVGRenderer} renderer 
     */
    render(item, renderer, encoding = true) {

        const {x, y, width, height} = item;

        let css = this.toCSS(item);

        return /*html*/`
${encoding ? `<?xml version="1.0"?>` : ''}
<svg 
    xmlns="http://www.w3.org/2000/svg"
    width="${width.value}"
    height="${height.value}"
    viewBox="0 0 ${width.value} ${height.value}"
    style="${CSS_TO_STRING(css)}"
>
    ${this.toDefString(item)}
    ${item.layers.map(it => {
        return renderer.render(it, renderer)
    }).join('')}
</svg>      
        `       

    }
}