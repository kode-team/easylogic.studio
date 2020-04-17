import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { clone, OBJECT_TO_PROPERTY, CSS_TO_STRING } from "../../../util/functions/func";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "../../util/Resource";
import { Length } from "../../unit/Length";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";
import { getXYListinPath } from "../../util/interpolate-functions/offset-path/getXYListinPath";

export class SVGBrushItem extends SVGItem {

  getIcon () {
    return icon.brush;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-brush',
      name: "New Brush",
      d: '',
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
    return "Brush";
  }

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property) && hasSVGPathProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] path`, properties: svgProperties }
    ] 
  }  


  updateFunction (currentElement, isChangeFragment = true, isLast = false) {

    var $path = currentElement.$('path');
    $path.attr('d', this.json.d);
    if (isChangeFragment) {
      $path.setAttr({
        'filter': this.toFilterValue,
        'fill': this.toFillValue,
        'stroke': this.toStrokeValue
      })

      this.updateDefString(currentElement)
    
      const useList = getXYListinPath(new PathParser(this.json.d), this.json.totalLength/10 * 2);

      var $items = currentElement.$('.svg-brush-items');
      $items.html(useList.map(xy => {
          return `<use xlink:href='#${this.brushId}' x="${xy.x}" y="${xy.y}" />`
      }).join(''))

    }

    if (isLast) {
      this.json.totalLength = $path.totalLength
    }

  }    

  get toDefInnerString () {
    return /*html*/`
        ${super.toDefInnerString}
        ${this.toBrushSVG}
    `
  }  

  get toBrushSVG () {
    return /*html*/`
      <path id="${this.brushId}" d="M5,0L0,10L10,10 L5,0 Z" fill="black" />
    `
  }

  get brushId () {
    return this.getInnerId('brush');
  }

  get html () {
    var {id} = this.json; 

    const xyList = getXYListinPath(new PathParser(this.json.d), this.json.totalLength/10 * 2);

    var useList = xyList.map(xy => {
        return `<use xlink:href='#${this.brushId}' x="${xy.x}" y="${xy.y}" />`
    }).join('');

    return /*html*/`
  <svg class='element-item brush'  ${OBJECT_TO_PROPERTY({
    "xmlns": "http://www.w3.org/2000/svg"
  })}  data-id="${id}" >
    ${this.toDefString}
    <path ${OBJECT_TO_PROPERTY({
      'class': 'svg-brush-item',
      d: this.json.d, 
      filter: this.toFilterValue,
      fill: this.toFillValue,
      stroke: this.toStrokeValue
    })} />
    <g class='svg-brush-items' style='pointer-events:none;'>
      ${useList}
    </g>
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
        'class': 'svg-brush-item',
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

ComponentManager.registerComponent('svg-brush', SVGBrushItem)
