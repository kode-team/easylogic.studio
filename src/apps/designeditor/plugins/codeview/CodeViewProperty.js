import { CONFIG, LOAD, DOMDIFF, SUBSCRIBE, IF, DEBOUNCE } from "sapa";

import "./CodeViewProperty.scss";

import { REFRESH_SELECTION, UPDATE_CANVAS } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("code.view.property.title");
  }

  checkConfig() {
    return this.$config.is("inspector.selectedValue", "code");
  }

  [CONFIG("inspector.selectedValue")]() {
    this.refresh();
  }

  [SUBSCRIBE(UPDATE_CANVAS, REFRESH_SELECTION) +
    IF("checkConfig") +
    DEBOUNCE(100)]() {
    this.refresh();
  }

  getBody() {
    return /*html*/ `
      <div class="property-item elf--code-view-item" ref='$body'>
        <div class="elf--code-view-item-code" ref='$code'></div>
        <div class="elf--code-view-item-svg" ref='$svg'></div>
      </div>
    `;
  }

  [LOAD("$code") + DOMDIFF]() {
    return [
      this.$editor.renderer("html").codeview(this.$context.selection.current),
    ];
  }

  [LOAD("$svg") + DOMDIFF]() {
    return [
      this.$editor.renderer("svg").codeview(this.$context.selection.current),
    ];
  }
}
