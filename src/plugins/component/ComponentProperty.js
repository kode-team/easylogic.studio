import { DEBOUNCE, LOAD, SUBSCRIBE } from "el/base/Event";
import { isString, OBJECT_TO_PROPERTY } from "el/base/functions/func";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class ComponentProperty extends BaseProperty {

  getTitle() {
    return "Component";
  }

  isShow () {
    var current = this.$selection.current;

    if (current && current.is('component')) {
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

  getPropertyEditor (index, key, value, selfEditor, selfEditorOptions) {
    if (isString(selfEditor)) {
      return /*html*/`
        <div>  
          <object refClass="${selfEditor}" ${OBJECT_TO_PROPERTY({
            ...selfEditorOptions,
            onchange: 'changeComponentProperty',
            ref: `${key}${index}`,
            key,
          })}>
            <property name="value" valueType="json">${JSON.stringify(value || {})}</property>
          </object>
        </div>`
    } else {
      return Object.keys(selfEditor).map(selfEditorKey => {
        return /*html*/`
          <div>
            <object refClass="${selfEditorKey}" ${OBJECT_TO_PROPERTY({
              ...selfEditorOptions,
              onchange: 'changeComponentProperty',
              ref: `${key}${index}${selfEditorKey}`,
              key,
            })}>
              <property name="value" valueType="json">${JSON.stringify(value || {})}</property>
            </object>
          </div>`
      }).join('');
    }
  }

  [LOAD('$body')] () {

    var current = this.$selection.current;

    if (!current) return ''; 

    if (current && !current.is('component')) {
      return ''; 
    }

    const inspector = this.$editor.components.createInspector(current);

    var self = inspector.map((it, index)=> {

      if (isString(it)) {
        return /*html*/`
          <div class='property-item is-label'> 
            <label class='label string-label'>${it}</label>
          </div>`
      } else {
        return /*html*/`
          <div class='property-item'> 
            ${this.getPropertyEditor(index, it.key, current[it.key] || it.defaultValue, it.editor, it.editorOptions)}
          </div>
        `
      }

    })

    return self; 
  }

  [SUBSCRIBE('changeComponentProperty')] (key, value) {

    const current = this.$selection.current;
    const inspector = this.$editor.components.createInspector(current);    
    const convert = inspector.find(it => it.key === key)?.convert;
    const realValueObject = convert ? convert(current, key, value) : { [key] : value }

    this.command("setAttribute", 'change component', realValueObject, null, true)
  }
}