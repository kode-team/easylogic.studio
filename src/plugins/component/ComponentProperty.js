import { DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { isString } from "el/sapa/functions/func";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from "el/sapa/functions/registElement";

export default class ComponentProperty extends BaseProperty {

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

  getPropertyEditor (index, key, value, selfEditor, selfEditorOptions) {
    if (isString(selfEditor)) {
      return /*html*/`
        <div>  
          <object 
            refClass="${selfEditor}" 
            ${variable({
              ...selfEditorOptions,
              onchange: 'changeComponentProperty',
              ref: `${key}${index}`,
              key,
              value
            })} 
          />
        </div>`
    } else {
      return Object.keys(selfEditor).map(selfEditorKey => {
        return /*html*/`
          <div>
            <object refClass="${selfEditorKey}" ${variable({
              ...selfEditorOptions,
              onchange: 'changeComponentProperty',
              ref: `${key}${index}${selfEditorKey}`,
              key,
              value
            })} />
          </div>`
      }).join('');
    }
  }

  [LOAD('$body')] () {

    var current = this.$selection.current;

    if (!current) return ''; 
    
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

  [SUBSCRIBE_SELF('changeComponentProperty')] (key, value) {

    const current = this.$selection.current;
    const inspector = this.$editor.components.createInspector(current);    
    const convert = inspector.find(it => it.key === key)?.convert;
    const realValueObject = convert ? convert(current, key, value) : { [key] : value }

    this.command("setAttributeForMulti", 'change component : ' + key, this.$selection.packByValue(realValueObject))
  }
}