import PathParser from "el/editor/parser/PathParser";
import icon from "el/editor/icon/icon";
import { SVGItem } from "./SVGItem";
import { vec3 } from "gl-matrix";


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

  reset(json, context = {origin: '*'}) {
    const isChanged = super.reset(json, context);

    if (this.hasChangedField('d')) {
      // d 속성이 변경 될 때 성능을 위해서 PathParser 로 미리 객체를 생성해준다. 
      // 이때 width, height 를 같이 해둬야 한다. 
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width.value;
      this.cacheHeight = this.json.height.value;

      // this.modelManager.setChanged('resetCache', this.id, { path: this.cachePath, width: this.cacheWidth, height: this.cacheHeight });
    }

    return isChanged;
  }

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField('d')) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width.value;
      this.cacheHeight = this.json.height.value;
    } else if (this.hasChangedField('width', 'height')) {
      this.json.d = this.cachePath.clone().scale(this.json.width.value/this.cacheWidth, this.json.height.value/this.cacheHeight).d;
      this.modelManager.setChanged('reset', this.id, { d : this.json.d });
    }

    // this.modelManager.setChanged('refreshMatrixCache', this.id, { start: true, redefined: true })                
  }

  setCache () {
    super.setCache();

    this.cachePath = new PathParser(this.json.d);
    this.cacheWidth = this.json.width.value;
    this.cacheHeight = this.json.height.value;    
  }

  get d() {

    if (!this.json.d) {
      return null;
    }

    if (!this.cachePath) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width.value;
      this.cacheHeight = this.json.height.value;          
    }

    return this.cachePath.clone().scale(this.json.width.value/this.cacheWidth, this.json.height.value/this.cacheHeight).d;
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