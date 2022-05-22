import { CHANGE, BIND } from "sapa";

import "./SelectEditor.scss";

import icon, { iconUse } from "elf/editor/icon/icon";
import { BlendMode } from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SelectEditor extends EditorElement {
  initState() {
    var splitChar = this.props.split || ",";

    var options = Array.isArray(this.props.options)
      ? this.props.options.map((it) => {
          if (typeof it === "string") {
            return { value: it, text: it };
          }
          return it;
        })
      : (this.props.options || "")
          .split(splitChar)
          .map((it) => it.trim())
          .map((it) => {
            const [value, text] = it.split(":");
            return { value, text: text || value };
          });

    var value = this.props.value;
    var tabIndex = this.props.tabindex;
    var title = this.props.title;

    return {
      splitChar,
      label: this.props.label || "",
      title,
      options,
      value,
      tabIndex,
    };
  }

  getOptionString() {
    var arr = this.state.options.map((it) => {
      var value = it.value;
      var label = it.text || it.value;

      if (label === "") {
        label = this.props["none-value"] ? this.props["none-value"] : "";
      } else if (label === "-") {
        label = "----------";
        value = "";
      }
      var selected = value === this.state.value ? "selected" : "";
      const disabled = it.disabled ? "disabled" : "";
      return `<option ${selected} value="${value}" ${disabled}>${label}</option>`;
    });

    return arr.join("");
  }

  template() {
    var { label, title, tabIndex, value = BlendMode.NORMAL } = this.state;
    var hasLabel = label ? "has-label" : "";
    var hasTabIndex = tabIndex ? 'tabIndex="1"' : "";
    var compact = this.props.compact ? "compact" : "";

    if (icon[label]) {
      label = iconUse(label);
    }

    return /*html*/ `
            <div class='elf--select-editor ${hasLabel} ${compact}'>
                ${label ? `<label title="${title}">${label}</label>` : ""}
                <div class="editor-view">
                    <select ref='$options' ${hasTabIndex}>
                        ${this.getOptionString()}
                    </select>
                    <div class='selected-value'>
                        <span class='value' ref="$selectedValue">${value}</span>
                        <span class='expand' ref='$expand'>${iconUse(
                          "expand_more"
                        )}</span>
                    </div>
                </div>
            </div>
        `;
  }

  getValue() {
    return this.refs.$options.value;
  }

  setValue(value) {
    this.refs.$options.val(this.state.value);
    this.setState({
      value: value + "",
    });
  }

  [BIND("$options")]() {
    return {
      "data-count": this.state.options.length.toString(),
    };
  }

  [BIND("$selectedValue")]() {
    return {
      text: this.state.options.find((it) => it.value === this.state.value)
        ?.text,
    };
  }

  // [LOAD("$options") + DOMDIFF]() {
  //   var arr = this.state.options.map((it) => {
  //     var value = it.value;
  //     var label = it.text || it.value;

  //     if (label === "") {
  //       label = this.props["none-value"] ? this.props["none-value"] : "";
  //     } else if (label === "-") {
  //       label = "----------";
  //       value = "";
  //     }
  //     var selected = value === this.state.value ? "selected" : "";
  //     const disabled = it.disabled ? "disabled" : "";
  //     return `<option ${selected} value="${value}" ${disabled}>${label}</option>`;
  //   });

  //   return arr;
  // }

  [CHANGE("$options")]() {
    this.updateData({
      value: this.refs.$options.value,
    });

    this.bindData("$selectedValue");
  }

  updateData(data) {
    this.setState(data, false);

    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.value,
      this.props.params
    );
  }
}
