import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE, LOAD } from "../../../util/Event";
import { isString, OBJECT_TO_PROPERTY, isNotUndefined } from "../../../util/functions/func";

editor


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
      // this.refresh()
    }

  }

  refresh() {

    if (!this.isShow()) return; 

    // update 를 어떻게 할지 고민 
    var current = editor.selection.current;

    if (current && current.is('component')) {
      this.load();
      current.getProps().forEach(it => {
        if (this.children[it.key]) {
          this.children[it.key].setValue(current[it.key] || it.defaultVallue)  
        }
      })
    }    
  }

  getBody() {
    return /*html*/`
      <div class='property-item' ref='$body'>
        
      </div>               
    `;
  }

  initComponents() {

    var current = editor.selection.current;
    var components = {} 

    if (current && current.is('component')) {
      current.getProps().forEach(it => {

        if (isString(it.editor)) {
          // NOOP 
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
      return `<div class='component-property'> ${this.getPropertyEditor(it.key,current[it.key], it.editor, it.editorOptions)}</div>`
    })

    return self; 
  }

  [EVENT('changeComponentProperty')] (key, value) {
    var current = editor.selection.current;

    if (current && current.is('component')) {
      current.reset({ [key]: value })
      this.emit('refreshSelectionStyleView');
    }

  }
}
