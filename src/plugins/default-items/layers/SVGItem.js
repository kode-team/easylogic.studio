import { Layer } from "el/editor/items/Layer";


const expectedProperties = [
  'appearance',
  'border',
  'border-radius',
  'background-image',
  'backdrop-filter',
  'clip-path',
  'pattern',
  'box-shadow',
  'layout',
  'transform',
  'transform-origin',
  'perspective',
  'perspective-origin',
  'backdrop-filter',
]

const expectedPropertiesKeys = {}

expectedProperties.forEach(key => {
  expectedPropertiesKeys[key] = true
})

export class SVGItem extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New SVG",
      elementType: 'svg',
      overflow: 'visible',         
      stroke: 'black',
      'stroke-width': 1,
      'svgfilter': '',
      fill: 'transparent',
      'fill-rule': '',
      'fill-opacity': '',
      'stroke-linecap': '',
      'stroke-linejoin': '',      
      'stroke-dashoffset': 0, 
      'stroke-dasharray': ' ',
      'text-anchor': 'start',
      ...obj
    });
  }

  editable(editablePropertyName) {

    if (expectedPropertiesKeys[editablePropertyName]) {
      return false;
    }

    switch(editablePropertyName) {
    case 'svg-item':
      return true; 
    }

    return super.editable(editablePropertyName);
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
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
      )

    }
  }

  getDefaultTitle() {
    return "SVG";
  }

  isSVG() {
    return true; 
  }
}
