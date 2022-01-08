import { isFunction } from "el/sapa/functions/func";
import { Item } from "el/editor/items/Item";
import { CSS_TO_STRING } from "el/utils/func";
import DomRender from "plugins/renderer-html/HTMLRenderer/DomRender";


export default class SVGRender extends DomRender {


    toDefaultCSS(item) {
        return {
            overflow: 'visible',
            ...this.toKeyListCSS(item, [
                'font-size', 
                'line-height', 
                'font-weight', 
                'font-family', 
                'font-style',
                'text-align', 
                'text-transform',  
                'text-decoration',
                'letter-spacing', 
                'word-spacing', 
                'text-indent',
                'background-color', 
                'border-radius',
                'transform-style',
                'filter', 
                'filter', 
                'backdrop-filter', 
                'box-shadow', 
                'text-shadow',
                'animation',  
                'transition',                                
            ])
        }
    
    }
    
    /**
     * SVG 가 CSS 로써 가질 수 있는 값들을 정의한다. 
     * 
     * @param {Item} item 
     */
    toCSS(item) {

        const css = Object.assign(
            {},
            this.toVariableCSS(item),
            this.toDefaultCSS(item),
            this.toClipPathCSS(item),
            this.toWebkitCSS(item), 
            this.toTextClipCSS(item),      
            this.toTransformCSS(item),            
            this.toLayoutItemCSS(item),
            this.toBorderCSS(item),            
            this.toBackgroundImageCSS(item),
            this.toLayoutCSS(item)
        );

        delete css.left;
        delete css.top;
        delete css.width;
        delete css.height;
        delete css.position;

        return css; 
    }


    /**
     * css 속성 중에  svg attribute 로 전환되는 리스트를 객체로 리턴
     * 
     * @param {Item} item 
     */
    toSVGAttribute (item) {
        return {
            ...this.toDefaultCSS(item),
            ...this.toKeyListCSS(item, [
                'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dashoffset',
                'fill-opacity', 'fill-rule', 'text-anchor'
            ]),
            ...{
                'stroke-dasharray': item['stroke-dasharray']?.join(' '),
            }
        }
    }

    /**
     * 
     * @param {Item} item 
     * @param {Function} callback 
     */
    wrappedRender (item, callback) {

        const {id, x, y, width, height, itemType} = item;

        return /*html*/`

<svg class='svg-element-item ${itemType}'
    xmlns="http://www.w3.org/2000/svg"
    data-id="${id}"
    x="${x.value}"
    y="${y.value}"
    width="${width}"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    overflow="visible"
>
    ${this.toDefString(item)}
    ${isFunction(callback) && callback()}
</svg>
        `       
    }

    /**
     * 
     * @param {Item} item 
     * @param {SVGRenderer} renderer 
     */
    render (item, renderer) {

        const {width, height, elementType} = item;
        const tagName = elementType || 'div'
        let css = this.toCSS(item);

        return this.wrappedRender(item, ()=> {
            return /*html*/`
<foreignObject 
    width="${width}"
    height="${height}"
    overflow="visible"
>
    <${tagName} xmlns="http://www.w3.org/1999/xhtml" style="${CSS_TO_STRING(css)};width:100%;height:100%;"></${tagName}>
</foreignObject>    
${item.layers.map(it => {
    return renderer.render(it, renderer)
}).join('')}
            `            
        })

    }
}