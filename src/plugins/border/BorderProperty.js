
import { LOAD, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF, IF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './BorderProperty.scss';
import { variable } from "el/sapa/functions/registElement";

export default class BorderProperty extends BaseProperty {


  initialize() {
    super.initialize();
    
    this.notEventRedefine = true;
  }


  getTitle() {
    return this.$i18n('border.property.title');  
  }

  getBody() {
    return /*html*/`<div class="property-item full border-item" ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {}; 
    var value = current['border'] || ''

    return /*html*/`
      <object refClass='BorderEditor' ${variable({
        ref: '$1',
        key: 'border',
        value,
        onchange: 'changeKeyValue'
      })}  />
    `
  }

  get editableProperty() {
    return 'border';
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100) + IF('checkShow')]() {

    this.refresh();
  }  

  [SUBSCRIBE_SELF('changeKeyValue')] (key, value) {
    this.command("setAttributeForMulti", 'change border', this.$selection.packByValue({ 
      [key]: value
    }))
  }

}