import {
  DOMDIFF,
  LOAD,
  CHANGE,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  createComponent,
} from "sapa";

import "./AnimationPropertyPopup.scss";

import BasePopup from "elf/editor/ui/popup/BasePopup";
import { Length } from "elf/editor/unit/Length";

export default class AnimationPropertyPopup extends BasePopup {
  getTitle() {
    return this.$i18n("animation.property.popup.title");
  }

  initState() {
    return {
      changeEvent: "",
      instance: {},
      data: {},
    };
  }

  updateData(opt) {
    this.state.data = { ...this.state.data, ...opt };
    if (this.state.instance) {
      this.state.instance.trigger(this.state.changeEvent, this.state.data);
    }
  }

  getBody() {
    return <div class="elf--animation-property-popup" ref="$popup"></div>;
  }

  [LOAD("$popup") + DOMDIFF]() {
    return (
      <div class="box">
        {this.templateForKeyframe()}
        {this.templateForTimingFunction()}
        {this.templateForIterationCount()}
        {this.templateForDelay()}
        {this.templateForDuration()}
        {this.templateForDirection()}
        {this.templateForFillMode()}
        {this.templateForPlayState()}
      </div>
    );
  }

  templateForTimingFunction() {
    return (
      <div class="timing-function">
        <label>{this.$i18n("animation.property.popup.timing.function")}</label>
        {createComponent("CubicBezierEditor", {
          ref: "$cubicBezierEditor",
          key: "timingFunction",
          value: this.state.data.timingFunction || "linear",
          onChange: "changeCubicBezier",
        })}
      </div>
    );
  }

  templateForKeyframe() {
    var current = this.$context.selection.current;
    var names = [];
    if (current && current.keyframes) {
      names = current.keyframes.map((it) => {
        return { key: it.name, value: it.name };
      });
    }

    names.unshift({ key: "Select a keyframe", value: "" });

    return (
      <div class="name">
        <label>{this.$i18n("animation.property.popup.keyframe")}</label>
        <div class="input grid-1">
          <select ref="$name">
            {names.map((it) => {
              var selected =
                it.value === this.state.data.name ? true : undefined;
              var label = this.$i18n(it.key);
              return (
                <option value={it.value} selected={selected}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }

  [CHANGE("$name")]() {
    this.updateData({ name: this.refs.$name.value });
  }

  templateForDirection() {
    var options = "normal,reverse,alternate,alternate-reverse"
      .split(",")
      .map((it) => {
        return `${it}:${this.$i18n(it)}`;
      })
      .join(",");

    return (
      <div class="direction">
        {createComponent("SelectEditor", {
          label: this.$i18n("animation.property.popup.direction"),
          ref: "$direction",
          key: "direction",
          value: this.state.data.direction,
          options,
          onChange: "changeSelect",
        })}
      </div>
    );
  }

  [SUBSCRIBE_SELF("changeSelect")](key, value) {
    this.updateData({ [key]: value });
  }

  templateForPlayState() {
    return (
      <div class="play-state">
        {createComponent("SelectEditor", {
          label: this.$i18n("animation.property.popup.play.state"),
          ref: "$playState",
          key: "playState",
          value: this.state.data.playState,
          options: ["paused", "running"],
          onChange: "changeSelect",
        })}
      </div>
    );
  }

  templateForFillMode() {
    var options = "none,forwards,backwards,both"
      .split(",")
      .map((it) => {
        return `${it}:${this.$i18n(it)}`;
      })
      .join(",");

    return (
      <div class="fill-mode">
        {createComponent("SelectEditor", {
          label: this.$i18n("animation.property.popup.fill.mode"),
          ref: "$fillMode",
          key: "fillMode",
          value: this.state.data.fillMode,
          options,
          onChange: "changeSelect",
        })}
      </div>
    );
  }

  templateForDelay() {
    return (
      <div class="delay">
        {createComponent("InputRangeEditor", {
          ref: "$delay",
          label: this.$i18n("animation.property.popup.delay"),
          key: "delay",
          value: this.state.data.delay,
          units: ["s", "ms"],
          onChange: "changeRangeEditor",
        })}
      </div>
    );
  }

  templateForDuration() {
    return (
      <div class="duration">
        {createComponent("InputRangeEditor", {
          ref: "$duration",
          label: this.$i18n("animation.property.popup.duration"),
          key: "duration",
          value: this.state.data.duration,
          units: ["s", "ms"],
          onChange: "changeRangeEditor",
        })}
      </div>
    );
  }

  templateForIterationCount() {
    return (
      <div class="iteration-count">
        {createComponent("IterationCountEditor", {
          ref: "$iterationCount",
          label: this.$i18n("animation.property.popup.iteration"),
          key: "iterationCount",
          value: this.state.iterationCount || 0,
          units: ["normal", "infinite"],
          onChange: "changeRangeEditor",
        })}
      </div>
    );
  }

  [SUBSCRIBE_SELF("changeRangeEditor")](key, value) {
    if (key === "iterationCount") {
      if (value.unit === "normal") {
        value = Length.number(value.value);
      } else {
        value = Length.string(value.unit);
      }
    }
    this.updateData({ [key]: value });
  }

  [SUBSCRIBE_SELF("changeCubicBezier")](key, value) {
    this.updateData({ [key]: value });
  }

  [SUBSCRIBE("showAnimationPropertyPopup")](data) {
    this.setState(data);

    this.show(250);

    this.children.$cubicBezierEditor.trigger(
      "showCubicBezierEditor",
      data.data.timingFunction
    );
  }

  [SUBSCRIBE("hideAnimationPropertyPopup")]() {
    this.$el.hide();
  }
}
