import { CLICK, DEBOUNCE, IF, LOAD, SUBSCRIBE } from "sapa";
import icon from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { createComponent } from "sapa";
import boxShadow from "elf/editor/preset/box-shadow";

import "./BoxShadowProperty.scss";

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
    this.children.$boxshadow.trigger("add", boxShadow[index].shadow);
  }

  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return createComponent("BoxShadowEditor", {
      ref: "$boxshadow",
      key: "box-shadow",
      value: current["box-shadow"],
      onchange: (key, value) => {
        this.command(
          "setAttributeForMulti",
          "change box shadow",
          this.$selection.packByValue({
            [key]: value,
          })
        );
      },
    });
  }

  get editableProperty() {
    return "box-shadow";
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }
}
