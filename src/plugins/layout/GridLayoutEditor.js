import { DOMDIFF, LOAD, SUBSCRIBE_SELF } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./GridLayoutEditor.scss";
import { createComponent } from "sapa";
import { Layout } from "elf/editor/types/model";

export default class GridLayoutEditor extends EditorElement {
  modifyData(key, value) {
    this.parent.trigger(this.props.onchange, key, value);
  }

  template() {
    return /*html*/ `
            <div class='elf--grid-layout-editor' ref='$body' ></div>
        `;
  }

  [LOAD("$body") + DOMDIFF]() {
    const current = this.$selection.current;

    if (!current) return "";
    if (current.isLayout(Layout.GRID) === false) return "";

    return /*html*/ `
            <div class="grid-layout-item">
            ${createComponent("NumberInputEditor", {
              wide: true,
              label: "grid padding",
              key: "padding",
              ref: "$padding",
              value: current["padding-top"],
              min: 0,
              max: 300,
              step: 1,
              onchange: "changePadding",
            })}
            </div>
            <div class='grid-layout-item'>
                ${createComponent("GridGapEditor", {
                  label: this.$i18n("grid.layout.editor.column.gap"),
                  ref: "$columnGap",
                  key: "grid-column-gap",
                  value: current["grid-column-gap"] || "",
                  onchange: "changeKeyValue",
                })}
            </div>              
            <div class='grid-layout-item'>
                ${createComponent("GridGapEditor", {
                  label: this.$i18n("grid.layout.editor.row.gap"),
                  ref: "$rowGap",
                  key: "grid-row-gap",
                  value: current["grid-row-gap"] || "",
                  onchange: "changeKeyValue",
                })}
            </div>
        `;
  }

  [SUBSCRIBE_SELF("changePadding")](key, value) {
    this.modifyData(key, {
      "padding-top": value,
      "padding-left": value,
      "padding-right": value,
      "padding-bottom": value,
    });
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value, params) {
    this.modifyData(key, value, params);
  }
}
