import {
  LOAD,
  CLICK,
  SUBSCRIBE_SELF,
  POINTERSTART,
  isArray,
  Dom,
  createComponent,
} from "sapa";

import "./StrokeDashArrayEditor.scss";

import icon, { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

const dash_list = [
  [10, 5],
  [5, 1],
  [1, 5],
  [0.9],
  [15, 10, 5],
  [15, 10, 5, 10],
  [15, 10, 5, 10, 15],
  [5, 5, 1, 5],
];

export default class StrokeDashArrayEditor extends EditorElement {
  initState() {
    var value = isArray(this.props.value)
      ? this.props.value
      : this.generateValue(this.props.value || "");

    return {
      label: this.props.label || "",
      value,
      count: 1,
    };
  }

  template() {
    const { label } = this.state;
    const hasLabel = !!label;

    return /*html*/ `
      <div class='elf--stroke-dasharray-editor'>
        <div class='tools ${hasLabel ? "has-label" : ""}'>
          ${hasLabel ? `<label class='label'>${label}</label>` : ""}
          <div class="buttons">
            <label ref='$add'>${icon.add}</label>          
          </div>
        </div>      
        <div ref='$body' class='dash-list'></div>
        <div ref='$list' class='dash-sample-list'></div>
      </div>
    `;
  }

  [CLICK("$el .tools label")]() {
    this.refs.$list.toggle();
  }

  getValue() {
    return this.state.value;
  }

  generateValue(value) {
    return value
      .split(" ")
      .filter(Boolean)
      .map((it) => +it);
  }

  setValue(value) {
    if (!isArray(value)) {
      value = this.generateValue(value);
    }

    this.setState({
      value,
    });
  }

  [LOAD("$list")]() {
    return dash_list.map((value, index) => {
      return /*html*/ `
        <div class='dash-sample' data-index='${index}'>
          <div class='dash-sample-value'>
            <svg width="100" height="2">
              <line x1="5" y1="0" x2="95" y2="0" stroke-dasharray="${value.join(
                ","
              )}" stroke-width="2" stroke="black" />
            </svg>
          </div>
        </div>
      `;
    });
  }

  [LOAD("$body")]() {
    this.state.count++;

    return this.state.value.map((value, index) => {
      var num = index + 1;
      return /*html*/ `
        <div class='dasharray-item'>
          ${createComponent("NumberInputEditor", {
            ref: `$dash-${this.state.count}-${num}`,
            compact: true,
            key: index,
            value,
            min: 0,
            max: 100,
            step: 1,
            onchange: "changeRangeEditor",
          })}  
          <button type="button" data-index="${index}" class='delete'>${iconUse(
        "close"
      )}</button>
        </div>
      `;
    });
  }

  [SUBSCRIBE_SELF("changeRangeEditor")](key, value) {
    var index = +key;
    this.state.value[index] = value;

    this.modifyStrokeDashArray();
  }

  [CLICK("$list .dash-sample")](e) {
    const value = dash_list[+e.$dt.data("index")];
    this.setState({ value }, false);

    this.refresh();
    this.modifyStrokeDashArray();
    this.refs.$list.toggle();
  }

  [CLICK("$add")]() {
    this.setState(
      {
        value: [...this.state.value, 0],
      },
      false
    );

    this.refresh();
    this.modifyStrokeDashArray();
  }

  [CLICK("$body .delete")](e) {
    const index = +e.$dt.attr("data-index");

    this.state.value.splice(index, 1);

    this.refresh();
    this.modifyStrokeDashArray();
  }

  modifyStrokeDashArray() {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.getValue(),
      this.props.params
    );
  }

  [POINTERSTART("document")](e) {
    const $target = Dom.create(e.target);

    const parent = $target.closest("elf--stroke-dasharray-editor");

    if (!parent) {
      this.refs.$list.hide();
    }
  }
}
