import {
  LOAD,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  createComponent,
} from "sapa";

import "./BorderProperty.scss";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BorderProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("border.property.title");
  }

  getBody() {
    return /*html*/ `<div class="property-item full border-item" ref='$body'></div>`;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current["border"] || "";

    return createComponent("BorderEditor", {
      ref: "$1",
      key: "border",
      value,
      onchange: "changeKeyValue",
    });
  }

  get editableProperty() {
    return "border";
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value) {
    this.command(
      "setAttributeForMulti",
      "change border",
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }
}
