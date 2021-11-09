import { LayerModel } from "el/editor/model/LayerModel";
import { Length } from 'el/editor/unit/Length';
import Color from "el/utils/Color";


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
  'box-model',
]

const expectedPropertiesKeys = {}

expectedProperties.forEach(key => {
  expectedPropertiesKeys[key] = true
})

export class SVGItem extends LayerModel {
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


  /**
   * 
   * 특정 포인트가 현재 path 의 stroke, fill 에 속하는지 확인한다.
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns 
   */
   hasPoint (x, y) {

    const fill = this.json.fill;
    const fillOpacity = this.json['fill-opacity'];
    const strokeWidth = this.json['stroke-width'];

    const isTransparent = fill === 'transparent' || fillOpacity === 0 || Color.parse(fill).a === 0;
    const isZeroStroke = strokeWidth === 0;


    if (isTransparent) {
      return this.isPointInStroke(x, y);
    } else if (!isTransparent && !isZeroStroke) {
      return this.isPointInStroke(x, y) || this.isPointInFill(x, y);
    } else if (!isTransparent && isZeroStroke) {
      return this.isPointInFill(x, y);
    }

    return super.hasPoint(x, y); 
  }  


  /**
   * fill 속에 점(Point)이 있는지 확인한다.
   * 
   * @param {*} x 
   * @param {*} y 
   * @returns 
   */
  isPointInFill(x, y) {
    const svgEl = this.getCache("svgElement")
    const pathEl = this.getCache("pathElement")

    if (pathEl) {
      const [localX, localY] = this.invertPoint([x, y, 0])

      const point = svgEl.createSVGPoint();
      Object.assign(point, {x: localX, y: localY});

      return pathEl.isPointInFill(point);
    }

    return false;
  }

  isPointInStroke(x, y) {
    const svgEl = this.getCache("svgElement")
    const pathEl = this.getCache("pathElement")

    if (pathEl) {
      const [localX, localY] = this.invertPoint([x, y, 0])

      const point = svgEl.createSVGPoint();
      Object.assign(point, {x: localX, y: localY});

      return pathEl.isPointInStroke(point);
    }

    return false;
  }

  convertStrokeToPath(distX = 10, distY = 10) {

    const attrs = this.attrs('width', 'parentId', 'height', 'x', 'y', 'transform');        
    const localFill = this.json.stroke

    return {
      itemType: 'svg-path',
      name: this.json.name,
      fill: localFill,
      'fill-rule': 'evenodd',
      // 'stroke': 'transparent',
      ...attrs,
      x: Length.parse(attrs.x).add(distX),
      y: Length.parse(attrs.y).add(distY)      
    }
  }  
}
