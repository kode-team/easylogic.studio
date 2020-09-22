import { CSS_TO_STRING } from "@core/functions/func";
import { Project } from "@items/Project";
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
        <style type='text/css' data-id='${item.id}'>
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
        return item.artboards.map(it => {
            return renderer.render(it)
        });
    }
}