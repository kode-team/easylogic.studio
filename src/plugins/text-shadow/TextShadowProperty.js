import { LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";

import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";


export default class TextShadowProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.shadow.property.title')
  }

  getBody() {
    return `
      <div class="full text-shadow-item" ref="$shadowList"></div>
    `;
  }

  hasKeyframe() {
    return true
  }

  getKeyframeProperty () {
    return 'text-shadow'
  }

  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$textshadow.trigger('add');
  }  
  
  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return /*html*/`
      <object refClass="TextShadowEditor" ref='$textshadow' value="${current['text-shadow'] || ''}" hide-label="true" onChange="changeTextShadow" />
    `
  }

  afterRender() {
    this.show();
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refresh();
  }  

  [SUBSCRIBE_SELF("changeTextShadow")](textshadow) {

    this.command('setAttributeForMulti', 'change text shadow', this.$selection.packByValue({ 
      'text-shadow': textshadow
    }))
  }
}