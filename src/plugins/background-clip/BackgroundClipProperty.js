import {
  LOAD,
  DEBOUNCE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
} from "sapa";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BackgroundClipProperty extends BaseProperty {
  getTitle() {
    return "Background Clip";
  }

  isFirstShow() {
    return false;
  }

  getTools() {
    return /*html*/ `<div ref='$backgroundClip' style='padding-top: 3px;'></div>`;
  }

  [LOAD("$backgroundClip")]() {
    var current = this.$selection.current || {};

    var clip = current["background-clip"] || "";
    return createComponent("SelectEditor", {
      ref: "$1",
      key: "background-clip",
      icon: true,
      value: clip,
      options: ["", "paddinb-box", "border-box", "content-box", "text"],
      onchange: "changeSelect",
    });
  }

  [SUBSCRIBE_SELF("changeSelect")](key, value) {
    this.command(
      "setAttributeForMulti",
      "change background clip",
      this.$selection.packByValue({
        [key]: value,
      })
    );
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100)]() {
    this.refreshShow(["rect", "circle", "text"]);
  }
}
