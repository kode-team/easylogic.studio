import DomRender from "./DomRender";

export default class LayerRender extends DomRender {
    toCloneObject(item, renderer) {
        return {
            ...super.toCloneObject(item, renderer),
            ...item.attrs('tagName')
        }
    }
}