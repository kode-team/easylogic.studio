import Dom from 'el/sapa/functions/Dom';
import { isFunction } from 'el/sapa/functions/func';
import { Item } from 'el/editor/items/Item';
import { Editor } from 'el/editor/manager/Editor';


export default class SkiaRenderer {
    /**
     * 
     * @param {Editor} editor 
     */
    constructor(editor) {
        this.editor = editor;

    }

    getDefaultRendererInstance () {
        return this.editor.getRendererInstance('skia', 'rect');
    }

    getRendererInstance (item) {
        return this.editor.getRendererInstance('skia', item.itemType) || this.getDefaultRendererInstance() || item;
    }


    /**
     * 
     * @param {Item} item 
     */
    render (item, renderer, id) {
        if (!item) return;
        if (!this.CanvasKit) return;


        if (!this.surface) {
            this.surface = this.CanvasKit.MakeCanvasSurface(id);    

            const {CanvasKit} = this;

            const drawFrame = (canvas) => {
                const { viewport } = this.editor;
                const { translate, transformOrigin: origin, scale } = viewport;            
    
                canvas.clear(CanvasKit.TRANSPARENT);
                canvas.save();
    
                canvas.translate(translate[0], translate[1]);
                canvas.translate(origin[0], origin[1]);
                canvas.scale(scale, scale);
                canvas.translate(-origin[0], -origin[1]);                
    
                this.renderItem(item, this);
    
                canvas.restore();

                this.surface.requestAnimationFrame(drawFrame);
            }

            this.surface.requestAnimationFrame(drawFrame);
    
        }

    }

    updateViewport() {

    }

    renderItem (item, renderer, canvas) {
        const currentRenderer = this.getRendererInstance(item);

        if (currentRenderer) {
            return currentRenderer.renderItem(item, renderer, canvas);   
        }
    }

    to(type, item) {
        const currentRenderer = this.getRendererInstance(item);

        if (isFunction(currentRenderer[type])) {
            return currentRenderer[type].call(currentRenderer, item);
        }


        const defaultInstance = this.getDefaultRendererInstance();

        if (isFunction(defaultInstance[type])) {
            return defaultInstance[type].call(defaultInstance, item);
        }
    }

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
    update (item, currentElement, editor) {
        const currentRenderer = this.getRendererInstance(item);

        if (isFunction(currentRenderer.update)) {
            return currentRenderer.update(item, currentElement, editor);
        }

        return this.getDefaultRendererInstance().update(item, currentElement, editor);
    }
}