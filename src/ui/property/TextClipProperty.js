import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "@core/Event";
import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";


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

  [EVENT('changeSelect')] (key, value) {
      this.emit('setAttribute', {
        [key]: value
      })
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['text']);
  }  
}

registElement({ TextClipProperty })