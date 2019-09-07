import PathParser from "../../parse/PathParser";
import { SVGItem } from "./SVGItem";
import { Length } from "../../unit/Length";
import { clone, OBJECT_TO_CLASS } from "../../../util/functions/func";

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

    // this.setScreenX(obj.x);
    // this.setScreenY(obj.y);
    // this.json.width = Length.px(obj.width);
    // this.json.height = Length.px(obj.height);
  }

  updateFunction (currentElement) {
    this.json.totalLength = currentElement.$('path').el.getTotalLength();
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
      totalLength: json.totalLength,
      d: json.d,
      segments: clone(this.json.segments)
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
          ...super.toSVGDefaultCSS()
        }
      }
    ]
  }

  get html () {
    var {id} = this.json; 
    return /*html*/`
      <svg class='element-item path ${OBJECT_TO_CLASS({
        'motion-based': this.json['motion-based']
      })}' data-id="${id}" >
        <path class='svg-path-item' />
      </svg>    
    `
  }
}
