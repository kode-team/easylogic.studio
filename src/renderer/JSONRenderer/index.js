import { Item } from '@items/Item';
import ArtBoardRender from './ArtBoardRender';
import CircleRender from './CircleRender';
import ImageRender from './ImageRender';
import ProjectRender from './ProjectRender';
import RectRender from './RectRender';
import SVGPathRender from './SVGPathRender';
import SVGTextPathRender from './SVGTextPathRender';
import SVGTextRender from './SVGTextRender';
import TextRender from './TextRender';
import VideoRender from './VideoRender';
import TemplateRender from './TemplateRender';
import IFrameRender from './IFrameRender';

const renderers = {
    'project': new ProjectRender(),
    'artboard': new ArtBoardRender(),
    'rect': new RectRender(),
    'circle': new CircleRender(),
    'image': new ImageRender(),
    'template': new TemplateRender(),
    'iframe': new IFrameRender(),
    'text': new TextRender(),
    'video': new VideoRender(),
    'svg-path': new SVGPathRender(),
    'svg-text': new SVGTextRender(),
    'svg-textpath': new SVGTextPathRender(),

}

export default {
    /**
     * 
     * @param {Item} item 
     */
    async render (item, renderer) {
        if (!item) return;
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return await currentRenderer.render(item, renderer || this);
        }
    },

    async getResourceDataURI (item, renderer) {
        
    }

}