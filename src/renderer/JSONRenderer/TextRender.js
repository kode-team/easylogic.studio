import LayerRender from "./LayerRender";

export default class TextRender extends LayerRender {
    toCloneObject(item, renderer) {
        return {
            ...super.toCloneObject(item, renderer),
            ...item.attrs('content')
        }
    }
}