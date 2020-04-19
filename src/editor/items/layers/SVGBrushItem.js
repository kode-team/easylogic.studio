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
      distance: 0,
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

    var $path = currentElement.$('path.svg-brush-item');
    $path.attr('d', this.json.d);

    if (isChangeFragment) {
      this.updateDefString(currentElement)
      const $items = currentElement.$('.svg-brush-items')
      $items.attr('filter', this.toFilterValue);
      $items.attr('fill', this.toFillValue);
      $items.attr('fill-opacity', this.toFillOpacityValue);
      $items.updateSVGDiff(this.makeBrushItem(this.json['stroke-width']));
    }

    if (isLast) {
      this.json.totalLength = $path.totalLength
    }

  }    

  get toDefInnerString () {
    return /*html*/`
        ${super.toDefInnerString}
    `
  }  

  makeBrushShape (x, y, r = 1, t = 0) {
    return /*html*/`
      <image ${OBJECT_TO_PROPERTY({
        'xlink:href': 'http://www.tricedesigns.com/wp-content/uploads/2012/01/brush2.png',
        x,
        y,
        width: `${r}px`,
        height: `${r}px`,
        transform: `rotate(${360*Math.random()}, ${x}, ${y})`
      })}></image>
    `
  }

  get brushId () {
    return this.getInnerId('brush');
  }

  makeBrushItem (radius = 1) {
    return this.makeBrushItemRate().map(xy => {
      return this.makeBrushShape(xy.x, xy.y, radius * xy.scale, xy.t)
    }).join('');
  }

  makeBrushItemRate () {
    var { d, totalLength, distance} = this.json; 

    const xyList = getXYListinPath(new PathParser(d), totalLength, distance);
    var useList = xyList.map(xy => {
        let t = (xy.t > 0.5) ? 1 - xy.t : xy.t; 

        return { ...xy, scale: t/0.4 * 1.3 }
    });

    return useList;
  }

  get html () {
    var { id, d} = this.json; 

    const useList = this.makeBrushItem(this.json['stroke-width']);

    return /*html*/`
  <svg class='element-item brush' data-id="${id}" >
    ${this.toDefString}
    <path class='svg-brush-item' d="${d}" fill="transparent" stroke="transparent" stroke-width="3" style='pointer-events: stroke;' />
    <g class='svg-brush-items' style='pointer-events:none;' 
        filter="${this.toFilterValue}" 
        fill="${this.toFillValue}" 
        stroke='transparent'
        fill-opacity="${this.toFillOpacityValue}"
      >
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
