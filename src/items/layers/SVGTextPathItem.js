import PathParser from "@parser/PathParser";
import { SVGItem } from "./SVGItem";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "@util/Resource";
import { Length } from "@unit/Length";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";

export class SVGTextPathItem extends SVGItem {

  getIcon () {
    return icon.text_rotate;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-textpath',
      name: "New TextPath",   
      d: '',
      // segments: [],
      totalLength: 0,
      fill: 'rgba(0, 0, 0, 1)',
      text: 'Insert a text', 
      textLength: Length.em(0),
      lengthAdjust: 'spacingAndGlyphs',
      startOffset: Length.em(0),
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  setCache () {
    // 캐쉬 할 때는  0~1 사이 값으로 가지고 있다가 
    this.cachePath = new PathParser(this.json.d)
    this.cachePath.scale(1/this.json.width.value, 1/this.json.height.value)
  }

  recover () {

    // 캐쉬가 없는 상태에서는 초기 캐쉬를 생성해준다. 
    if (!this.cachePath) this.setCache();

    var sx = this.json.width.value
    var sy = this.json.height.value

    // 마지막 크기(width, height) 기준으로 다시 확대한다. 
    this.json.d = this.cachePath.clone().scaleTo(sx, sy)

  }


  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);
    json.startOffset = Length.parse(json.startOffset);

    return json;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'totalLength',
        'd',
        'text', 
        'textLength',
        'lengthAdjust',
        'startOffset'        
      )
    }
  }

  getDefaultTitle() {
    return "TextPath";
  }

  toAnimationKeyframes (properties) {

    var svgProperties = properties.filter(it => hasSVGProperty(it.property));
    var svgPathProperties = properties.filter(it => hasSVGPathProperty(it.property));
    var cssProperties = properties.filter(it => hasCSSProperty(it.property));

    return [
      { selector: `[data-id="${this.json.id}"]`, properties: cssProperties  },
      { selector: `[data-id="${this.json.id}"] textPath`, properties: svgProperties },
      { selector: `[data-id="${this.json.id}"] path`, properties: svgPathProperties }
    ] 
  }  


}

ComponentManager.registerComponent('svg-textpath', SVGTextPathItem); 