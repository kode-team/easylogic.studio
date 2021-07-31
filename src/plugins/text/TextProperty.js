import { SUBSCRIBE, SUBSCRIBE_SELF, IF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";


const textTransformOptions = "none,uppercase:AG,lowercase:ag,capitalize:Ag".split(',').map(it => {
  const [value, text] = it.split(':');

  return {
    value, text
  }
});


const textDecorationOptions = "none,underline,overline:O,line-through".split(',').map(it => {
  const [value, text] = it.split(':');

  return {
    value, text
  }
});



export default class TextProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.property.title');
  }

  get editableProperty() {
    return "text-style"
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }


  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = this.$selection.current;
    if (current) {
      this.children.$align.setValue(current['text-align']);
      this.children.$transform.setValue(current['text-transform']);
      this.children.$decoration.setValue(current['text-decoration']);            
    }

  }

  getBody() {

    

    return /*html*/`
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$align' 
          label='${this.$i18n('text.property.align')}' 
          key='text-align' 
          value='left' 
          options=${this.variable(["left","center","right","justify"])} 
          icons="align_left,align_center,align_right,align_justify" 
          onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$transform' 
          label='${this.$i18n('text.property.transform')}' 
          key='text-transform' 
          options=${this.variable(textTransformOptions)}
          icons="horizontal_rule"
          onchange='changeTextValue' />                
      </div>        
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$decoration' 
          label='${this.$i18n('text.property.decoration')}' 
          key='text-decoration' 
          options=${this.variable(textDecorationOptions)}
          icons="horizontal_rule,underline,O,strikethrough"
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [SUBSCRIBE_SELF('changeTextValue')] (key, value) {
    this.command('setAttributeForMulti', `change text property : ${key}`, this.$selection.packByValue({ [key]: value }));        
  }

}