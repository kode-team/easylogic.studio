import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, SUBSCRIBE } from "el/base/Event";

import { registElement } from "el/base/registerElement";


export default class BorderRadiusProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('border.radius.property.title');  
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'border-radius'
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



  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
  }  

  [SUBSCRIBE('changeBorderRadius')] (value) {

    this.command("setAttribute", 'change border radius', { 
      'border-radius': value 
    })
  }

}

registElement({ BorderRadiusProperty })