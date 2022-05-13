import {
  CLICK,
  DEBOUNCE,
  DRAGSTART,
  LOAD,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
} from "sapa";

import gradients from "../../preset/gradients";
import "./GradientAssetsProperty.scss";

import { iconUse } from "elf/editor/icon/icon";
import { Gradient } from "elf/editor/property-parser/image-resource/Gradient";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

const options = gradients.map((it) => {
  return { value: it.key, text: it.title };
});

export default class GradientAssetsProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("gradient.asset.property.title");
  }

  initState() {
    return {
      mode: "grid",
      preset: "linear",
    };
  }

  getTools() {
    return /*html*/ `<div ref="$tools"></div>`;
  }

  [LOAD("$tools")]() {
    return createComponent("SelectEditor", {
      ref: "$preset",
      key: "preset",
      value: this.state.preset,
      options,
      onchange: "changePreset",
    });
  }

  [SUBSCRIBE_SELF("changePreset")](key, value) {
    this.setState({
      [key]: value,
    });
  }

  getClassName() {
    return "elf--gradient-assets-property";
  }

  [SUBSCRIBE(REFRESH_SELECTION) + DEBOUNCE(100)]() {
    this.show();
  }

  getBody() {
    return /*html*/ `
      <div class='property-item gradient-assets'>
        <div class='gradient-list' ref='$gradientList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [DRAGSTART("$gradientList .gradient-item")](e) {
    const gradient = e.$dt.attr("data-gradient");
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/gradient", gradient);
  }

  [LOAD("$gradientList")]() {
    var preset = gradients.find((it) => it.key === this.state.preset);

    if (!preset) {
      return "";
    }

    var results = preset.execute().map((item, index) => {
      return /*html*/ `
        <div class='gradient-item' data-index="${index}" data-gradient='${item.gradient}' data-custom="${item.custom}">
          <div class='preview' title="${item.gradient}" draggable="true">
            <div class='gradient-view' style='background-image: ${item.gradient};'></div>
          </div>
        </div>
      `;
    });

    if (preset.edit) {
      results.push(
        /*html*/ `<div class='add-gradient-item'><butto type="button">${iconUse(
          "add"
        )}</button></div>`
      );
    }

    return results;
  }

  executeGradient(callback, isRefresh = true, isEmit = true) {
    var project = this.$context.selection.currentProject;

    if (project) {
      callback && callback(project);

      if (isRefresh) this.refresh();
      if (isEmit) this.emit("refreshGradientAssets");
    } else {
      window.alert("Please select a project.");
    }
  }

  [CLICK("$gradientList .add-gradient-item")]() {
    this.executeGradient((project) => {
      project.createGradient({
        gradient: Gradient.random(),
        name: "",
        variable: "",
      });
    });
  }

  [CLICK("$gradientList .preview")](e) {
    var $item = e.$dt.closest("gradient-item");
    var gradient = $item.attr("data-gradient");

    this.$commands.emit("drop.asset", { gradient });
  }
}
