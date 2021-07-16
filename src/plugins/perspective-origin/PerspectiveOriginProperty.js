
import { LOAD, CLICK, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";


import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";


export default class PerspectiveOriginProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('perspective.origin.property.title')
  }

  getKeyframeProperty () {
    return 'perspective-origin'
  }

  getTools() {
    return /*html*/`
        <button type="button" class="remove" ref='$remove'>${icon.remove}</button>
    `
  }

  [CLICK('$remove')] () {
    this.trigger('changePerspectiveOrigin', '');
  }  

  getBody() {
    return /*html*/`
      <div class="property-item full perspective-origin-item" ref='$body'></div>
    `;
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {}; 
    var value = current['perspective-origin'] || ''

    return /*html*/`<object refClass="PerspectiveOriginEditor" 
              ref='$1' 
              value='${value}' 
              onchange='changePerspectiveOrigin' 
            />`
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
  }

  [SUBSCRIBE_SELF('changePerspectiveOrigin')] (value) {

    this.command('setAttributeForMulti',  'change perspective origin', this.$selection.packByValue({ 
      'perspective-origin': value 
    }))
  }

}