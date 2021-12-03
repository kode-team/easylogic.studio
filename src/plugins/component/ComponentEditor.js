import { LOAD, SUBSCRIBE_SELF } from "el/sapa/Event";
import { isFunction, isString } from "el/sapa/functions/func";
import { variable } from "el/sapa/functions/registElement";

import './ComponentEditor.scss';
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class ComponentEditor extends EditorElement {

  initState() {
    return {
      inspector: this.props.inspector
    }
  }

  template() {
    return /*html*/`
      <div ref='$body' class="component-editor"></div>
    `;
  }

  getPropertyEditor (index, childEditor) {

    return /*html*/`
      <div>  
        <object 
          refClass="${childEditor.editor}" 
          ${variable({
            ...childEditor.editorOptions,
            onchange: 'changeComponentValue',
            ref: `${childEditor.key}${index}`,
            key: childEditor.key,
            value: childEditor.defaultValue
          })} 
        />
      </div>
    `
  }

  [LOAD('$body')] () {
    const inspector = this.state.inspector;
    var self = inspector.map((it, index)=> {
      if (isString(it)) { // label, title 
        return /*html*/`
          <div class='property-item is-label'> 
            <label class='label string-label'>${it}</label>
          </div>`
      } else {
        return /*html*/`
          <div class='property-item'> 
            ${this.getPropertyEditor(index, it)}
          </div>
        `
      }

    })

    return self; 
  }

  setValue (obj = {}) {
    const result = {}

    Object.keys(obj).forEach(key => {
      const value = obj[key];

      this.eachChildren(child => {
        if (child.setValue && child.props.key === key) {
          child.setValue(value);
        }
      })

    });
  }

  getValue () {
    const result = {}
    this.eachChildren(child => {
      if (child.getValue) {
        result[child.props.key] = child.getValue();
      }
    })

    return result;
  }

  [SUBSCRIBE_SELF('changeComponentValue')] (key, value) {
    this.parent.trigger(this.props.onchange, key, value);
  }
}