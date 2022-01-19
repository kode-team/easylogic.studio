import { DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { isFunction, isString } from "el/sapa/functions/func";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from "el/sapa/functions/registElement";

import './ComponentProperty.scss';

export default class ComponentProperty extends BaseProperty {

  getClassName() {
    return 'component-property';
  }

  getTitle() {
    return "Component";
  }

  isShow () {
    var current = this.$selection.current;
    const inspector = this.$editor.components.createInspector(current);
    if (current && (current.is('component') || inspector.length > 0)) {
      return true; 
    }

    return false; 
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow((type) => {
      const current = this.$selection.current;
      const inspector = this.$editor.components.createInspector(current);
      return inspector.length > 0;
    })

  }

  refresh() {
    
    var current = this.$selection.current;

    if (current) {
      this.setTitle(current.getDefaultTitle() || current.itemType || current.name);
      this.load();
    }    
  }

  getBody() {
    return /*html*/`
      <div ref='$body'></div>
    `;
  }

  [LOAD('$body')] () {

    var current = this.$selection.current;

    if (!current) return ''; 
    
    const inspector = this.$editor.components.createInspector(current);


    inspector.forEach(it => {
      let defaultValue = current[it.key] || it.defaultValue
      
      if (isFunction(it.convertDefaultValue)) {
        defaultValue = it.convertDefaultValue(current, it.key)
      }
      
      it.defaultValue = defaultValue;
    })

    return /*html*/`
      <object refClass="ComponentEditor" ref="$comp" inspector=${variable(inspector)} onchange="changeComponentProperty" />
    `
  }

  [SUBSCRIBE_SELF('changeComponentProperty')] (key, value) {
    this.command("setAttributeForMulti", 'change component : ' + key, this.$selection.packByValue({
      [key] : value
    }))
  }
}