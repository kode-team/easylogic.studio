import PathParser from "el/editor/parser/PathParser";
import { hasSVGProperty, hasCSSProperty, hasSVGPathProperty } from "el/editor/util/Resource";
import icon from "el/editor/icon/icon";
import { SVGItem } from "./SVGItem";


export class SVGPathItem extends SVGItem {

  getIcon () {
    return icon.edit;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-path',
      name: "New Path",   
      'stroke-width': 1,
      d: '',        // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다. 
      totalLength: 0,
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }
 

  setCache () {

    super.setCache();

    // 캐쉬 할 때는  0~1 사이 값으로 가지고 있다가 
    this.cachePath = new PathParser(this.json.d)
    this.cachePath.scale(1/this.json.width.value, 1/this.json.height.value)
  }

  recover () {

    super.recover();

    // 캐쉬가 없는 상태에서는 초기 캐쉬를 생성해준다. 
    if (!this.cachePath) this.setCache();

    var sx = this.json.width.value
    var sy = this.json.height.value

    // 마지막 크기(width, height) 기준으로 다시 확대한다. 
    this.json.d = this.cachePath.clone().scaleTo(sx, sy)

  }


  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('d')
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

}