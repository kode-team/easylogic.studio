import { CONFIG, LOAD, DOMDIFF, SUBSCRIBE, IF, DEBOUNCE } from "el/sapa/Event";

import BaseProperty from "el/editor/ui/property/BaseProperty";

import './CodeViewProperty.scss';

export default class CodeViewProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('code.view.property.title');
  }

  checkConfig() {
    return this.$config.is("inspector.selectedValue", 'code');
  }

  [CONFIG('inspector.selectedValue')] () {
    this.refresh();
  }

  [SUBSCRIBE('refreshSelectionStyleView', 'refreshSelection') + IF('checkConfig') + DEBOUNCE(100)]() {
    this.refresh();
  }

  getBody() {
    return /*html*/`
      <div class="property-item elf--code-view-item" ref='$body'>
        <div class="elf--code-view-item-code" ref='$code'></div>
        <div class="elf--code-view-item-svg" ref='$svg'></div>
      </div>
    `;
  }

  [LOAD('$code') + DOMDIFF] () {
    return [
      this.$editor.html.codeview(this.$selection.current)
    ]
  }

  [LOAD('$svg') + DOMDIFF] () {
    return [
      this.$editor.svg.codeview(this.$selection.current)
    ]
  }
}
