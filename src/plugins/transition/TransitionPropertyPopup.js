import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "sapa";
import BasePopup from "elf/editor/ui/popup/BasePopup";

import "./TransitionPropertyPopup.scss";
import { createComponent } from "sapa";

const property_list = [
  "none",
  "all",
  "background-color",
  "background-position",
  "background-size",
  "border",
  "border-color",
  "border-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-width",
  "border-left",
  "border-left-color",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-width",
  "border-spacing",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-width",
  "bottom",
  "box-shadow",
  "color",
  "filter",

  "font-size",
  "font-size-adjust",
  "font-weight",
  "height",
  "left",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "opacity",

  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "perspective",
  "perspective-origin",
  "right",
  "text-decoration",
  "text-decoration-color",
  "text-indent",
  "text-shadow",
  "top",
  "transform",
  "vertical-align",
  "visibility",
  "width",
  "word-spacing",
  "z-index",
].map((it) => ({
  value: it,
  text: it,
}));

export default class TransitionPropertyPopup extends BasePopup {
  getTitle() {
    return "Transition";
  }

  initState() {
    return {
      changeEvent: "",
      instance: {},
      data: {
        timingFunction: "linear",
        duration: "0s",
        delay: "0s",
        name: "all",
      },
    };
  }

  updateData(opt) {
    this.state.data = { ...this.state.data, ...opt };
    if (this.state.instance) {
      this.state.instance.trigger(this.state.changeEvent, this.state.data);
    }
  }

  getBody() {
    return /*html*/ `<div class='elf--transition-property-popup' ref='$popup'></div>`;
  }

  [LOAD("$popup")]() {
    return /*html*/ `
      <div class="box">
        ${this.templateForProperty()}
        ${this.templateForTimingFunction()}
        ${this.templateForDelay()}
        ${this.templateForDuration()}
      </div>
    `;
  }

  templateForTimingFunction() {
    return /*html*/ `
    <div class='timing-function'>
      <label>Timing function</label>
      ${createComponent("CubicBezierEditor", {
        ref: "$cubicBezierEditor",
        key: "timingFunction",
        value: this.state.data.timingFunction || "linear",
        onChange: "changeCubicBezier",
      })}
    </div>
    `;
  }

  [SUBSCRIBE_SELF("changeTransition")](key, value) {
    this.updateData({
      [key]: value,
    });
  }

  templateForProperty() {
    return /*html*/ `
      <div class='name'>
        ${createComponent("SelectEditor", {
          ref: "$property",
          icon: true,
          label: "Property",
          key: "name",
          value: this.state.data.name,
          options: property_list,
          onChange: "changeTransition",
        })}
      </div>
    `;
  }

  templateForDelay() {
    return /*html*/ `
    <div class='delay'>
      ${createComponent("RangeEditor", {
        ref: "$delay",
        label: "Delay",
        key: "delay",
        value: this.state.data.delay,
        units: ["s", "ms"],
        onChange: "changeRangeEditor",
      })}
    </div>
    `;
  }

  templateForDuration() {
    return /*html*/ `
    <div class='duration'>
      ${createComponent("RangeEditor", {
        ref: "$duration",
        label: "Duration",
        key: "duration",
        value: this.state.data.duration,
        units: ["s", "ms"],
        onChange: "changeRangeEditor",
      })}
    </div>
    `;
  }

  [SUBSCRIBE_SELF("changeRangeEditor")](key, value) {
    this.updateData({ [key]: value });
  }

  [SUBSCRIBE_SELF("changeCubicBezier")](key, value) {
    this.updateData({ [key]: value });
  }

  [SUBSCRIBE("showTransitionPropertyPopup")](data) {
    this.setState(data);

    this.show(250);

    this.children.$cubicBezierEditor.trigger(
      "showCubicBezierEditor",
      data.data.timingFunction
    );
  }

  [SUBSCRIBE("hideTransitionPropertyPopup")]() {
    this.$el.hide();
  }
}
