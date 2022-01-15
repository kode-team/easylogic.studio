import { DEBOUNCE, IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class BorderRadiusProperty extends BaseProperty {


  initialize() {
    super.initialize();
    
    this.notEventRedefine = true;
  }


  getTitle() {
    return this.$i18n('border.radius.property.title');  
  }

  getBody() {
    return /*html*/`<div class="property-item full border-radius-item" ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {}; 
    var value = current['border-radius'] || ''

    return /*html*/`
      <object refClass="BorderRadiusEditor" ref='$1' value='${value}' onchange='changeBorderRadius' />
    `
  }

  get editableProperty() {
    return 'border-radius';
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100) + IF('checkShow')]() {
    this.refresh();
  }  

  [SUBSCRIBE_SELF('changeBorderRadius')] (value) {

    this.command("setAttributeForMulti", 'change border radius', this.$selection.packByValue({ 
      'border-radius': value 
    }))
  }

}