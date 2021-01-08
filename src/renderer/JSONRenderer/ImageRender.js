import LayerRender from "./LayerRender";

export default class ImageRender extends LayerRender {
    toCloneObject(item, renderer) {
        return {
            ...super.toCloneObject(item, renderer),
            ...item.attrs('src')
        }
    }
}