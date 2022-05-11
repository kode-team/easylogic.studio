import { LOAD, CLICK, SUBSCRIBE, IF, DEBOUNCE, createComponent } from "sapa";

import "./TextShadowProperty.scss";

import icon from "elf/editor/icon/icon";
import textShadow from "elf/editor/preset/text-shadow";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class TextShadowProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("text.shadow.property.title");
  }

  getBody() {
    return /*html*/ `
      <div class="full text-shadow-item" ref="$shadowList"></div>
    `;
  }

  getTools() {
    return /*html*/ `
      <select class='text-shadow-samples' ref="$select">
      ${textShadow
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
    this.children.$textshadow.trigger("add", textShadow[index].shadow);
  }

  [LOAD("$shadowList")]() {
    var current = this.$context.selection.current || {};
    return createComponent("TextShadowEditor", {
      ref: "$textshadow",
      key: "textShadow",
      value: current.textShadow,
      onchange: (key, value) => {
        this.$commands.executeCommand(
          "setAttribute",
          "change text shadow",
          this.$context.selection.packByValue({
            [key]: value,
          })
        );
      },
    });
  }

  get editableProperty() {
    return "textShadow";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow") + DEBOUNCE(100)]() {
    this.refresh();
  }
}
