import { DOMDIFF, LOAD, SUBSCRIBE_SELF, createComponent } from "sapa";

import "./GridLayoutEditor.scss";

import { Layout } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

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
    const current = this.$context.selection.current;

    if (!current) return "";
    if (current.isLayout(Layout.GRID) === false) return "";

    return /*html*/ `
            <div class="grid-layout-item">
            ${createComponent("NumberInputEditor", {
              wide: true,
              label: "grid padding",
              key: "padding",
              ref: "$padding",
              value: current.paddingTop,
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
                  key: "gridColumnGap",
                  value: current.gridColumnGap || "",
                  onchange: "changeKeyValue",
                })}
            </div>              
            <div class='grid-layout-item'>
                ${createComponent("GridGapEditor", {
                  label: this.$i18n("grid.layout.editor.row.gap"),
                  ref: "$rowGap",
                  key: "gridRowGap",
                  value: current.gridRowGap || "",
                  onchange: "changeKeyValue",
                })}
            </div>
        `;
  }

  [SUBSCRIBE_SELF("changePadding")](key, value) {
    this.modifyData(key, {
      paddingTop: value,
      paddingLeft: value,
      paddingRight: value,
      paddingBottom: value,
    });
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value, params) {
    this.modifyData(key, value, params);
  }
}
