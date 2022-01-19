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
      fill: 'transparent',
      'fill-rule': 'nonzero',
      'text-anchor': 'start',
      'stroke-dasharray': [],
      'stroke-dashoffset': 0,
      ...obj
    });
  }

  /**
   * svg item 의 경우 부모가 boolean 연산을 수행할 때 
   * drag 로 하위 패스를 선택하지 못하도록 막는다. 
   */
  get isDragSelectable() {
    return this.isBooleanItem === false;
  }

  get isBooleanItem() {
    return Boolean(this.parent.is('boolean-path'));
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
   * @returns {boolean}
   */
   hasPoint (x, y) {
    const obj = this.attrs('fill', 'stroke', 'fill-opacity', 'stroke-width');

    const fill = obj.fill;
    const fillOpacity = obj['fill-opacity'];
    const strokeWidth = obj['stroke-width'];

    const isTransparent = fill === 'transparent' || fillOpacity === 0 || Color.parse(fill).a === 0;
    const isZeroStroke = strokeWidth === 0;


    if (isTransparent) {
      return this.isPointInStroke(x, y);
    } else if (!isTransparent && !isZeroStroke) {
      return this.isPointInStroke(x, y) || this.isPointInFill(x, y);
    } else if (!isTransparent && isZeroStroke) {
      return this.isPointInFill(x, y);
    }

    // svg item 쪽에서는 결과가 없으면 그냥 false 를 리턴해서 체크가 안되도록 해야한다. 
    return false;
  }  


  /**
   * fill 속에 점(Point)이 있는지 확인한다.
   * 
   * @param {*} x 
   * @param {*} y 
   * @returns {boolean}
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


  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
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

  /**
   * 
   * @param {number} distX 
   * @param {number} distY 
   * @returns {Object}
   */
  convertStrokeToPath(distX = 10, distY = 10) {

    const attrs = this.attrs('name', 'width', 'parentId', 'height', 'x', 'y', 'transform', 'stroke');        

    attrs.fill = attrs.stroke;
    delete attrs.stroke;

    return {
      itemType: 'svg-path',
      'fill-rule': 'evenodd',
      ...attrs,
      x: Length.parse(attrs.x).add(distX),
      y: Length.parse(attrs.y).add(distY)      
    }
  }  


  /**
   * 
   * @returns {Object}
   */
  toSVGPath() {
    const attrs = this.toCloneObject();

    delete attrs.id;
    delete attrs.itemType;

    return {
      ...attrs,
      d: this.d,
    };
  }  
}
