import {
  LOAD,
  CLICK,
  SUBSCRIBE_SELF,
  BIND,
  DOMDIFF,
  PREVENT,
  STOP,
} from "sapa";

import { BaseUI } from "../BaseUI";
import "./ToggleButton.scss";

const DEFAULT_LABELS = ["True", "False"];

export class ToggleButton extends BaseUI {
  initState() {
    return {
      checkedValue: this.props.checkedValue || this.props.value,
      checked: this.props.value || "false",
      size: this.props.size,
      toggleLabels: this.props.toggleLabels || DEFAULT_LABELS,
      toggleTitles: this.props.toggleTitles || [],
      toggleValues: this.props.toggleValues || ["true", "false"],
    };
  }

  template() {
    return <div class="small-editor button" ref="$body"></div>;
  }

  [LOAD("$body") + DOMDIFF]() {
    var { checked, checkedValue } = this.state;
    return /*html*/ `
        <div class='elf--toggle-button'>
            <div class='area' ref="$area">
                ${this.state.toggleValues
                  .map((it, index) => {
                    let label = this.state.toggleLabels[index];
                    let title = this.state.toggleTitles[index];

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

  [CLICK("$el button") + PREVENT + STOP](e) {
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
