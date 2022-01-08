import { IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from 'el/sapa/functions/registElement';
import { isFunction, isUndefined } from "el/sapa/functions/func";
import { createComponent } from "el/sapa/functions/jsx";

export default class ObjectProperty {

  /**
   * 
   * @param {object} json 
   * @param {string} json.title property panel title
   * @param {string} [json.editableProperty] editable property name
   * @param {string|Function} [json.action] action name or function
   * @param {Function} [json.inspector] inspector create function
   * @returns {BaseProperty}
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

      get order () {
        return  isUndefined(json.order) ? 1000 : json.order;
      }

      refresh() {

        const current = this.$selection.current;

        if (current) {
          this.setTitle(json.title || current.getDefaultTitle() || current.itemType || current.name);
          this.load();

          const inspector = isFunction(json.inspector) ?  json.inspector(current) :  this.$editor.components.createInspector(current, json.editableProperty);          
          this.children.$comp.setInspector(inspector);
        }
      }
    
      [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {

        if (json.preventUpdate) {

          if (this.$editor.isPointerUp) {
            this.refresh();
          }

        } else {
          this.refresh();
        }

      }
    
      [LOAD('$body')] () {
        var current = this.$selection.current;
    
        if (!current) return "";

        const inspector = isFunction(json.inspector) ?  json.inspector(current) :  this.$editor.components.createInspector(current, json.editableProperty);

        return createComponent("ComponentEditor", {
          ref: "$comp",
          inspector, 
          onchange: "changeComponentProperty"
        });
      }
    
      getBody() {
        var current = this.$selection.current || {};

        const inspector = isFunction(json.inspector) ?  json.inspector(current) :  this.$editor.components.createInspector(current, json.editableProperty);

        return createComponent("ComponentEditor", {
          ref: "$comp",
          inspector, 
          onchange: "changeComponentProperty"
        })
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