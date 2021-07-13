import { CSS_TO_STRING } from "el/base/functions/func";
import { Project } from "plugins/default-items/layers/Project";
import { SVGFilter } from "el/editor/property-parser/SVGFilter";
import DomRender from "./DomRender";

export default class ProjectRender extends DomRender {
    

    /**
     * 
     * @param {Item} item 
     */
    toRootVariableCSS (item) {
        let obj = {}
        item.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
        var [key, value] = it.split(':')

        obj[`--${key}`] = value; 
        })

        return obj;
    }  

    /**
     * 
     * @param {Project} item 
     */
    toCSS(item) {
        return Object.assign(
            {},
            ...this.toRootVariableCSS(item)
        )
    }

    /**
     * 
     * @param {Project} item 
     */
    toStyle (item) {
        
        const keyframeString = item.toKeyframeString();
        const rootVariable = this.toRootVariableCSS(item);

        return /*html*/`
<style type='text/css' data-renderer-type="html" data-id='${item.id}'>
    :root {
        ${CSS_TO_STRING(rootVariable)}
    }
    /* keyframe */
    ${keyframeString}
</style>
        `
    }

    /**
     * 
     * @param {Item} item 
     * @param {HTMLRenderer} renderer 
     */
    render (item, renderer) {
        return item.layers.map(it => {
            return renderer.render(it)
        }).join('');
    }

    renderSVGFilter (item) {

        var filterString = item.svgfilters.map(svgfilter => {

            var filters = svgfilter.filters.map(filter => SVGFilter.parse(filter))
    
            return /*html*/`<filter id='${svgfilter.id}'>${filters.join('\n')}</filter>`  
        }).join('\n\n')
    
        return filterString
    }

    /**
     * 프로젝트에서 관리하는 SVG 객체를 출력한다. 
     * 
     * @param {Item} item 
     * @param {HTMLRenderer} renderer 
     */
    renderSVG (item, renderer) {
        const filterString = this.renderSVGFilter(item);

        return /*html*/`
<svg width="0" height="0">
    <title>SVG Properties</title>
    ${filterString}
</svg>
`
    }
}