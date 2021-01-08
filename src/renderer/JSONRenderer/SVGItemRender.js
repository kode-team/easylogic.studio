import LayerRender from "./LayerRender";

export default class SVGItemRender extends LayerRender {
    toCloneObject(item, renderer) {
        return {
            ...super.toCloneObject(item, renderer),
            ...item.attrs(
              'overflow',
              'stroke',
              'stroke-width',
              'svgfilter',
              'fill',
              'fill-rule',
              'fill-opacity',
              'stroke-linecap',
              'stroke-linejoin',
              'stroke-dashoffset',
              'stroke-dasharray',
              'text-anchor',
              'motion-based'
            )
      
          }        
    }
}