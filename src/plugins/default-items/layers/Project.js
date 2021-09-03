
import { mat4 } from "gl-matrix";
import { Length } from "el/editor/unit/Length";
import { calculateMatrix } from "el/utils/math";
import { itemsToRectVerties } from "el/utils/collision";
import { TimelineModel } from "el/editor/model/TimelineModel";

const OFFSET_X = Length.z();
const OFFSET_Y = Length.z();

const identity = mat4.create();

export class Project extends TimelineModel {

  getDefaultTitle() {
    return "New Project";
  }

  get isAbsolute  (){
    return false;
  }  

  get parent () {
    return null;
  }

  toRootVariableCSS () {
    var obj = {}
    this.json.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
      var [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })

    return obj;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: 'new Project',
      description: '',
      rootVariable: '',            
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('name', 'description', 'rootVariable')
    }
  }

  get artboards () {
    return (this.layers || []).filter(it => it.is('artboard'));
  }

  get offsetX () {
    return OFFSET_X;
  }

  get offsetY () {
    return OFFSET_Y;
  }  

  hasLayout() {
    return false;
  }

  getTransformMatrix () {
    return mat4.create();
  }
  /**
   * 부모를 기준으로 childItem 의 transform 을 맞춘다. 
   * 
   * [newParentInverse] * [childMatrix] * [childItemMatrixInverse] = translate; 
   * 
   * @param {Item} childItem 
   */
  resetMatrix (childItem) {

    const [x, y] = mat4.getTranslation([], calculateMatrix(
        childItem.accumulatedMatrix,
        childItem.localMatrixInverse
    ));

    childItem.reset({
        x: Length.px(x),
        y: Length.px(y),
    })
  }

  get rectVerties () {
    return this.layers?.length ? itemsToRectVerties(this.layers) : null;
  }

  get accumulatedMatrix () {
    return identity;
  }

  get accumulatedMatrixInverse() {
    return identity;
  }

  get contentBox () {
    return {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    }
}

}