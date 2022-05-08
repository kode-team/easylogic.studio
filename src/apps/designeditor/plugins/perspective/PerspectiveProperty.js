import {
  LOAD,
  CLICK,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  DEBOUNCE,
  IF,
  createComponent,
} from "sapa";

import icon from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class PerspectiveProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("perspective.property.title");
  }

  getKeyframeProperty() {
    return "perspective";
  }

  getTools() {
    return /*html*/ `
        <button type="button" class="remove" ref='$remove'>${icon.remove}</button>
    `;
  }

  [CLICK("$remove")]() {
    this.trigger("changePerspective", "perspective", "");
  }

  getBody() {
    return `<div class='property-item' ref='$perspective'></div>`;
  }

  [LOAD("$perspective")]() {
    var current = this.$context.selection.current || {};

    var perspective = current["perspective"] || "";
    return createComponent("RangeEditor", {
      ref: "$1",
      key: "perspective",
      value: perspective,
      max: "2000px",
      onchange: "changePerspective",
    });
  }

  [SUBSCRIBE_SELF("changePerspective")](key, value) {
    this.$commands.executeCommand(
      "setAttribute",
      "change perspective",
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }

  get editableProperty() {
    return "perspective";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }
}
