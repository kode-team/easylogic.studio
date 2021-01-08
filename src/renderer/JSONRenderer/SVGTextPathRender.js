import SVGItemRender from "./SVGItemRender";

export default class SVGTextPathRender extends SVGItemRender {
    toCloneObject(item, renderer) {
      return {
        ...super.toCloneObject(item, renderer),
        ...item.attrs(
          'totalLength',
          'd',
          'text', 
          'textLength',
          'lengthAdjust',
          'startOffset'        
        )
      }        
    }
}