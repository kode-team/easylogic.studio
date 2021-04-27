import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, SUBSCRIBE } from "el/base/Event";

import "../property-editor/BorderEditor";
import { registElement } from "el/base/registElement";


export default class BorderNewProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('border.property.title');  
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'border'
  }

  getBody() {
    return /*html*/`<div class="property-item full border-item" ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {}; 
    var value = current['border'] || ''

    return /*html*/`
      <object refClass='BorderEditor' ref='$1' key='border' value='${value}' onchange='changeKeyValue' />
    `
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
  }  

  [SUBSCRIBE('changeKeyValue')] (key, value) {
    this.command("setAttribute", 'change border', { 
      [key]: value
    })
  }

}

registElement({ BorderNewProperty })