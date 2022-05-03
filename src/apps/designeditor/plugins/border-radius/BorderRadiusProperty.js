import {
  DEBOUNCE,
  IF,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
} from "sapa";

import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BorderRadiusProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("border.radius.property.title");
  }

  getBody() {
    return /*html*/ `<div class="property-item full border-radius-item" ref='$body'></div>`;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current["border-radius"] || "";

    return createComponent("BorderRadiusEditor", {
      ref: "$1",
      value,
      onchange: "changeBorderRadius",
    });
  }

  get editableProperty() {
    return "border-radius";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF("changeBorderRadius")](value) {
    this.command(
      "setAttributeForMulti",
      "change border radius",
      this.$context.selection.packByValue({
        "border-radius": value,
      })
    );
  }
}
