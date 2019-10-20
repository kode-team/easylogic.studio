import { SVGItem } from "./SVGItem";
import { Length } from "../../unit/Length";
import PolygonParser from "../../parse/PolygonParser";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import Dom from "../../../util/Dom";

export class SVGPolygonItem extends SVGItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-polygon',
      name: "New Polygon",   
      points: '',
      totalLength: 0,
      ...obj
    });
  }


  enableHasChildren() {
    return false;  
  }  

  updatePolygonItem (obj) {
    this.json.points = obj.points; 
    this.json.totalLength = obj.totalLength;
    this.json.polygon = new PolygonParser(obj.points);

    this.json.width = Length.px(obj.rect.width);
    this.json.height = Length.px(obj.rect.height);

    this.setScreenX(Length.px(obj.rect.x))
    this.setScreenY(Length.px(obj.rect.y))    
  }

  get d () {
    return this.json.polygon.toPathString();
  }

  setCache () {
    this.rect = {
      width: this.json.width.clone(),
      height: this.json.height.clone()
    }
    this.cachePolygon = this.json.polygon.clone()
  }

  recover () {
    var sx = this.json.width.value / this.rect.width.value 
    var sy = this.json.height.value / this.rect.height.value 

    this.scale(sx, sy);
  }

  scale (sx, sy) {
    this.json.points = this.cachePolygon.clone().scaleTo(sx, sy)
    this.json.polygon.reset(this.json.points)
  }

  convert(json) {
    json = super.convert(json);
    if (json.points)  {      
      json.polygon = new PolygonParser(json.points);
    }

    return json;
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      totalLength: json.totalLength,
      points: json.points
    }
  }

  getDefaultTitle() {
    return "Polygon";
  }

  updateFunction (currentElement, isChangeFragment = true) {
    var $polygon = currentElement.$('polygon');
    $polygon.attr('points', this.json.points);

    if (isChangeFragment) {
      $polygon.setAttr({
        'filter': this.toFilterValue,
        'fill': this.toFillValue,
        'stroke': this.toStrokeValue
      })
  
      var $defs = currentElement.$('defs');
      $defs.html(this.toDefInnerString)
  
    }

    this.json.totalLength = $polygon.el.getTotalLength()
  }  

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { properties: cssProperties, selector: `[data-id="${this.json.id}"]` },
      { properties: svgProperties, selector: `[data-id="${this.json.id}"] polygon` }
    ] 
  }    

  get html () {
    var {id, points} = this.json; 
    return /*html*/`<svg class='element-item polygon' ${OBJECT_TO_PROPERTY({
      'motion-based': this.json['motion-based']
    })} data-id="${id}">
      ${this.toDefString}
      <polygon ${OBJECT_TO_PROPERTY({
        'class': 'svg-polygon-item',
        points, 
        filter: this.json.svgfilter,
        fill: this.toFillValue,
        stroke: this.toStrokeValue
      })} />
    </svg>`
  }
}
