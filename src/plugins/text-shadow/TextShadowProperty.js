import { LOAD, CLICK, SUBSCRIBE, IF, DEBOUNCE } from "el/sapa/Event";

import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { createComponent } from "el/sapa/functions/jsx";
import textShadow from "el/editor/preset/text-shadow";

import "./TextShadowProperty.scss";

export default class TextShadowProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.shadow.property.title')
  }

  getBody() {
    return /*html*/`
      <div class="full text-shadow-item" ref="$shadowList"></div>
    `;
  }

  getTools() {
    return /*html*/`
      <select class='text-shadow-samples' ref="$select">
      ${textShadow.map((item, index) => {
        return /*html*/`
          <option value="${index}">${item.name}</option>
        `
      }).join('')}
      </select>
      <button type="button" ref='$add'>${icon.add}</button>
    `
  }

  [CLICK('$add')]() {
    const index = +this.refs.$select.value;    
    this.children.$textshadow.trigger('add', textShadow[index].shadow);
  }

  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return createComponent("TextShadowEditor", {
      ref: '$textshadow',
      key: 'text-shadow',
      value: current['text-shadow'],
      onchange: (key, value) => {
        this.command('setAttributeForMulti', 'change text shadow', this.$selection.packByValue({
          [key]: value
        }))
      }
    })
  }

  get editableProperty() {
    return 'text-shadow';
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow') + DEBOUNCE(100)]() {
    this.refresh();
  }
}