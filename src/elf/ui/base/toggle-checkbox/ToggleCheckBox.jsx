import { LOAD, CLICK, SUBSCRIBE_SELF, BIND } from "sapa";

import { BaseUI } from "../BaseUI";
import "./ToggleCheckBox.scss";

const DEFAULT_LABELS = ["True", "False"];

export class ToggleCheckBox extends BaseUI {
  initState() {
    return {
      label: this.props.label || "",
      checked: this.props.value || false,
      toggleLabels: this.props.toggleLabels || DEFAULT_LABELS,
      toggleTitles: this.props.toggleTitles || [],
      toggleValues: this.props.toggleValues || [true, false],
    };
  }

  template() {
    return <div class="small-editor button" ref="$body"></div>;
  }

  [LOAD("$body")]() {
    var { label, checked } = this.state;

    var hasLabel = label ? "has-label" : "";
    return /*html*/ `
        <div class='elf--toggle-checkbox ${hasLabel}'>
            ${label ? `<label title="${label}">${label}</label>` : ""}
            <div class='area' ref="$area">
                ${this.state.toggleValues
                  .map((it, index) => {
                    let label = this.state.toggleLabels[index];
                    let title = this.state.toggleTitles[index];

                    return (
                      <div>
                        <button
                          type="button"
                          class={`${it === checked ? "checked" : ""}`}
                          data-index={index}
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
    const unit = 100 / this.state.toggleValues.length;
    return {
      "data-selected-index": selectedIndex,
      cssText: `
                --unit-count: ${this.state.toggleValues.length};
                --button-font-size: ${13 - this.state.toggleValues.length}px ;
                --selected-button-size: ${
                  (1 / this.state.toggleValues.length) * 100
                }%;
                --selected-button-position: ${selectedIndex * unit}%;
            `,
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
    const index = +e.$dt.data("index");

    this.setValue(this.state.toggleValues[index]);
    this.trigger("change");
  }

  [SUBSCRIBE_SELF("change")]() {
    this.sendEvent();
  }
}
