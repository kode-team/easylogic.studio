import MovableRender from "./MovableRender";

export default class DomRender extends MovableRender {
  
  async toCloneObject (item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs(
        'position',
        'rootVariable',
        'variable',
        'filter',
        'backdrop-filter',
        'background-color',      
        'background-image',      
        'text-clip',
        'border-radius',      
        'border',
        'box-shadow',
        'text-shadow',
        'clip-path',
        'color',
        'font-size',
        'font-stretch',
        'line-height',
        'text-align',
        'text-transform',
        'text-decoration',
        'letter-spacing',
        'word-spacing',
        'text-indent',      
        'perspective-origin',
        'transform-style',      
        'perspective',
        'mix-blend-mode',
        'overflow',
        'opacity',   
        'animation',      
        'transition',  
      ),
      selectors: item.selectors.map(selector => selector.clone()),
      svg: item.svg.map(svg => svg.clone())
    }
  }

}