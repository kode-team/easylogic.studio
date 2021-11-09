import PathParser from "el/editor/parser/PathParser";
import icon from "el/editor/icon/icon";
import { SVGItem } from "./SVGItem";
import { vec3 } from "gl-matrix";


export class SVGStarItem extends SVGItem {

  getIcon () {
    return icon.star;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'star',
      name: "New Star",   
      'stroke-width': 1,
      d: '',        // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다. 
      count: 3,     // outer radius
      radius: 0.5,  // inner radius rate 
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }

  get d() {
    const {width, height, count, radius} = this.json;

    return PathParser.makeStar(width.value, height.value, count, radius).d;
  }
 

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('count', 'radius')
    }
  }

  getDefaultTitle() {
    return "Star";
  }
}