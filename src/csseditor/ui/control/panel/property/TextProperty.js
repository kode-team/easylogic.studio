import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


export default class TextProperty extends BaseProperty {

  getTitle() {
    return "Text";
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
  }

  getBody() {
    return `
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
          options="none,uppercase,lowercase,capitalize,full-width"
          icons='aa,bb,cc,dd,ee'
          onchange='changeTextValue' />                
      </div>        
      <div class="property-item">
        <SelectIconEditor 
          ref='$decoration' 
          label='Decoration' 
          key='text-decoration' 
          options="none,underline,overline,line-through" 
          icons="가,나,다,라"
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
