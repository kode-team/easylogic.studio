import SVGItemRender from "./SVGItemRender";

export default class SVGPathItemRender extends SVGItemRender {
    async toCloneObject(item, renderer) {
      return {
        ...(await super.toCloneObject(item, renderer)),
        ...item.attrs('d')
      }        
    }
}