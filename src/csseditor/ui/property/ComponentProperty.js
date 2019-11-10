import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE, LOAD } from "../../../util/Event";
import { isString, OBJECT_TO_PROPERTY, isNotUndefined } from "../../../util/functions/func";


export default class ComponentProperty extends BaseProperty {

  getTitle() {
    return "Component";
  }

  isShow () {
    var current = editor.selection.current;

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

    if (this.isShow()) {
      this.show();
      this.refresh()
    } else {
      this.hide();
      
    }

  }

  refresh() {
    
    var current = editor.selection.current;

    if (current && current.is('component')) {
      this.setTitle(current.itemType || current.name);
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

    var current = editor.selection.current;
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

    var current = editor.selection.current;

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
            <span class='add-timeline-property' data-property='${it.key}' data-type="${current.itemType}" data-editor="${it.editor}"></span>
            ${this.getPropertyEditor(it.key, current[it.key] || it.defaultVallue, it.editor, it.editorOptions)}
          </div>
        `
      }

    })

    return self; 
  }

  [EVENT('changeComponentProperty')] (key, value) {


    editor.selection.each(item => {
      if (item.is('component')) {
        item.reset({ [key]: value })
      }
    })
    this.emit('refreshSelectionStyleView', null, true);

  }
}
