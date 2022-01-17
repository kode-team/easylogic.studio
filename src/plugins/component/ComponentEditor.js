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

  getPropertyEditor(index, childEditor) {

    if (childEditor.type === 'column') {

      const size = (childEditor.size || [2]).join('-');

      return /*html*/`
        <div class='column column-${size}' style="--column-gap: ${childEditor.gap}px" >
          ${childEditor.columns.map((it, itemIndex) => {
        if (it === '-') {
          return /*html*/`<div class="column-item"></div>`;
        } else if (it.type === 'label') {
          return /*html*/`<div class="column-item">
                <label>${it.label}</label>
              </div>`;
        }

        return /*html*/`
              <div class='column-item'>
                ${this.getPropertyEditor(`${index}${itemIndex}`, it)}
              </div>
            `
      }).join('')}  
        </div>
      `
    }

    return /*html*/`
        <object 
          refClass="${childEditor.editor}" 
          ${variable({
      ...childEditor.editorOptions,
      onchange: (key, value) => {
        const newValue = isFunction(childEditor.convert) ? childEditor.convert(key, value) : value;
        this.trigger('changeComponentValue', key, newValue);
      },
      ref: `${childEditor.key}${index}`,
      key: childEditor.key,
      value: childEditor.defaultValue
    })} 
        />
    `



  }

  [LOAD('$body')]() {
    const inspector = this.state.inspector;
    var self = inspector.map((it, index) => {
      if (isString(it) || it.type === 'label') { // label, title 

        const title = it.label || it;

        return /*html*/`
          <div class='component-item'> 
            <label>${title}</label>
          </div>`
      } else {
        return /*html*/`
            <div class='component-item'> 
              ${this.getPropertyEditor(index, it)}
            </div>
          `
      }

    })

    return self;
  }

  setInspector(inspector) {
    this.setState({
      inspector
    })
  }

  setValue(obj = {}) {
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

  getValue() {
    const result = {}
    this.eachChildren(child => {
      if (child.getValue) {
        result[child.props.key] = child.getValue();
      }
    })

    return result;
  }

  [SUBSCRIBE_SELF('changeComponentValue')](key, value) {
    this.parent.trigger(this.props.onchange, key, value);
  }
}