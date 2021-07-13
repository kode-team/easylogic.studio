import { isFunction } from "el/base/functions/func";
import { Item } from "el/editor/items/Item";

export class ComponentManager {
  constructor(editor) {
    this.editor = editor;
    this.components = {} 
    this.inspectors = {}
  }

  registerComponent (name, componentProperty) {

    if (this.components[name]) throw new Error("It has duplicated item name. " + name);
    this.components[name] = componentProperty;
  }

  registerInspector (name, inspectorCallback) {

    if (this.inspectors[name]) throw new Error("It has duplicated item name. " + name);
    this.inspectors[name] = inspectorCallback;
  }  

  getComponentClass(name) {
    return this.components[name] || this.components['rect']
  }

  getInspector(name) {
    return this.inspectors[name];
  }  

  /**
   * ItemType 에 해당되는 Item 객체를 생성한다. 
   * create Item instance
   * 
   * @param {string} itemType  ItemType 
   * @param {object} obj 
   * @returns {Item} 
   */
  createComponent (itemType, obj = {}) {
    var ComponentClass = this.getComponentClass(itemType);
    if (!ComponentClass) {
      throw new Error(`${itemType} type is not valid.`)
    }

    return new ComponentClass(obj);
  }

  /**
   * Inspector 를 생성하는 배열을 리턴해준다. 
   * 
   * @param {string} itemType 
   * @param {Item} item 
   * @returns 
   */
  createInspector (item) {
    const inspector = this.getInspector(item.itemType);

    if (isFunction(inspector)) {
      return inspector(item) || [];
    }

    if (isFunction(item.getProps)) {
      return item.getProps() || [];
    }

    return [];
  }

};
