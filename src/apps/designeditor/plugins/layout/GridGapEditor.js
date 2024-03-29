import { LOAD, SUBSCRIBE_SELF, createComponent } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export default class GridGapEditor extends EditorElement {
  initState() {
    return {
      label: this.props.label,
      value: this.parseValue(this.props.value),
    };
  }

  setValue(value) {
    this.setState({
      list: this.parseValue(value),
    });
  }

  parseValue(value) {
    return Length.parse(value);
  }

  getValue() {
    return this.state.value;
  }

  modifyData() {
    this.parent.trigger(this.props.onchange, this.props.key, this.getValue());
  }

  makeItem() {
    return /*html*/ `
            <div class='item'>
                <div class='value'>
                    ${createComponent("InputRangeEditor", {
                      label: this.state.label,
                      wide: true,
                      ref: "$value",
                      key: "value",
                      value: this.state.value,
                      max: 500,
                      units: ["px", "em", "%"],
                      onchange: "changeKeyValue",
                    })}
                </div>
            </div>
        `;
  }

  [LOAD("$list")]() {
    return this.makeItem();
  }

  template() {
    return /*html*/ `
            <div class='grid-gap-editor' ref='$body' >
                <div class='grid-gap-editor-item'>
                    <div ref='$list'></div>
                </div>
            </div>
        `;
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value) {
    this.state.value = value;

    this.modifyData();
  }
}
