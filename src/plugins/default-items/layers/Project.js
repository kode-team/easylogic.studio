
import { mat4 } from "gl-matrix";
import { Length } from "el/editor/unit/Length";
import { calculateMatrix } from "el/base/functions/math";
import { itemsToRectVerties } from "el/base/functions/collision";
import { TimelineItem } from "el/editor/items/TimelineItem";

const OFFSET_X = Length.z();
const OFFSET_Y = Length.z();

const identity = mat4.create();

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

  getSearchedIndexItem (id) {
    if(this.hasIndexItem(id)) {        // 검색시에 id 로 된 index 가 존재하면 해당 item 을 리턴한다. 
      return this.getIndexItem(id);
    } else {                              // 그렇지 않으면 검색하기 
      return this.searchById(id);
    }
  }

  getSearchedIndexItemList (...ids) {
    return ids.map(id => {
      return project.getSearchedIndexItem(id);
    })
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
        childItem.getAccumulatedMatrix(),
        childItem.localMatrix
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

}