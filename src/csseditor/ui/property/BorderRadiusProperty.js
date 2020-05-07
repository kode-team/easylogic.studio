import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";


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
      <BorderRadiusEditor ref='$1' value='${value}' onchange='changeBorderRadius' />
    `
  }



  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['rect', 'circle', 'text', 'cube', 'cylinder']);
  }  

  [EVENT('changeBorderRadius')] (value) {

    console.log(value);

    this.emit("setAttribute", { 
      'border-radius': value 
    })
  }

}
