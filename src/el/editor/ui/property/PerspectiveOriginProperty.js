import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE, SUBSCRIBE } from "el/base/Event";


import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registElement";

export default class PerspectiveOriginProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('perspective.origin.property.title')
  }

  hasKeyframe () {
    return true; 
  }

  isFirstShow() {
    return false; 
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

  [SUBSCRIBE('changePerspectiveOrigin')] (value) {

    this.command('setAttribute',  'change perspective origin', { 
      'perspective-origin': value 
    })
  }

}

registElement({ PerspectiveOriginProperty })