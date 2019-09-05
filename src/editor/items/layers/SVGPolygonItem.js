import { SVGItem } from "./SVGItem";
import { Length } from "../../unit/Length";
import PolygonParser from "../../parse/PolygonParser";

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


  toNestedCSS() {
    return [
      {
        selector: 'polygon', 
        css: super.toSVGDefaultCSS()
      }
    ]
  }

  updateFunction (currentElement) {
    var $polygon = currentElement.$('polygon');
    $polygon.attr('points', this.json.points);
    this.json.totalLength = $polygon.el.getTotalLength()
  }  

  get html () {
    var {id, points} = this.json; 
    return `
      <svg class='element-item polygon' data-id="${id}" >
        <polygon class='svg-polygon-item' points="${points}" />
      </svg>    
    `
  }
}
