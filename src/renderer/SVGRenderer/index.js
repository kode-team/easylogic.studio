import Dom from '@core/Dom';
import { Item } from '@items/Item';

import ProjectRender from './ProjectRender';



const renderers = {
    'project': new ProjectRender(),

}

export default {
    /**
     * 
     * @param {Item} item 
     */
    render (item, renderer) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.render(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toCSS(item);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toTransformCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toTransformCSS(item);
        }
    },    

    /**
     * 
     * 렌더링 될 style 태그를 리턴한다. 
     * 
     * @param {Item} item 
     */
    toStyle (item, renderer) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toStyle(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
    update (item, currentElement) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.update(item, currentElement);
        }
    }    
}