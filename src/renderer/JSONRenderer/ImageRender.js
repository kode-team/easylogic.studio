import LayerRender from "./LayerRender";

export default class ImageRender extends LayerRender {
    async toCloneObject(item, renderer) {
        const src = item.src; 
        return {
            ...(await super.toCloneObject(item, renderer)),
            src: src
        }
    }
}