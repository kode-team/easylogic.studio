import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class TextProperty extends BaseProperty {

  getTitle() {
    return "Text";
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
  }

  getBody() {
    return `
      <div class="property-item">
        <SelectEditor ref='$align' label='Align' key='text-align' options=",left,center,right,justify" onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectEditor ref='$transform' label='Transform' key='text-transform' options=",none,uppercase,lowercase,capitalize,full-width" onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectEditor ref='$decoration' label='Decoration' key='text-decoration' options=",none,underline,overline,line-through" onchange='changeTextValue' />        
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
