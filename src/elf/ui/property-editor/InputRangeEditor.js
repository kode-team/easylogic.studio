import {
  LOAD,
  INPUT,
  CLICK,
  SUBSCRIBE_SELF,
  POINTERSTART,
  FOCUSIN,
  FOCUSOUT,
  createComponent,
  classnames,
  DOMDIFF,
} from "sapa";

import "./InputRangeEditor.scss";

import { round } from "elf/core/math";
import icon from "elf/editor/icon/icon";
import { END, MOVE } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class InputRangeEditor extends EditorElement {
  initState() {
    var units = this.props.units || ["px", "em", "%", "auto"];
    var value = Length.parse(this.props.value || "0px");
    let label = this.props.label || "";

    if (icon[label]) {
      label = icon[label];
    }

    return {
      removable: this.props.removable,
      label,
      compact: this.props.compact,
      wide: this.props.wide,
      min: +this.props.min || 0,
      max: +this.props.max || 100,
      step: +this.props.step || 1,
      key: this.props.key,
      params: this.props.params || "",
      layout: this.props.layout || "",
      disabled: this.props.disabled,
      title: this.props.title || "",
      units,
      value,
    };
  }

  template() {
    return /*html*/ `<div class='small-editor' ref='$body'></div>`;
  }

  [LOAD("$body") + DOMDIFF]() {
    var {
      min,
      max,
      step,
      label,
      title,
      compact,
      wide,
      removable,
      layout,
      disabled,
    } = this.state;

    var value = +this.state.value.value.toString();

    if (isNaN(value)) {
      value = 0;
    }

    var layoutClass = layout;

    var realValue = (+value).toString();
    const units = this.state.units;

    return /*html*/ `<div 
            ref="$range",
            class="${classnames({
              "elf--input-range-editor": true,
              "has-label": !!label,
              compact: !!compact,
              wide: !!wide,
              "is-removable": removable,
              disabled: disabled,
              [layoutClass]: true,
            })}"
        >${
          label ? `<label title="${title}">${label}</label>` : ""
        }<div class='range--editor-type' 
        data-type='range'><div class='area'><input type='number' class='property-number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" tabIndex="1" />${
      units.length === 1
        ? `<span class='unit'>${units[0]}</span>`
        : createComponent("SelectEditor", {
            ref: "$unit",
            key: "unit",
            compact: true,
            value: this.state.selectedUnit || this.state.value.unit,
            options: this.state.units,
            onchange: "changeUnit",
          })
    }</div></div><button type='button' class='remove' ref='$remove' title='Remove'>${
      icon.remove
    }</button></div>`;
  }

  getValue() {
    return this.state.value.clone();
  }

  setValue(value) {
    this.setState(
      {
        value: Length.parse(value),
      },
      false
    );

    // console.log(this.state.value.value);

    this.refs.$propertyNumber.val(this.state.value.value);
    this.children.$unit?.setValue(this.state.value.unit);
  }

  disabled() {
    this.setState({
      disabled: true,
    });
  }

  enabled() {
    this.setState({
      disabled: false,
    });
  }

  [CLICK("$remove")]() {
    this.updateData({
      value: "",
    });
  }

  getUnit() {
    return this.children.$unit?.getValue() || this.state.value.unit;
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

  initValue() {
    if (this.state.value == "") {
      this.state.value = new Length(0, this.getUnit());
    }
  }

  [INPUT("$body .property-number")](e) {
    var value = +e.$dt.value;

    this.initValue();

    this.updateData({
      value: new Length(value, this.getUnit()),
    });
  }

  [SUBSCRIBE_SELF("changeUnit")](key, value) {
    this.initValue();

    this.updateData({
      value: this.state.value.toUnit(value),
    });
  }

  [FOCUSIN("$body input[type=number]")](e) {
    this.refs.$range.addClass("focused");
    e.$dt.select();
  }

  [FOCUSOUT("$body input[type=number]")]() {
    this.refs.$range.removeClass("focused");
  }

  [POINTERSTART("$body .elf--input-range-editor label") +
    MOVE("moveDrag") +
    END("moveDragEnd")]() {
    this.refs.$range.addClass("drag");

    this.initNumberValue = +this.refs.$propertyNumber.value;
    this.initUnit = this.state.value.unit;
    this.initUnits = this.state.units;
    this.refs.$propertyNumber.focus();
    this.refs.$propertyNumber.select();
  }

  moveDrag(dx) {
    let newValue = Math.floor(
      round(this.initNumberValue + dx * this.state.step, 100)
    );
    newValue = Math.min(this.state.max, Math.max(this.state.min, newValue));

    this.updateData({
      value: new Length(newValue, this.getUnit()),
    });
    this.refs.$propertyNumber.val(this.state.value.value);
  }

  moveDragEnd() {
    this.refs.$range.removeClass("drag");
  }
}
