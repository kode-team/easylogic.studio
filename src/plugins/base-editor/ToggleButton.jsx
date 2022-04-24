import { LOAD, CLICK, SUBSCRIBE_SELF, BIND } from "sapa";
import BaseUI from "./BaseUI";
import "./ToggleButton.scss";
import icon, { iconUse } from "elf/editor/icon/icon";

const DEFAULT_LABELS = ["True", "False"];

export default class ToggleButton extends BaseUI {
  initState() {
    return {
      checkedValue: this.props.checkedValue || this.props.value,
      checked: this.props.value || "false",
      toggleLabels: this.props.toggleLabels || DEFAULT_LABELS,
      toggleTitles: this.props.toggleTitles || [],
      toggleValues: this.props.toggleValues || ["true", "false"],
    };
  }

  template() {
    return `<div class='small-editor button' ref='$body'></div>`;
  }

  [LOAD("$body")]() {
    var { checked, checkedValue } = this.state;
    return /*html*/ `
        <div class='elf--toggle-button'>
            <div class='area' ref="$area">
                ${this.state.toggleValues
                  .map((it, index) => {
                    let label = this.state.toggleLabels[index];
                    let title = this.state.toggleTitles[index] || label;

                    if (icon[label]) {
                      label = iconUse(label, "", { width: 30, height: 30 });
                    }

                    return (
                      <div
                        class={`${it === checked ? "visible" : ""} ${
                          it === checkedValue ? "checked" : ""
                        }`}
                      >
                        <button
                          type="button"
                          data-index={index}
                          class={it === checkedValue ? "checked" : ""}
                          value={it}
                          title={title}
                          style="--elf--toggle-checkbox-tooltip-top: -20%;"
                        >
                          {label}
                        </button>
                      </div>
                    );
                  })
                  .join("")}
            </div>
        </div>
    `;
  }

  [BIND("$area")]() {
    const selectedIndex = this.state.toggleValues.findIndex(
      (v) => v === this.state.checked
    );
    return {
      "data-selected-index": selectedIndex,
    };
  }

  setValue(checked) {
    this.setState({
      checked,
    });
  }

  getValue() {
    return this.state.checked;
  }

  [CLICK("$el button")](e) {
    const value = e.$dt.value;
    const selectedIndex = this.state.toggleValues.findIndex((v) => v === value);

    const nextValue =
      this.state.toggleValues[
        (selectedIndex + 1) % this.state.toggleValues.length
      ];

    this.setValue(nextValue);
    this.trigger("change");
  }

  [SUBSCRIBE_SELF("change")]() {
    this.sendEvent();
  }
}
