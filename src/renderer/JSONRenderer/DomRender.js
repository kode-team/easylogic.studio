import MovableRender from "./MovableRender";

export default class DomRender extends MovableRender {
  
  toCloneObject (item, renderer) {
    return {
      ...super.toCloneObject(item, renderer),
      ...item.attrs(
        'position',
        'right',
        'bottom',
        'rootVariable',
        'variable',
        'transform',
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
        'transform-origin',
        'transform-style',      
        'perspective',
        'mix-blend-mode',
        'overflow',
        'opacity',
        'rotate',
        'flex-layout',      
        'grid-layout',         
        'animation',      
        'transition',  
      ),
      selectors: item.selectors.map(selector => selector.clone()),
      svg: item.svg.map(svg => svg.clone())
    }
  }

}