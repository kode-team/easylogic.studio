import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";


export default class TextProperty extends BaseProperty {

  getTitle() {
    return "Text";
  }

  isHideHeader() {
    return true; 
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text');
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = editor.selection.current;
    if (current) {
      this.children.$align.setValue(current['text-align']);
      this.children.$transform.setValue(current['text-transform']);
      this.children.$decoration.setValue(current['text-decoration']);            
    }

  }

  getBody() {
    return /*html*/`
      <div class="property-item">
        <SelectIconEditor 
          ref='$align' 
          label='Align' 
          key='text-align' 
          value='left' 
          options="left,center,right,justify" 
          icons="align_left,align_center,align_right,align_justify" 
          onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectIconEditor 
          ref='$transform' 
          label='Transform' 
          key='text-transform' 
          options="uppercase,lowercase,capitalize"
          icons='A,a,Aa'
          onchange='changeTextValue' />                
      </div>        
      <div class="property-item">
        <SelectIconEditor 
          ref='$decoration' 
          label='Decoration' 
          key='text-decoration' 
          options="none,underline,overline,line-through" 
          icons="A,U,O,S"
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [EVENT('changeTextValue')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }

}
