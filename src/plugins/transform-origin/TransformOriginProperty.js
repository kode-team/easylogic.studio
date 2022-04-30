import {
  LOAD,
  CLICK,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  IF,
  createComponent,
} from "sapa";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class TransformOriginProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("transform.origin.property.title");
  }

  hasKeyframe() {
    return true;
  }

  getKeyframeProperty() {
    return "transform-origin";
  }

  [CLICK("$remove")]() {
    this.trigger("changeTransformOrigin", "");
  }

  getBody() {
    return /*html*/ `
      <div class="property-item full transform-origin-item" ref='$body'></div>
    `;
  }

  [LOAD("$body")]() {
    var current = this.$context.selection.current || {};
    var value = current["transform-origin"] || "";

    return createComponent("TransformOriginEditor", {
      ref: "$1",
      value,
      onchange: "changeTransformOrigin",
    });
  }

  get editableProperty() {
    return "transform-origin";
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF("changeTransformOrigin")](key, value) {
    this.command(
      "setAttributeForMulti",
      "change transform-origin",
      this.$context.selection.packByValue({
        "transform-origin": value,
      })
    );
  }
}
