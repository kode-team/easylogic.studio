import { CLICK, LOAD, SUBSCRIBE, SUBSCRIBE_SELF, createComponent } from "sapa";

import "./BackgroundImagePositionPopup.scss";

import BasePopup from "elf/editor/ui/popup/BasePopup";

export default class BackgroundImagePositionPopup extends BasePopup {
  getTitle() {
    return this.$i18n("background.image.position.popup.title");
  }

  initState() {
    return {
      size: this.props.size || "auto",
      repeat: this.props.repeat || "repeat",
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      blendMode: this.props.blendMode,
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, opt, this.state.params);
  }

  templateForSize() {
    return createComponent("SelectEditor", {
      label: this.$i18n("background.image.position.popup.size"),
      ref: "$size",
      key: "size",
      value: this.state.size,
      options: ["contain", "cover", "auto"],
      onchange: "changeRangeEditor",
    });
  }

  [SUBSCRIBE_SELF("changeRangeEditor")](key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    return createComponent("InputRangeEditor", {
      label: "X",
      compact: true,
      ref: "$x",
      key: "x",
      value: this.state.x,
      min: -1000,
      max: 1000,
      step: 1,
      onchange: "changeRangeEditor",
    });
  }

  templateForY() {
    return createComponent("InputRangeEditor", {
      label: "Y",
      compact: true,
      ref: "$y",
      key: "y",
      value: this.state.y,
      min: -1000,
      max: 1000,
      step: 1,
      onchange: "changeRangeEditor",
    });
  }

  templateForWidth() {
    return createComponent("InputRangeEditor", {
      label: "W",
      compact: true,
      ref: "$width",
      key: "width",
      value: this.state.width,
      min: 0,
      max: 500,
      step: 1,
      onchange: "changeRangeEditor",
    });
  }

  templateForHeight() {
    return createComponent("InputRangeEditor", {
      label: "H",
      compact: true,
      ref: "$height",
      key: "height",
      value: this.state.height,
      min: 0,
      max: 500,
      step: 1,
      onchange: "changeRangeEditor",
    });
  }

  templateForRepeat() {
    return /*html*/ `
    <div class='grid'>
      <label>${this.$i18n("background.image.position.popup.repeat")}</label>
    </div>
    <div class='repeat-list' ref="$repeat" data-value='${this.state.repeat}'>
        <button type="button" value='no-repeat' title="${this.$i18n(
          "background.image.position.popup.type.no-repeat"
        )}"></button>
        <button type="button" value='repeat' title="${this.$i18n(
          "background.image.position.popup.type.repeat"
        )}"></button>
        <button type="button" value='repeat-x' title="${this.$i18n(
          "background.image.position.popup.type.repeat-x"
        )}"></button>
        <button type="button" value='repeat-y' title="${this.$i18n(
          "background.image.position.popup.type.repeat-y"
        )}"></button>
        <button type="button" value='space' title="${this.$i18n(
          "background.image.position.popup.type.space"
        )}"></button>
        <button type="button" value='round' title="${this.$i18n(
          "background.image.position.popup.type.round"
        )}"></button>
    </div>
    `;
  }

  [CLICK("$repeat button")]({ $dt: $t }) {
    this.refs.$repeat.attr("data-value", $t.value);
    this.updateData({ repeat: $t.value });
  }

  getBody() {
    return /*html*/ `
      <div class="elf--background-image-position-picker" ref='$picker'></div>
    `;
  }

  [LOAD("$picker")]() {
    return /*html*/ `
      
      <div class='box'>

        <div class='background-property'>
          ${this.templateForSize()}      
          ${this.templateForX()}
          ${this.templateForY()}
          ${this.templateForWidth()}
          ${this.templateForHeight()}
          ${this.templateForRepeat()}
        </div>
      </div>
    `;
  }

  [SUBSCRIBE("showBackgroundImagePositionPopup")](data, params, rect) {
    this.state.changeEvent = data.changeEvent || "changeFillPopup";
    this.state.params = params;

    this.setState(data.data);

    this.showByRect(this.makeRect(180, 310, rect));
  }
}
