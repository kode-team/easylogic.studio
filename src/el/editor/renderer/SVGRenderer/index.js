import Dom from 'el/base/Dom';
import { Item } from 'el/editor/items/Item';
import { RendererManager } from 'el/editor/manager/RendererManager';
import ArtBoardRender from './ArtBoardRender';
import CircleRender from './CircleRender';
import IFrameRender from './IFrameRender';
import ImageRender from './ImageRender';
import ProjectRender from './ProjectRender';
import RectRender from './RectRender';
import SVGPathRender from './SVGPathRender';
import SVGTextPathRender from './SVGTextPathRender';
import SVGTextRender from './SVGTextRender';
import TemplateRender from './TemplateRender';
import TextRender from './TextRender';
import VideoRender from './VideoRender';


const renderers = {
    'project': new ProjectRender(),
    'artboard': new ArtBoardRender(),
    'rect': new RectRender(),
    'circle': new CircleRender(),
    'image': new ImageRender(),
    'template': new TemplateRender(),
    'iframe': new IFrameRender(),
    'video': new VideoRender(),
    'text': new TextRender(),
    'svg-path': new SVGPathRender(),
    'svg-text': new SVGTextRender(),
    'svg-textpath': new SVGTextPathRender(),
}

export default {
    getDefaultRendererInstance () {
        return renderers['rect'];
    },

    getRendererInstance (item) {
        return renderers[item.itemType] || RendererManager.getRendererInstance('svg', item.itemType) || this.getDefaultRendererInstance() || item;
    },


    /**
     * 
     * @param {Item} item 
     */
    render (item, renderer, encoding = false) {
        if (!item) return '';

        const currentRenderer = this.getRendererInstance(item);

        if (currentRenderer) {
            return currentRenderer.render(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toCSS (item) {
        const currentRenderer = this.getRendererInstance(item);

        if (currentRenderer) {
            return currentRenderer.toCSS(item);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toTransformCSS (item) {
        const currentRenderer = this.getRendererInstance(item);

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
        const currentRenderer = this.getRendererInstance(item);

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
        const currentRenderer = this.getRendererInstance(item);

        if (currentRenderer) {
            return currentRenderer.update(item, currentElement);
        }
    },    

    /**
     * 코드 뷰용 HTML 코드를 렌더링 한다. 
     * @param {Item} item 
     */
    codeview (item) {

        if (!item) {
            return '';
        }

        let svgCode = this.render(item);
        svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 
    
        return /*html*/`
          <div class='svg-code'>
            ${svgCode && /*html*/`<div><pre title='SVG'>${svgCode}</pre></div>`}
          </div>
        `
    
    }    
}