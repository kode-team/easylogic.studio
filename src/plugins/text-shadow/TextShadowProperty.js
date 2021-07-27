import { LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF, IF } from "el/base/Event";

import icon from "el/editor/icon/icon";
import { TextShadow } from "el/editor/property-parser/TextShadow";
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
      <object refClass="TextShadowEditor" 
        ref='$textshadow' 
        value="${this.variable(TextShadow.parseStyle(current['text-shadow']))}" 
        hide-label="true" 
        onChange=${this.subscribe((textshadow) => {
          this.command('setAttributeForMulti', 'change text shadow', this.$selection.packByValue({ 
            'text-shadow': textshadow
          }))
        })}
      />
    `
  }

  get editableProperty() {
    return 'text-shadow';
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }  
}