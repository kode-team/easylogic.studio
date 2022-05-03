import {
  LOAD,
  CLICK,
  DOMDIFF,
  isBoolean,
  isNotUndefined,
  isString,
} from "sapa";

import "./SelectIconEditor.scss";

import { CSS_TO_STRING } from "elf/core/func";
import icon, { iconBlank } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SelectIconEditor extends EditorElement {
  initState() {
    var splitChar = this.props.split || ",";
    var options = Array.isArray(this.props.options)
      ? this.props.options.map((it) => {
          if (isString(it)) {
            return { value: it, text: it };
          }
          return it;
        })
      : (this.props.options || "")
          .split(splitChar)
          .map((it) => it.trim())
          .map((it) => {
            const [value, text] = it.split(":");
            return { value, text };
          });

    var icons = this.props.icons || [];
    var colors = this.props.colors || [];

    var value = this.props.value || "";

    return {
      label: this.props.label || "",
      compact: isBoolean(this.props.compact)
        ? this.props.compact
        : this.props.compact === "true",
      options,
      icons,
      colors,
      value,
      height: this.props.height,
    };
  }

  template() {
    var { label, compact, height } = this.state;
    var hasLabel = label ? "has-label" : "";
    var hasCompact = compact ? "compact" : "";
    var heightVar = height ? `--elf--input-height: ${height}px;` : "";
    return /*html*/ `
            <div class='elf--select-icon-editor ${hasLabel}' style="${heightVar}">
                ${label ? `<label title="${label}">${label}</label>` : ""}
                <div class='items ${hasCompact}' ref='$options'></div>
            </div>
        `;
  }

  [CLICK("$close")]() {
    this.updateData({
      value: "",
    });
    this.refresh();
  }

  getValue() {
    return this.state.value || "";
  }

  setValue(value) {
    this.setState({
      value,
    });
  }

  [LOAD("$options") + DOMDIFF]() {
    return this.state.options.map((it, index) => {
      var value = it.value;
      var label = it.text;
      var title = it.text;
      var iconClass = "";

      var isSelected = value === this.state.value;
      var selected = isSelected ? "selected" : "";
      if (it.value === "") {
        var label = "";
        title = "close";

        if (isNotUndefined(this.state.icons[index])) {
          iconClass = "icon";
          label = iconBlank();
          value = "__blank__";
        }
      } else {
        var iconKey = this.state.icons[index];

        if (icon[iconKey]) {
          iconClass = "icon";
        }

        title = label;
        label = icon[iconKey] || label || iconKey || it.text || it.value;
      }

      var color = this.state.colors[index];
      var css = {};
      if (isSelected && color) {
        css["background-color"] = color;
      }

      return /*html*/ `
                <div class='select-icon-item ${selected} ${iconClass}' 
                    style='${CSS_TO_STRING(css)}' 
                    data-value="${value}" 
                    data-tooltip='${title}'
                >${label}</div>`;
    });
  }

  [CLICK("$options .select-icon-item")](e) {
    var value = e.$dt.attr("data-value");

    if (!value || value === "__blank__") return;

    this.updateData({
      value,
    });

    this.refresh();
  }

  updateData(data) {
    this.setState(data, false);

    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.getValue(),
      this.props.params
    );
  }
}
