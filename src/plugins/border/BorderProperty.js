
import { LOAD, DEBOUNCE, SUBSCRIBE } from "el/base/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class BorderProperty extends BaseProperty {

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
    this.refreshShowIsNot(['project', 'svg-path', 'svg-polygon', 'svg-text', 'svg-textpath']);
  }  

  [SUBSCRIBE('changeKeyValue')] (key, value) {
    this.command("setAttribute", 'change border', { 
      [key]: value
    })
  }

}