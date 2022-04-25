import { LOAD, CLICK, DOMDIFF } from "sapa";

import { BaseUI } from "../BaseUI";
import "./Button.scss";

export class Button extends BaseUI {
  initState() {
    return {
      label: this.props.label || "",
      text: this.props.text || "",
      params: this.props.params || "",
    };
  }

  template() {
    return `<div class='small-editor button' ref='$body'></div>`;
  }

  [LOAD("$body") + DOMDIFF]() {
    var { label, text } = this.state;

    var hasLabel = label ? "has-label" : "";

    return /*html*/ `
        <div class='elf--button ${hasLabel}'>
            ${label ? `<label title="${label}">${label}</label>` : ""}
            <div class='area'>
                <button type="button" >${text || label}</button>
            </div>
        </div>
    `;
  }

  getValue() {
    return this.props.defaultValue;
  }

  [CLICK("$el button")]() {
    this.sendEvent();
  }
}
