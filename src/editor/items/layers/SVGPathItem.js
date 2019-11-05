import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { clone, OBJECT_TO_CLASS, OBJECT_TO_PROPERTY, CSS_TO_STRING } from "../../../util/functions/func";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "../../util/Resource";
import { Length } from "../../unit/Length";
import { SVGFill } from "../../svg-property/SVGFill";
import Dom from "../../../util/Dom";

export class SVGPathItem extends SVGItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-path',
      name: "New Path",   
      d: '',        // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다. 
      segments: [],
      totalLength: 0,
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  updatePathItem (obj) {

    this.json.d = obj.d; 
    this.json.totalLength = obj.totalLength;
    this.json.path = new PathParser(obj.d);

    if(obj.segments) {
      this.json.path.resetSegment(obj.segments);
    }

    if (obj.rect) {

      this.json.width = Length.px(obj.rect.width);
      this.json.height = Length.px(obj.rect.height);
  
      this.setScreenX(Length.px(obj.rect.x))
      this.setScreenY(Length.px(obj.rect.y))
    }

  }
  
  setCache () {
    this.rect = this.clone();
    this.cachePath = this.json.path.clone()

  }

  recover () {

    var baseWidth = this.rect.width.value
    if (baseWidth === 0) baseWidth = 1; 

    var baseHeight = this.rect.height.value
    if (baseHeight === 0) baseHeight = 1;     

    var sx = this.json.width.value / baseWidth 
    var sy = this.json.height.value / baseHeight

    this.scale(sx, sy);
  }

  scale (sx, sy) {
    this.json.d = this.cachePath.clone().scaleTo(sx, sy)
    this.json.path.reset(this.json.d)
  }

  convert(json) {
    json = super.convert(json);
    if (json.d)  {
      json.path = new PathParser(json.d);
    }

    return json;
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      totalLength: json.totalLength,
      d: json.d,
      segments: clone(this.json.segments)
    }
  }

  getDefaultTitle() {
    return "Path";
  }

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property) && hasSVGPathProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] path`, properties: svgProperties }
    ] 
  }  


  updateFunction (currentElement, isChangeFragment = true) {

    var $path = currentElement.$('path');
    $path.attr('d', this.json.d);
    if (isChangeFragment) {
      $path.setAttr({
        'filter': this.toFilterValue,
        'fill': this.toFillValue,
        'stroke': this.toStrokeValue
      })

      this.updateDefString(currentElement)

    }

    this.json.totalLength = $path.totalLength
  }    

  get html () {
    var {id} = this.json; 
    var p = {'motion-based': this.json['motion-based'] }

    return /*html*/`
  <svg class='element-item path ${OBJECT_TO_CLASS(p)}'  ${OBJECT_TO_PROPERTY({
    'motion-based': this.json['motion-based'],
    "xmlns": "http://www.w3.org/2000/svg"
  })}  data-id="${id}" >
    ${this.toDefString}
    <path ${OBJECT_TO_PROPERTY({
      'class': 'svg-path-item',
      d: this.json.d, 
      filter: this.toFilterValue,
      fill: this.toFillValue,
      stroke: this.toStrokeValue
    })} />
  </svg>`
  }


  get svg () {
    var x = this.json.x.value;
    var y = this.json.y.value;
    return this.toSVG(x, y);
  }

  toSVG(x = 0, y = 0) {
    return /*html*/`
      <g transform="translate(${x}, ${y})">
      ${this.toDefString}
      <path ${OBJECT_TO_PROPERTY({
        'class': 'svg-path-item',
        d: this.json.d, 
        filter: this.toFilterValue,
        fill: this.toFillValue,
        stroke: this.toStrokeValue,
        ...this.toSVGAttribute(),
        style: CSS_TO_STRING(this.toSVGCSS())      
      })} />
    </g>
  `
  }
}
