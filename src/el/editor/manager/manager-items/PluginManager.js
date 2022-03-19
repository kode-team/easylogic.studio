import { Item } from "el/editor/items/Item";

export class PluginManager {
  constructor(editor) {
    this.editor = editor; 
    this.plugins = [] 
  }

  registerPlugin (func) {
    this.plugins.push(func);
  }

  /**
   * ItemType 에 해당되는 Item 객체를 생성한다. 
   * create Item instance
   * 
   * @param {string} itemType  ItemType 
   * @param {object} obj 
   * @returns {Item} 
   */
  async initializePlugin (options = {}) {
    return await Promise.all(this.plugins.map(async (CreatePluginFunction) => {
      return await CreatePluginFunction(this.editor, options)
    })) 
  }

};
