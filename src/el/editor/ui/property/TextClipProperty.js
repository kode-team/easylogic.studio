import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, SUBSCRIBE } from "el/base/Event";

import { registElement } from "el/base/registerElement";


export default class TextClipProperty extends BaseProperty {
  
  getTitle() {
    return this.$i18n('text.clip.property.title');
  }

  isFirstShow() {
    return false; 
  }

  getClassName() {
    return 'item'
  }

  getTools() {
    return `<div ref='$textClip'></div>`;
  }  

  [LOAD("$textClip")]() {
    var current = this.$selection.current || {};

    var clip = current['text-clip'] || ''
    return /*html*/`
      <object refClass="SelectEditor"  ref='$1' key='text-clip' icon="true" value="${clip}" options=",text" onchange="changeSelect" />
    `;
  }

  [SUBSCRIBE('changeSelect')] (key, value) {
      this.emit('setAttribute', {
        [key]: value
      })
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['text']);
  }  
}

registElement({ TextClipProperty })