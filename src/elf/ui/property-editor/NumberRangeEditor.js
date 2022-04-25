import {
  LOAD,
  INPUT,
  CLICK,
  FOCUS,
  BLUR,
  POINTERSTART,
  SUBSCRIBE_SELF,
} from "sapa";

import "./NumberRangeEditor.scss";

import { OBJECT_TO_CLASS } from "elf/core/func";
import icon from "elf/editor/icon/icon";
import { END } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class NumberRangeEditor extends EditorElement {
  initState() {
    var value = Length.parse(this.props.value || Length.number(0));
    value = value.toUnit("number");
    return {
      removable: this.props.removable === "true",
      compact: this.props.compact === "true",
      wide: this.props.wide === "true",
      clamp: this.props.clamp === "true",
      label: this.props.label || "",
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
    return /*html*/ `<div class='small-editor' ref='$body'></div>`;
  }

  [LOAD("$body")]() {
    var { min, max, step, label, removable, layout, compact, wide, disabled } =
      this.state;

    var value = +this.state.value.value.toString();

    if (isNaN(value)) {
      value = 0;
    }

    var layoutClass = layout;

    var realValue = (+value).toString();

    return /*html*/ `
        <div 
            class="${OBJECT_TO_CLASS({
              "elf--number-range-editor": true,
              "has-label": !!label,
              compact: !!compact,
              wide: !!wide,
              "is-removable": removable,
              disabled: disabled,
              [layoutClass]: true,
            })}"
        >
            ${label ? `<label title="${label}">${label}</label>` : ""}
            <div class='range--editor-type' data-type='range'>
                <div class='area'>
                    <div>
                        <input type='range' ref='$property' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    </div>
                    <div>
                        <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" tabIndex="1" />
                    </div>
                </div>
            </div>
            <button type='button' class='remove' ref='$remove' title='Remove'>${
              icon.remove
            }</button>
        </div>
    `;
  }

  setMin(value) {
    this.setState({
      min: Length.parse(value),
    });
  }

  setMax(value) {
    this.setState({
      max: Length.parse(value),
    });
  }

  getValue() {
    if (this.state.clamp) {
      return this.state.value.clamp(this.state.min, this.state.max);
    }

    return this.state.value;
  }

  setValue(value) {
    console.log(value);
    this.setState({
      value: Length.parse(value),
    });
  }

  [FOCUS('$body input[type="number"]')]() {
    this.refs.$propertyNumber.addClass("focused");
  }

  [BLUR('$body input[type="number"]')]() {
    this.refs.$propertyNumber.removeClass("focused");
  }

  [CLICK("$remove")]() {
    this.updateData({
      value: "",
    });
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

  [INPUT('$body input[type="number"]')]() {
    var value = +this.refs.$propertyNumber.value;
    this.getRef("$property").val(value);

    this.updateData({
      value: this.state.value.set(value),
    });
  }

  [INPUT('$body input[type="range"]')]() {
    this.trigger("changeRangeValue");
  }

  [POINTERSTART('$body input[type="range"]') + END()]() {}

  end() {
    this.trigger("changeRangeValue");
  }

  [SUBSCRIBE_SELF("changeRangeValue")]() {
    var value = +this.getRef("$property").value;
    this.getRef("$propertyNumber").val(value);

    if (this.state.value === "") {
      this.state.value = Length.number(0);
    }

    this.updateData({
      value: this.state.value.set(value),
    });
  }
}
