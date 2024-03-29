import {
  clone,
  CLICK,
  DEBOUNCE,
  IF,
  LOAD,
  SUBSCRIBE,
  createComponent,
} from "sapa";

import boxShadow from "../../preset/box-shadow";
import "./BoxShadowProperty.scss";

import icon from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class BoxShadowProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("boxshadow.property.title");
  }

  getBody() {
    return /*html*/ `
      <div class="full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  getTools() {
    return /*html*/ `
      <select class='box-shadow-samples' ref="$select">
      ${boxShadow
        .map((item, index) => {
          return /*html*/ `
          <option value="${index}">${item.name}</option>
        `;
        })
        .join("")}
      </select>
      <button type="button" ref='$add'>${icon.add}</button>
    `;
  }

  [CLICK("$add")]() {
    const index = +this.refs.$select.value;
    this.children.$boxshadow.trigger("add", boxShadow[index].shadows);
  }

  [LOAD("$shadowList")]() {
    var current = this.$context.selection.current || {};
    return createComponent("BoxShadowEditor", {
      ref: "$boxshadow",
      key: "boxShadow",
      value: clone(current.boxShadow),
      onchange: (key, value) => {
        this.$commands.executeCommand(
          "setAttribute",
          "change box shadow",
          this.$context.selection.packByValue({
            [key]: clone(value),
          })
        );
      },
    });
  }

  get editableProperty() {
    return "boxShadow";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }
}
