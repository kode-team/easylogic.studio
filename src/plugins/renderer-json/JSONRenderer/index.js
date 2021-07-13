import { Item } from 'el/editor/items/Item';

export default class JSONRenderer {
    constructor(editor) {
        this.editor = editor;
    }


    getDefaultRendererInstance () {
        return this.editor.getRendererInstance('json', 'rect');
    }

    getRendererInstance (item) {
        return this.editor.getRendererInstance('json', item.itemType) || this.getDefaultRendererInstance() || item;
    }    

    /**
     * 
     * @param {Item} item 
     */
    async render (item, renderer) {
        if (!item) return;
        const currentRenderer = this.getRendererInstance(item);

        if (currentRenderer) {
            return await currentRenderer.render(item, renderer || this);
        }
    }

    async getResourceDataURI (item, renderer) {
        
    }

}