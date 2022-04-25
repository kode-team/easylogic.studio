import { CLICK, BIND, SUBSCRIBE } from "sapa";

import "./BackgroundPositionEditor.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class BackgroundPositionEditor extends EditorElement {
  initState() {
    return {
      index: this.props.index,
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
      repeat: this.props.repeat,
      size: this.props.size,
      blendMode: this.props.blendMode,
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);
    this.modifyValue(opt);
  }

  modifyValue(value) {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      value,
      this.state.index
    );
  }

  setValue(obj) {
    this.setState({
      ...obj,
    });
  }

  [BIND("$miniView")]() {
    return {
      style: {
        "background-image": "linear-gradient(to top right, black, white)",
        "background-repeat": this.state.repeat,
        "background-size": "10px 10px",
      },
    };
  }

  template() {
    return /*html*/ `
            <div class='elf--background-position-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `;
  }

  [CLICK("$preview")]() {
    this.viewBackgroundPositionPopup();
  }

  viewBackgroundPositionPopup() {
    this.emit(
      "showBackgroundImagePositionPopup",
      {
        changeEvent: "changeBackgroundPositionPattern",
        data: this.state,
      },
      {
        id: this.id,
      },
      this.$el.rect()
    );
  }

  [SUBSCRIBE("changeBackgroundPositionPattern")](pattern, params) {
    if (params.id === this.id) {
      this.updateData({ ...pattern });
    }
  }
}
