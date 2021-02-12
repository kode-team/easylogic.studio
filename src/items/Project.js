import { ComponentManager } from "../manager/ComponentManager";
import { TimelineItem } from "./TimelineItem";
import { mat4 } from "gl-matrix";
import { Length } from "@unit/Length";
import { calculateMatrix } from "@core/functions/math";
import { itemsToRectVerties } from "@core/functions/collision";

const OFFSET_X = Length.z();
const OFFSET_Y = Length.z();
export class Project extends TimelineItem {


  createIndexItemMap () {
    if (!this.indexedMap) {
      this.indexedMap = new Map();
    }

    return this.indexedMap;
  }

  get indexed () {

    this.createIndexItemMap();

    return this.indexedMap;
  }

  removeIndexItem (item) {
    this.indexed.delete(item.id);
  }

  getIndexItem (id) {
    return this.indexed.get(id);
  }

  /**
   * item 캐쉬 설정 
   * 
   * @param {Item} item 
   */
  addIndexItem (item) {
    if (this.hasIndexItem(item.id) === false)  {
      this.indexed.set(item.id, item.ref);
    }
  }

  /**
   * id 로 캐쉬된 아이템 찾기 
   * 
   * @param {string} id 
   */
  hasIndexItem (id) {
    return this.indexed.has(id);
  }

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
    return (this.json.layers || []).filter(it => it.is('artboard'));
  }

  get offsetX () {
    return OFFSET_X;
  }

  get offsetY () {
    return OFFSET_Y;
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
        childItem.getAccumulatedMatrix(),
        childItem.getTransformMatrixInverse()
    ));

    childItem.reset({
        x: Length.px(x),
        y: Length.px(y),
    })

  }

  get rectVerties () {
    return itemsToRectVerties(this.layers)
  }

}

ComponentManager.registerComponent('project', Project);
