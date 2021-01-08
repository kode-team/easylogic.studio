import SVGItemRender from "./SVGItemRender";

export default class SVGTextRender extends SVGItemRender {
    toCloneObject(item, renderer) {
      return {
        ...super.toCloneObject(item, renderer),
        ...item.attrs(
          'totalLength',
          'text', 
          'textLength',
          'lengthAdjust',      
          'shape-inside'
        )
      }        
    }
}