import SVGItemRender from "./SVGItemRender";

export default class SVGPathItemRender extends SVGItemRender {
    toCloneObject(item, renderer) {
      return {
        ...super.toCloneObject(item, renderer),
        ...item.attrs('d')
      }        
    }
}