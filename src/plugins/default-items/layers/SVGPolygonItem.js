import PathParser from "el/editor/parser/PathParser";
import icon from "el/editor/icon/icon";
import { SVGItem } from "./SVGItem";
import { vec3 } from "gl-matrix";


export class SVGPolygonItem extends SVGItem {

  getIcon () {
    return icon.edit;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'polygon',
      name: "New Polygon",   
      'stroke-width': 1,
      d: '',        // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다. 
      count: 3,     // 기본 변의 개수는 3개 , 삼각형 
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }

  get d() {
    const {width, height, count} = this.json;

    return PathParser.makePolygon(width.value, height.value, count).d;
  }
 

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('count')
    }
  }

  getDefaultTitle() {
    return "Polygon";
  }

  isPointInPath (point) {

    const localPoint = vec3.transformMat4([], point, this.accumulatedMatrixInverse);

    return this.cachePath.isPointInPath({ x: localPoint[0], y: localPoint[1] }, this.json['stroke-width'] || 0);
  }  

}