import PathParser from "el/editor/parser/PathParser";
import icon from "el/editor/icon/icon";
import { SVGPathItem } from './SVGPathItem';
import { isUndefined } from 'el/sapa/functions/func';
import { Length } from "el/editor/unit/Length";


export class BooleanPathItem extends SVGPathItem {

  getIcon () {
    return icon.edit;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'boolean-path',
      name: "New Boolean Path",   
      'stroke-width': 1,
      d: '',        // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다. 
      'boolean-operation': 'none',
      ...obj
    });
  }

  enableHasChildren() {
    return true;
  }

  reset(json, context = {origin: '*'}) {
    const isChanged = super.reset(json, context);

    if (!this.cachePath) {
      this.setCache();
    }

    if (this.hasChangedField('changedChildren', 'boolean-operation')) {


      if (this.json.children.length === 1) {
        const newPath = this.layers[0].accumulatedPath().d;
        this.json.d = this.invertPath(newPath).d;
        this.setCache();

        this.modelManager.setChanged('reset', this.id, { d : newPath });

      } else if (this.json['boolean-operation'] !== 'none') {
        if (this.json.children?.length >= 2) {

          if (this.modelManager.editor.pathKitManager.has()) {
            const paths = this.layers.filter(it => it.d)
    
            if (paths.length >= 2) {      
              const newPath = this.doBooleanOperation();

              this.json.d = newPath;
              this.setCache();

              this.modelManager.setChanged('reset', this.id, { d : newPath });
            } else {
              this.json.d = undefined;
              this.removeCache();
              this.modelManager.setChanged('reset', this.id, { d : undefined });
            }
          }
    
        }

      }
    }

    // if (this.hasChangedField('width', 'height') ) {

    //   if (context.doNotChildrenScale) {
    //     // this.setCache();      
    //   } else {
    //     // boolean path 의 크기(width, height)가 변경이 되면 
    //     // 하위 layers 들의 크기도 같이 변경 된다. 
    //     // 이건 layout 과 상관 없이 처리된다. 
    //     const scaleX = isUndefined(this.cacheWidth) ? 1 : this.json.width.value/this.cacheWidth;
    //     const scaleY = isUndefined(this.cacheHeight) ? 1 : this.json.height.value/this.cacheHeight;

    //     // 비율이 동일할때는 자식을 변경하지 않는다. 
    //     if (scaleX === 1 && scaleY === 1) {
    //       return;
    //     }

    //     console.log(scaleX, scaleY);

    //     // 비율이 동일하지 않으면 자식을 변경할 수 있다. 
    //     this.cacheLayers.forEach(it => {

    //       const matrix = it.matrix;

    //       const x = Length.px(matrix.x * scaleX);
    //       const y = Length.px(matrix.y * scaleY);
    //       const width = Length.px(matrix.width * scaleX);
    //       const height = Length.px(matrix.height * scaleY);

    //       // 변경 이후에 
    //       it.item.reset({
    //         x, y, width, height
    //       })

    //       // 변화에 대한 메세지를 남긴다. 
    //       this.modelManager.setChanged('reset', it.id, { x, y, width, height });        
    //     })
    //   }
    // }

    return isChanged;
  }

  /**
   * boolean-path 의 경우 selection tool 에서 변화가 있을 때 내부 자식을 변경하도록 강제한다. 
   */
  get resizableWitChildren () {
    return true;
  }
    

  getFieldValueByBooleanOperation(field) {
    const layers = this.layers;

    if (layers.length === 0) {
      return;
    } else if (layers.length === 1) {
      return layers[0][field]
    }

    const op = this['boolean-operation']

    switch(op) {
      case "difference": return layers[1][field];
      case "intersection": break;
      case "union": break;
      case "reverse-difference": break;
      case "xor": break;
    }

    return layers[0][field];     
  }

  get fill () {
    return this.getFieldValueByBooleanOperation('fill');
  }

  get stroke () {
    return this.getFieldValueByBooleanOperation('stroke');
  }  

  setCache () {
    super.setCache();

    this.cachePath = new PathParser(this.json.d);
    this.cacheWidth = this.json.width.value;
    this.cacheHeight = this.json.height.value;    
  }

  removeCache () {
    super.removeCache();

    this.cachePath = undefined;
    this.cacheWidth = undefined;
    this.cacheHeight = undefined;
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


  doBooleanOperation() {
    const op = this.json['boolean-operation']
    switch(op) {
    case "intersection": return this.intersection();
    case "union": return this.union();
    case "difference": return this.difference();
    case "reverse-difference": return this.reverseDifference();
    case "xor": return this.xor();
    }

    return "";
  }

  getPathList() {
    return this.layers.map(it => it.accumulatedPath().d);
  }

  intersection() {
    const [first, ...rest] = this.getPathList(); 

    const newPath = rest.reduce((path1, path2) => {
      return this.modelManager.editor.pathKitManager.intersection(path1, path2) 
    }, first);

    // boolean path 의 결과값이 내부의 값으로 되어 있음. 
    return this.invertPath(newPath).d;
  }

  union() {
    const [first, ...rest] = this.getPathList(); 

    const newPath = rest.reduce((path1, path2) => {
      return this.modelManager.editor.pathKitManager.union(path1, path2) 
    }, first);

    return this.invertPath(newPath).d;
  }

  difference() {
    const [first, ...rest] = this.getPathList(); 

    const newPath = rest.reduce((path1, path2) => {
      return this.modelManager.editor.pathKitManager.difference(path1, path2) 
    }, first);

    return this.invertPath(newPath).d;
  }

  reverseDifference() {
    const [first, ...rest] = this.getPathList(); 

    const newPath = rest.reduce((path1, path2) => {
      return this.modelManager.editor.pathKitManager.reverseDifference(path1, path2) 
    }, first);

    return this.invertPath(newPath).d;
  }  

  xor() {
    const [first, ...rest] = this.getPathList(); 

    const newPath = rest.reduce((path1, path2) => {
      return this.modelManager.editor.pathKitManager.xor(path1, path2) 
    }, first);

    return this.invertPath(newPath).d;
  }  
}