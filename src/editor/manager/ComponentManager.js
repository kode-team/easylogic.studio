import { Item } from "../items/Item";

export const ComponentManager = new class {
  constructor(opt = {}) {
    this.components = {} 
  }

  registerComponent (name, Component) {
    this.components[name] = Component;
  }

  getComponentClass(name) {
    return this.components[name] || this.components['rect']
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

}();
