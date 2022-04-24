import {
  LOAD,
  INPUT,
  FOCUSIN,
  FOCUSOUT,
  POINTERSTART,
  KEYUP,
  ENTER,
  IF,
  DEBOUNCE,
  DOMDIFF,
} from "sapa";
import icon from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./NumberInputEditor.scss";
import { END, MOVE } from "elf/editor/types/event";
import { round } from "elf/utils/math";
import { OBJECT_TO_CLASS } from "elf/utils/func";
import { isBoolean } from "sapa";

export default class NumberInputEditor extends EditorElement {
  initState() {
    var value = +this.props.value;
    let label = this.props.label || "";

    if (icon[label]) {
      label = icon[label];
    }

    const compact = isBoolean(this.props.compact)
      ? this.props.compact
      : this.props.compact === "true";
    const wide = isBoolean(this.props.wide)
      ? this.props.wide
      : this.props.wide === "true";
    const mini = isBoolean(this.props.mini)
      ? this.props.mini
      : this.props.mini === "true";
    const trigger = this.props.trigger || "input";

    return {
      label,
      compact,
      wide,
      mini,
      trigger,
      min: +this.props.min || 0,
      max: +this.props.max || 100,
      step: +this.props.step || 1,
      key: this.props.key,
      params: this.props.params || "",
      layout: this.props.layout || "",
      value,
    };
  }

  template() {
    return `<div class='small-editor' ref='$body'></div>`;
  }

  [LOAD("$body") + DOMDIFF]() {
    var {
      min,
      max,
      step,
      label,
      type,
      layout,
      mini,
      compact,
      wide,
      disabled,
      removable,
    } = this.state;

    var value = this.state.value;

    if (isNaN(value)) {
      value = 0;
    }

    var layoutClass = layout;

    var realValue = (+value).toString();

    return /*html*/ `
        <div 
            class="${OBJECT_TO_CLASS({
              "elf--number-input-editor": true,
              "has-label": !!label,
              compact: !!compact,
              wide: !!wide,
              mini: !!mini,
              "is-removable": removable,
              disabled: disabled,
              [layoutClass]: true,
            })}"
            ref="$range"
            data-selected-type='${type}'>
            ${label ? `<label>${label}</label>` : ""}
            <div class='range--editor-type' data-type='range'>
                <div class='area'>
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                </div>
            </div>
        </div>
    `;
  }

  getValue() {
    return this.state.value || 0;
  }

  setValue(value) {
    this.setState(
      {
        value,
      },
      false
    );

    this.refs.$propertyNumber.val(this.state.value);
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

  [FOCUSIN("$body input[type=number]")](e) {
    this.refs.$range.addClass("focused");
    e.$dt.select();
  }

  [FOCUSOUT("$body input[type=number]")]() {
    this.refs.$range.removeClass("focused");
  }

  updateValue(e) {
    var value = +e.$dt.value;

    this.updateData({
      value,
    });
  }

  isTriggerInput() {
    return this.state.trigger === "input";
  }

  isTriggerEnter() {
    return this.state.trigger === "enter";
  }

  [INPUT("$body input[type=number]") + IF("isTriggerInput") + DEBOUNCE(500)](
    e
  ) {
    this.updateValue(e);
  }

  [KEYUP("$body input[type=number]") + IF("isTriggerEnter") + ENTER](e) {
    this.updateValue(e);
    e.$dt.select();
  }

  [POINTERSTART("$body label") + MOVE("moveDrag") + END("moveDragEnd")]() {
    this.refs.$range.addClass("drag");

    this.initValue = +this.refs.$propertyNumber.value;
  }

  moveDrag(dx) {
    let newValue = round(
      this.initValue + dx * this.state.step,
      1 / this.state.step
    );
    newValue = Math.min(this.state.max, Math.max(this.state.min, newValue));
    this.updateData({
      value: newValue,
    });
    this.refs.$propertyNumber.val(this.state.value);
  }

  moveDragEnd() {
    this.refs.$range.removeClass("drag");
  }
}
