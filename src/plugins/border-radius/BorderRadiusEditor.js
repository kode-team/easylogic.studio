import { INPUT, CHANGE, LOAD, SUBSCRIBE_SELF } from "sapa";
import { iconUse } from "elf/editor/icon/icon";
import BorderRadius from "elf/editor/property-parser/BorderRadius";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./BorderRadiusEditor.scss";
import { createComponent } from "sapa";

const typeList = [
  { key: "border-top-left-radius", title: "topLeft", label: "TL" },
  { key: "border-top-right-radius", title: "topRight", label: "TR" },
  { key: "border-bottom-left-radius", title: "bottomLeft", label: "BL" },
  { key: "border-bottom-right-radius", title: "bottomRight", label: "BR" },
];

const keyList = typeList.map((it) => it.key);

const BorderGroup = {
  ALL: "all",
  PARTITIAL: "partial",
};

export default class BorderRadiusEditor extends EditorElement {
  initState() {
    return {
      ...BorderRadius.parseStyle(this.props.value),
    };
  }

  template() {
    return `<div class='elf--border-radius-editor' ref='$body'></div>`;
  }

  [SUBSCRIBE_SELF("changeBorderRadius")](key, value) {
    if (key === "border-radius") {
      keyList.forEach((type) => {
        this.children[`$${type}`].setValue(value.clone());
      });
    }

    this.setBorderRadius();
  }

  [LOAD("$body")]() {
    // var selectedValue = BorderGroup.ALL;
    var borderRadius = this.state["border-radius"];

    return /*html*/ `
      <div class="border-radius-item">
        <div class="radius-value">
          ${createComponent("InputRangeEditor", {
            label: iconUse("outline_rect"),
            ref: "$all",
            compact: "true",
            key: "border-radius",
            value: borderRadius,
            min: 0,
            onchange: "changeBorderRadius",
          })}
        </div>
        <div></div>

          ${createComponent("ToggleButton", {
            compact: true,
            ref: "$toggle",
            key: "border-all",
            checkedValue: BorderGroup.PARTITIAL,
            value: BorderGroup.ALL,
            toggleLabels: ["border_inner", "border_inner"],
            toggleValues: [BorderGroup.ALL, BorderGroup.PARTITIAL],
            onchange: "changeKeyValue",
          })}
      </div>
      <div
        class="full border-radius-item"
        ref="$partitialSetting"
        style="display: none;"
      >
        <div class="radius-setting-box" ref="$radiusSettingBox">
          <div>
            ${typeList
              .map((it) => {
                var value = this.state[it.key];
                var title = this.$i18n("border.radius.editor." + it.title);
                var label = it.label;

                return /*html*/ `
                <div>
                  ${createComponent("InputRangeEditor", {
                    compact: true,
                    ref: `$${it.key}`,
                    label,
                    title,
                    key: it.key,
                    value,
                    min: 0,
                    step: 1,
                    onchange: "changeBorderRadius",
                  })}
                </div>  
              `;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  [INPUT("$radiusSettingBox input")]() {
    this.setBorderRadius();
  }

  [CHANGE("$radiusSettingBox select")]() {
    this.setBorderRadius();
  }

  setBorderRadius() {
    var type = this.selectedValue;

    if (type === BorderGroup.ALL) {
      this.state["border-radius"] = this.children[`$all`].getValue();
    } else {
      keyList.forEach((key) => {
        this.state[key] = this.children[`$${key}`].getValue();
      });
    }

    this.modifyBorderRadius();
  }

  modifyBorderRadius() {
    var value = "";

    if (this.selectedValue === BorderGroup.ALL) {
      value = this.state["border-radius"] + "";
    } else {
      value = keyList.map((key) => `${this.state[key]}`).join(" ");
    }

    this.parent.trigger(this.props.onchange, value);
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value) {
    const type = value;

    if (type === BorderGroup.PARTITIAL) {
      this.selectedValue = BorderGroup.PARTITIAL;
      this.refs.$partitialSetting.show();
    } else {
      this.selectedValue = BorderGroup.ALL;
      this.refs.$partitialSetting.hide();
    }

    this.setBorderRadius();
  }
}
