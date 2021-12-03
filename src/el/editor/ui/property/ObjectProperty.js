import { IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from 'el/sapa/functions/registElement';
import { isFunction } from "el/sapa/functions/func";

export default class ObjectProperty {

  /**
   * 
   * @param {object} json 
   * @param {string} json.title property panel title
   * @param {string} [json.editableProperty] editable property name
   * @param {string|Function} [json.action] action name or function
   * @param {Function} [json.inspector] inspector create function
   * @returns 
   */
  static create (json) {
    return class extends BaseProperty {

      getTitle() {
        return json.title;
      }
    
      getClassName() {
        return json.className || "item"
      }
    
      get editableProperty() {
        return json.editableProperty;
      }
    
      [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
          this.refresh();
      }
    
      [LOAD('$body')] () {
        var current = this.$selection.current;
    
        if (!current) return "";

        const inspector = isFunction(json.inspector) ?  json.inspector(current) :  this.$editor.components.createInspector(current, json.editableProperty);
    
        return /*html*/`
          <object refClass="ComponentEditor" inspector=${variable(inspector)} onchange="changeComponentProperty" />
        `
      }
    
      getBody() {
        return /*html*/`
          <div ref='$body'></div>
        `;
      }
    
      [SUBSCRIBE_SELF('changeComponentProperty')] (key, value) {
        if (json.action) {
          this.command(json.action, `change attribute : ${key}`, key, value)
        } else {
          this.command("setAttributeForMulti", `change attribute : ${key}`, this.$selection.packByValue({ 
            [key]: value
          }))
        }

      }
    }
  }

}