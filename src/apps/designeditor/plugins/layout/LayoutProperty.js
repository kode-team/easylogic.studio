import {
  IF,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
  DOMDIFF,
} from "sapa";

import "./LayoutProperty.scss";

import { REFRESH_SELECTION } from "elf/editor/types/event";
import { Layout } from "elf/editor/types/model";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class LayoutProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("layout.property.title");
  }

  getClassName() {
    return "elf--layout-property";
  }

  getBody() {
    return /*html*/ `
        <div ref='$layoutProperty'></div>
      `;
  }

  getTools() {
    return /*html*/ `
      <div ref='$layoutType'></div>
    `;
  }

  [LOAD("$layoutType")]() {
    const current = this.$context.selection.current;

    if (!current) return "";

    return createComponent("SelectIconEditor", {
      ref: "$layout",
      key: "layout",
      height: 24,
      value: current.layout,
      options: [Layout.DEFAULT, Layout.FLEX, Layout.GRID],
      icons: ["layout_default", "layout_flex", "layout_grid"],
      onchange: "changeLayoutType",
    });
  }

  [LOAD("$layoutProperty") + DOMDIFF]() {
    var current = this.$context.selection.current || { layout: "default" };
    return /*html*/ `
      <div class='layout-list' ref='$layoutList'>
        <div data-value='default' class='${
          current.layout === "default" ? "selected" : ""
        }'></div>
        <div data-value='flex' class='${
          current.layout === "flex" ? "selected" : ""
        }'>
          ${createComponent("FlexLayoutEditor", {
            ref: "$flex",
            key: "flex-layout",
            value: {
              "flex-direction": current["flex-direction"],
              "flex-wrap": current["flex-wrap"],
              "justify-content": current["justify-content"],
              "align-items": current["align-items"],
              "align-content": current["align-content"],
              gap: current.gap,
            },
            onchange: "changeLayoutInfo",
          })}
        </div>
        <div data-value='grid' class='${
          current.layout === "grid" ? "selected" : ""
        }'>
          ${createComponent("GridLayoutEditor", {
            ref: "$grid",
            key: "grid-layout",
            value: current["grid-layout"] || "",
            onchange: "changeLayoutInfo",
          })}
        </div>
      </div>
    `;
  }

  [SUBSCRIBE_SELF("changeLayoutInfo")](key, value) {
    if (key === "padding") {
      this.$commands.executeCommand(
        "setAttribute",
        "change padding",
        this.$context.selection.packByValue(value)
      );
    } else {
      this.$commands.executeCommand(
        "setAttribute",
        "change layout info",
        this.$context.selection.packByValue({
          [key]: value,
        })
      );
    }

    this.nextTick(() => {
      this.emit("refreshAllElementBoundSize");
    });
  }

  [SUBSCRIBE_SELF("changeLayoutType")](key, value) {
    this.$context.selection.reset(
      this.$context.selection.packByValue({
        [key]: value,
      })
    );

    this.updateTitle();

    this.$commands.executeCommand(
      "setAttribute",
      "change layout type",
      this.$context.selection.packByValue({
        [key]: value,
      })
    );

    this.nextTick(() => {
      this.refresh();
    });
  }

  get editableProperty() {
    return "layout";
  }

  enableHasChildren() {
    return this.$context.selection.current.enableHasChildren();
  }

  updateTitle() {
    this.setTitle(this.$context.selection.current.layout + " Layout");
  }

  [SUBSCRIBE(REFRESH_SELECTION) + IF("checkShow") + IF("enableHasChildren")]() {
    this.updateTitle();
    this.refresh();
  }
}
