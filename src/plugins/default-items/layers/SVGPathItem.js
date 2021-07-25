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

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField('d')) {
      this.cachePath = new PathParser(this.json.d);
    }
  }

  setCache () {
    super.setCache();

    this.cachePath = new PathParser(this.json.d);
  }

  get d() {

    if (!this.json.d) {
      return null;
    }

    if (!this.cachePath) {
      this.cachePath = new PathParser(this.json.d);
    }

    return this.cachePath.clone().scaleTo(this.json.width.value, this.json.height.value);
  }
 

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      d: this.json.d
    }
  }

  getDefaultTitle() {
    return "Path";
  }

}