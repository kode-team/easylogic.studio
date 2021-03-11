import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";
import { DEBOUNCE, LOAD } from "@core/Event";
import { isString, OBJECT_TO_PROPERTY } from "@core/functions/func";
import { registElement } from "@core/registerElement";


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

  initState() {
    return {
      components: {} 
    }
  }

  components () {
    return {...super.components(), ...this.state.components}
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow((type) => {
      const current = this.$selection.current;

      return current && current.is('component');
    })

  }

  refresh() {
    
    var current = this.$selection.current;

    if (current && current.is('component')) {
      this.setTitle(current.getDefaultTitle() || current.itemType || current.name);
      this.load();
      current.getProps().forEach(it => {
        if (this.children[it.key]) {
          this.children[it.key].setValue(current[it.key] || it.defaultValue)  
        }
      })
    }    
  }

  getBody() {
    return /*html*/`
      <div ref='$body'></div>
    `;
  }

  initComponents() {

    var current = this.$selection.current;
    var components = {} 

    if (current && current.is('component')) {
      current.getProps().forEach(it => {

        if (isString(it.editor)) {
          
        } else {
          components = { ...components, ...it.editor}
        }

      })  
    }

    this.setState({components}, false)

    super.initComponents();
  }

  getPropertyEditor (key, value, selfEditor, selfEditorOptions) {

    if (isString(selfEditor)) {
      return `<${selfEditor} ${OBJECT_TO_PROPERTY({
        ...selfEditorOptions,
        onchange: 'changeComponentProperty',
        ref: key,
        key,
        value
      })} />`
    } else {
      return Object.keys(selfEditor).map(selfEditorKey => {
        return `<${selfEditorKey} ${OBJECT_TO_PROPERTY({
          ...selfEditorOptions,
          onchange: 'changeComponentProperty',
          ref: key,
          key,
          value
        })} />`        
      }).join('');
    }
  }

  [LOAD('$body')] () {

    var current = this.$selection.current;

    if (!current) return ''; 

    if (current && !current.is('component')) {
      return ''; 
    }

    var self = current.getProps().map(it=> {
      if (isString(it)) {
        return /*html*/`
          <div class='property-item'> 
            <label>${it}</label>
          </div>`
      } else {
        return /*html*/`
          <div class='property-item animation-property-item'> 
            <div class='group'>
              <span class='add-timeline-property' data-property='${it.key}' data-type="${current.itemType}" data-editor="${it.editor}"></span>
            </div>
            ${this.getPropertyEditor(it.key, current[it.key] || it.defaultVallue, it.editor, it.editorOptions)}
          </div>
        `
      }

    })

    return self; 
  }

  [EVENT('changeComponentProperty')] (key, value) {

    this.command("setAttribute", 'change component', {
      [key]: value
    }, null, true)
  }
}

registElement({ ComponentProperty })