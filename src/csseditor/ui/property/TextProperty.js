import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";

const i18n = editor.initI18n('text.property')

export default class TextProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
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
          label='${i18n('align')}' 
          key='text-align' 
          value='left' 
          options="left,center,right,justify" 
          icons="align_left,align_center,align_right,align_justify" 
          onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <SelectIconEditor 
          ref='$transform' 
          label='${i18n('transform')}' 
          key='text-transform' 
          options="none,uppercase:A,lowercase:a,capitalize:Aa"
          onchange='changeTextValue' />                
      </div>        
      <div class="property-item">
        <SelectIconEditor 
          ref='$decoration' 
          label='${i18n('decoration')}' 
          key='text-decoration' 
          options="none,underline,overline:O,line-through" 
          icons="A,underline,O,strikethrough"
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
