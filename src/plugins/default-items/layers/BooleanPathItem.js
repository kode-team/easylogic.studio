import {PathParser} from 'el/editor/parser/PathParser';
import icon from "el/editor/icon/icon";
import { SVGPathItem } from './SVGPathItem';
import { BooleanOperation } from "el/editor/types/model";


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
        const newPath = this.layers[0].absolutePath().d;
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

    return isChanged;
  }

  /**
   * boolean-path 의 경우 selection tool 에서 변화가 있을 때 내부 자식을 변경하도록 강제한다. 
   */
  get resizableWitChildren () {
    return true;
  }


  startToCacheChildren() {

    // if (!this.resizableWitChildren) return;

    this.cachedSize = {
        width: this.json.width.clone(),
        height: this.json.height.clone()
    }
    this.cachedLayerMatrix = this.layers.map(item => {
        item.startToCacheChildren();

        return {
            item, matrix: item.matrix
        }
    })
}

/**
 * 상위 레이어에 맞게 자식 레이어의 공간(x,y,width,height)를 변경한다.
 */
 recoverChildren() {

    // if (!this.resizableWitChildren) return;

    const obj = {
        width: this.json.width.clone(),
        height: this.json.height.clone()
    }

    const scaleX = obj.width / this.cachedSize.width;
    const scaleY = obj.height / this.cachedSize.height;

    this.cachedLayerMatrix.forEach(({ item, matrix, constraints }) => {
        item.reset({ 
            x: item.x.changeUnitValue(matrix.x * scaleX, obj.width),
            y: item.y.changeUnitValue(matrix.y * scaleY, obj.height),
            width: item.width.changeUnitValue(matrix.width * scaleX, obj.width),
            height: item.height.changeUnitValue(matrix.height * scaleY, obj.height),
        })

        item.recoverChildren();
    })
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
      case BooleanOperation.DIFFERENCE: return layers[1][field];
      default: break;
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
    this.cacheWidth = this.json.width;
    this.cacheHeight = this.json.height;    
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
    case BooleanOperation.INTERSECTION: return this.intersection();
    case BooleanOperation.UNION: return this.union();
    case BooleanOperation.DIFFERENCE: return this.difference();
    case BooleanOperation.REVERSE_DIFFERENCE: return this.reverseDifference();
    case BooleanOperation.XOR: return this.xor();
    }

    return "";
  }

  getPathList() {
    return this.layers.map(it => it.absolutePath().d);
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