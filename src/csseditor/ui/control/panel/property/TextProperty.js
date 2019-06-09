import BaseProperty from "./BaseProperty";
import { CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import SelectEditor from "../../shape/property-editor/SelectEditor";



export default class TextProperty extends BaseProperty {
  components() {
    return {
      SelectEditor
    }
  }
  getTitle() {
    return "Text";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
  }

  getBody() {
    return `
      <div class="property-item">
        <SelectEditor ref='$align' label='Align' key='text-align' options="left,center,right,justify" onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectEditor ref='$transform' label='Transform' key='text-transform' options="none,uppercase,lowercase,capitalize,full-width" onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectEditor ref='$decoration' label='Decoration' key='text-decoration' options="none,underline,overline,line-through" onchange='changeTextValue' />        
      </div>                    
    `
  }

  [EVENT('changeTextValue')] (key, value) {
    var current = editor.selection.current;
    if (!current) return; 

    current.reset({
      [key]: value
    })

    this.emit('refreshCanvas')
  }

}
