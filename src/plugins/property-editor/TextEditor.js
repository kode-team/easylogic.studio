import { BIND, INPUT } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./TextEditor.scss";

export default class TextEditor extends EditorElement {
  initState() {
    var value = this.props.value;
    return {
      label: this.props.label || "",
      value,
    };
  }

  template() {
    var { label, value } = this.state;
    var hasLabel = label ? "has-label" : "";
    return /*html*/ `
            <div class='elf--text-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : ""}
                <div>
                    <input type='text' ref='$text' value="${value}" />
                </div>
            </div>
        `;
  }

  getValue() {
    return this.refs.$text.value;
  }

  setValue(value) {
    this.refs.$text.val(value);
    this.setState(
      {
        value,
      },
      false
    );
  }

  [BIND("$text")]() {
    return {
      value: this.state.value,
    };
  }

  [INPUT("$text")]() {
    this.updateData({
      value: this.refs.$text.value,
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
}
