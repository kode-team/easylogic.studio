import SVGItemRender from "./SVGItemRender";

export default class SVGStarRender extends SVGItemRender {
    async toCloneObject(item, renderer) {
      return {
        ...(await super.toCloneObject(item, renderer)),
        ...item.attrs('count', 'radius')
      }        
    }
}