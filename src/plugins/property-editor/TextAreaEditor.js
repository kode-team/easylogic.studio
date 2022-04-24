import { BIND, INPUT } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./TextAreaEditor.scss";

export default class TextAreaEditor extends EditorElement {
  initState() {
    var value = this.props.value;

    return {
      label: this.props.label || "",
      height: 100,
      value,
    };
  }

  template() {
    var { label, height, value } = this.state;
    var hasLabel = label ? "has-label" : "";
    return /*html*/ `
            <div class='elf--text-area-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : ""}
                <textarea ref='$text' style='height:${height}'>${value}</textarea>
            </div>
        `;
  }

  getValue() {
    return this.refs.$options.value;
  }

  setValue(value, height) {
    this.setState({ value }, false);

    if (height) {
      this.setState({ height }, false);
    }
    this.refresh();
  }

  [BIND("$text")]() {
    return {
      text: this.state.value || "",
      style: {
        height: this.state.height,
      },
    };
  }

  [INPUT("$text")]() {
    this.updateData({
      value: this.refs.$text.value,
    });
  }

  updateData(data) {
    this.setState(data);

    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.value,
      this.props.params
    );
  }
}
