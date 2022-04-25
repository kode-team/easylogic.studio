import { LOAD, INPUT, BIND } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class InputArrayEditor extends EditorElement {
  initState() {
    var values = this.props.values.split(" ").map((it) => +it);
    return {
      values,
      column: this.props.column,
    };
  }

  template() {
    return /*html*/ `<div class='small-editor input-array-editor' ref='$body' ></div>`;
  }

  [BIND("$body")]() {
    return {
      cssText: `
                display: grid;
                grid-template-columns: repeat(${this.state.column}, 1fr);
                grid-column-gap: 2px;
                grid-row-gap: 2px;
            `,
    };
  }

  [LOAD("$body")]() {
    var { values } = this.state;

    return values.map((value, index) => {
      return `
                <div class='number-editor'>
                    <input type="number" value="${value}" step="0.01" data-index="${index}" />
                </div>
            `;
    });
  }

  updateData(data) {
    this.setState(data, false);
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.values,
      this.props.params
    );
  }

  [INPUT("$body input")](e) {
    var $el = e.$dt;
    var index = +$el.attr("data-index");
    var value = +$el.value;

    this.state.values[index] = value;

    this.updateData();
  }
}
