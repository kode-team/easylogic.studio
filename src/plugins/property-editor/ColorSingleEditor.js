import { CLICK, BIND } from "sapa";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./ColorSingleEditor.scss";

export default class ColorSingleEditor extends EditorElement {
  initState() {
    return {
      params: this.props.params,
      color: this.props.color || "rgba(0, 0, 0, 1)",
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);
    this.modifyColor();
  }

  modifyColor() {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.color,
      this.state.params
    );
  }

  changeColor(color) {
    this.setState({ color });
  }

  setValue(color) {
    this.changeColor(color);
  }

  [BIND("$miniView")]() {
    return {
      style: {
        "background-color": this.state.color,
      },
    };
  }

  template() {
    return /*html*/ `
            <div class='elf--color-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `;
  }

  [CLICK("$preview")]() {
    this.viewColorPicker();
  }

  viewColorPicker() {
    this.emit("showColorPickerPopup", {
      target: this,
      changeEvent: (color) => {
        this.refs.$miniView.cssText(`background-color: ${color}`);
        this.updateData({ color });
      },
      color: this.state.color,
    });
  }
}
