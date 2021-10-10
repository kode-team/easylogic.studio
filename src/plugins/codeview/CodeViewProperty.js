import { CONFIG, LOAD, DOMDIFF, SUBSCRIBE, IF } from "el/sapa/Event";

import BaseProperty from "el/editor/ui/property/BaseProperty";

import './CodeViewProperty.scss';

export default class CodeViewProperty extends BaseProperty {


  initialize() {
    super.initialize();

    this.notEventRedefine = true;
  }

  getTitle() {
    return this.$i18n('code.view.property.title');
  }

  checkConfig() {
    return this.$config.is("inspector.selectedValue", 'code');
  }

  [CONFIG('inspector.selectedValue')] () {
    this.refresh();
  }

  [SUBSCRIBE('refreshSelectionStyleView', 'refreshSelection') + IF('checkConfig')]() {
    this.refresh();
  }

  getBody() {
    return `
      <div class="property-item elf--code-view-item" ref='$body'></div>
    `;
  }

  [LOAD('$body') + DOMDIFF] () {
    return [
      this.$editor.html.codeview(this.$selection.current),
      // this.$editor.svg.codeview(this.$selection.current)
    ]
  }
}
