import {
  LOAD,
  CLICK,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  createComponent,
} from "sapa";

import icon from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class PerspectiveOriginProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("perspective.origin.property.title");
  }

  getKeyframeProperty() {
    return "perspective-origin";
  }

  getTools() {
    return /*html*/ `
        <button type="button" class="remove" ref='$remove'>${icon.remove}</button>
    `;
  }

  [CLICK("$remove")]() {
    this.trigger("changePerspectiveOrigin", "");
  }

  getBody() {
    return /*html*/ `
      <div class="property-item full perspective-origin-item" ref='$body'></div>
    `;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current["perspective-origin"] || "";

    return createComponent("PerspectiveOriginEditor", {
      ref: "$1",
      value,
      onchange: "changePerspectiveOrigin",
    });
  }

  get editableProperty() {
    return "perspective-origin";
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF("changePerspectiveOrigin")](value) {
    this.command(
      "setAttributeForMulti",
      "change perspective origin",
      this.$context.selection.packByValue({
        "perspective-origin": value,
      })
    );
  }
}
