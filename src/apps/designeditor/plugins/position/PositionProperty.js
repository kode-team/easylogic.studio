import {
  CLICK,
  IF,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  THROTTLE,
  createComponent,
} from "sapa";

import "./PositionProperty.scss";

import { round } from "elf/core/math";
import { REFRESH_SELECTION, UPDATE_CANVAS } from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { Length } from "elf/editor/unit/Length";

const DEFAULT_SIZE = 0;

export default class PositionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("position.property.title");
  }

  afterRender() {
    this.show();
  }

  [SUBSCRIBE(REFRESH_SELECTION)]() {
    this.refreshShowIsNot(["project"]);
  }

  checkChangedValue() {
    var current = this.$context.selection.current;

    if (!current) return false;

    return current.hasChangedField(
      "x",
      "y",
      "right",
      "bottom",
      "width",
      "height",
      "angle",
      "transform",
      "opacity",
      "resizingVertical",
      "resizingHorizontal",
      "constraints-horizontal",
      "constriants-vertical"
    );
  }

  [SUBSCRIBE(UPDATE_CANVAS) + IF("checkChangedValue") + THROTTLE(10)]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    this.children.$x.setValue(round(current.offsetX || DEFAULT_SIZE, 100));
    this.children.$y.setValue(round(current.offsetY || DEFAULT_SIZE, 100));
    this.children.$width.setValue(round(current.width || DEFAULT_SIZE, 100));
    this.children.$height.setValue(round(current.height || DEFAULT_SIZE, 100));
    this.children.$opacity.setValue(current.opacity || "1");
    this.children.$rotate.setValue(Length.deg(current.angle).round(100));
  }

  isHideHeader() {
    return true;
  }

  getBodyClassName() {
    return "no-padding";
  }

  getBody() {
    return /*html*/ `
      <div class="position-item" ref="$positionItem">
        <div class="grid-layout">
          ${createComponent("NumberInputEditor", {
            ref: "$x",
            compact: true,
            label: "X",
            key: "x",
            min: -100000,
            max: 100000,
            trigger: "enter",
            onchange: "changRangeEditor",
          })}
          ${createComponent("NumberInputEditor", {
            ref: "$y",
            compact: true,
            trigger: "enter",
            label: "Y",
            key: "y",
            min: -10000,
            max: 10000,
            onchange: "changRangeEditor",
          })}
        </div>
        <div class="grid-layout">          
          ${createComponent("NumberInputEditor", {
            ref: "$width",
            compact: true,
            trigger: "enter",
            label: "W",
            key: "width",
            min: 0,
            max: 3000,
            onchange: "changRangeEditor",
          })}
          ${createComponent("NumberInputEditor", {
            ref: "$height",
            compact: true,
            trigger: "enter",
            label: "H",
            key: "height",
            min: 0,
            max: 3000,
            onchange: "changRangeEditor",
          })}
        </div> 
        <div class="grid-layout">
          ${createComponent("InputRangeEditor", {
            ref: "$rotate",
            key: "rotateZ",
            compact: true,
            label: "rotate_left",
            min: -360,
            max: 360,
            step: 1,
            units: ["deg"],
            onchange: "changeRotate",
          })}
          ${createComponent("NumberInputEditor", {
            ref: "$opacity",
            key: "opacity",
            compact: true,
            label: "opacity",
            min: 0,
            max: 1,
            step: 0.01,
            onchange: "changeSelect",
          })}
        </div>                
      </div>
    `;
  }

  refresh() {
    const current = this.$context.selection.current;
    if (current) {
      this.children.$x.setValue(round(current.offsetX || DEFAULT_SIZE, 100));
      this.children.$y.setValue(round(current.offsetY || DEFAULT_SIZE, 100));
      this.children.$width.setValue(round(current.width || DEFAULT_SIZE, 100));
      this.children.$height.setValue(
        round(current.height || DEFAULT_SIZE, 100)
      );
      this.children.$opacity.setValue(current.opacity || "1");
      this.children.$rotate.setValue(Length.deg(current.angle));
    }
  }

  [CLICK("$positionItem button[data-command]")](e) {
    const command = e.$dt.data("command");
    console.log(command);
  }

  [SUBSCRIBE_SELF("changRangeEditor")](key, value) {
    // FIXME: key 가 width, height 일 때는 개별 transform 을 모두 적용한 상태로 맞춰야 한다.
    // FIXME: selection tool view 에 있는 right, bottom 기능을 자체적으로 구현해야한다.
    this.$commands.executeCommand(
      "setAttribute",
      "change position or size",
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }

  [SUBSCRIBE_SELF("changeRotate")](key, rotate) {
    this.$commands.executeCommand(
      "setAttribute",
      "change rotate",
      this.$context.selection.packByValue({
        angle: rotate.value,
      })
    );
  }

  [SUBSCRIBE_SELF("changeSelect")](key, value) {
    this.$commands.executeCommand(
      "setAttribute",
      `change ${key}`,
      this.$context.selection.packByValue({
        [key]: value,
      })
    );
  }
}
