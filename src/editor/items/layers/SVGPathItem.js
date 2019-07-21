import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { Length } from "../../unit/Length";

export class SVGPathItem extends SVGItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-path',
      name: "New Path",
      overflow: 'visible',      
      d: '',
      stroke: 'black',
      'stroke-width': 1,
      fill: 'transparent',
      ...obj
    });
  }

  updatePathItem (obj) {
    this.json.d = obj.d; 
    this.json.path = new PathParser(obj.d);

    this.setScreenX(obj.x);
    this.setScreenY(obj.y);
    this.json.width = Length.px(obj.width);
    this.json.height = Length.px(obj.height);
  }

  setCache () {
    this.rect = this.clone();
    this.cachePath = this.json.path.clone()
  }

  recover () {
    var sx = this.json.width.value / this.rect.width.value 
    var sy = this.json.height.value / this.rect.height.value 

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
      overflow: json.overflow,
      d: json.d,
      stroke: json.stroke,
      'stroke-width': json['stroke-width'],
      fill: json.filll
    }
  }

  getDefaultTitle() {
    return "Path";
  }


  toNestedCSS() {
    var json = this.json; 
    return [
      {
        selector: 'path', 
        css: {
          d: `path('${json.d}')`,
          ...this.toKeyListCSS('stroke', 'stroke-width', 'fill')
        }
      }
    ]
  }

  get html () {
    var {id} = this.json; 
    return `
      <svg class='element-item path' data-id="${id}" >
        <path class='svg-path-item' />
      </svg>    
    `
  }
}
