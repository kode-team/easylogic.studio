import { CSS_TO_STRING, OBJECT_TO_PROPERTY } from "@core/functions/func";
import SVGRender from "./SVGRender";

export default class ArtboardRender extends SVGRender {

    toCSS(item) {

        const css = Object.assign(
            {},
            this.toDefaultCSS(item),
            this.toClipPathCSS(item),
            this.toWebkitCSS(item), 
            this.toTextClipCSS(item)
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
    render(item, renderer) {

        const {x, y, width, height} = item;

        let css = this.toCSS(item);

        return /*html*/`
<svg ${OBJECT_TO_PROPERTY({ 
    x: x.value, 
    y: y.value, 
    width: width.value, 
    height: height.value,
    viewBox: `0 0 ${width.value} ${height.value}`,
    style: CSS_TO_STRING(css)
})}>
    ${this.toDefString(item)}
    ${item.layers.map(it => {
        return renderer.render(it, renderer)
    }).join('')}
</svg>      
        `       

    }
}