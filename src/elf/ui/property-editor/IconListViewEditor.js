import { LOAD, BIND, CLICK } from "sapa";

import "./IconListViewEditor.scss";

import icon from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class IconListViewEditor extends EditorElement {
  initState() {
    return {
      value: this.props.value,
    };
  }

  template() {
    return /*html*/ `<div class='select-editor elf--list-view-editor' ref='$body'></div>`;
  }

  [BIND("$body")]() {
    return {
      "data-column": this.props.column || 1,
    };
  }

  [LOAD("$body")]() {
    return Object.keys(icon).map((key) => {
      var html = icon[key];
      var selected = key === this.state.value ? "selected" : "";

      return /*html*/ `<div class='list-view-item ${selected}'  data-key='${key}'>${html}</div>`;
    });
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.state.value = value;
    this.refresh();
  }

  [CLICK("$body .list-view-item")](e) {
    var key = e.$dt.attr("data-key");

    e.$dt.onlyOneClass("selected");

    this.updateData({
      value: key,
    });
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
