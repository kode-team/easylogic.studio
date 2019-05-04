import { getXYInCircle, calculateAngle } from "../../../../util/functions/math";
import UIElement, { EVENT } from "../../../../util/UIElement";
import {
  POINTERSTART,
  MOVE,
  INPUT,
  KEYDOWN,
  ENTER,
  ARROW_DOWN,
  ARROW_UP,
  PREVENT,
  STOP
} from "../../../../util/Event";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";

export default class GradientAngle extends UIElement {
  initialize() {
    super.initialize();

    this.angle = 0;
  }
  template() {
    return `
            <div class='drag-angle-rect'>
                <div class="drag-angle" ref="$dragAngle">
                    <div class="angle-text">
                      <span contenteditable='true' ref="$angleText"></span>°
                    </div>
                    <div ref="$dragPointer" class="drag-pointer"></div>
                </div>
            </div>
        `;
  }

  getCurrentXY(isUpdate, angle, radius, centerX, centerY) {
    return isUpdate
      ? editor.config.get("pos")
      : getXYInCircle(angle, radius, centerX, centerY);
  }

  getRectangle() {
    var width = this.refs.$dragAngle.width();
    var height = this.refs.$dragAngle.height();
    var radius = Math.floor((width / 2) * 0.7);
    var { left, top } = this.refs.$dragAngle.offset();
    var minX = left;
    var minY = top;
    var centerX = minX + width / 2;
    var centerY = minY + height / 2;

    return { minX, minY, width, height, radius, centerX, centerY };
  }

  getDefaultValue() {
    return this.angle - 90;
  }

  refreshAngleText(angleText) {
    this.refs.$angleText.text(angleText);
  }

  refreshUI(isUpdate) {
    var { minX, minY, radius, centerX, centerY } = this.getRectangle();
    var { x, y } = this.getCurrentXY(
      isUpdate,
      this.getDefaultValue(),
      radius,
      centerX,
      centerY
    );

    var rx = x - centerX,
      ry = y - centerY,
      angle = calculateAngle(rx, ry);

    {
      var { x, y } = this.getCurrentXY(null, angle, radius, centerX, centerY);
    }

    // set drag pointer position
    this.refs.$dragPointer.px("left", x - minX);
    this.refs.$dragPointer.px("top", y - minY);

    var lastAngle = Math.round(angle + 90) % 360;

    this.refreshAngleText(lastAngle);

    if (isUpdate) {
      this.setAngle(lastAngle);
    }
  }

  getKeyTarget(key) {
    switch (key) {
      case "ArrowDown":
        return "sub";
      case "ArrowUp":
        return "add";
    }
  }

  modifyAngle(e, $el) {
    var type = this.getKeyTarget(e.key || e.code);
    var len = Length.deg(+$el.text());

    len.calculate(type, 1);

    return len;
  }

  updateAngle(angle) {
    this.angle = angle;
    this.refreshUI();
    this.setAngle(this.angle);
  }

  [KEYDOWN("$angleText") + ARROW_DOWN + ARROW_UP + PREVENT + STOP](e) {
    var len = this.modifyAngle(e, this.refs.$angleText);

    this.updateAngle(len.value);
    return false;
  }

  [INPUT("$angleText")](e) {
    this.updateAngle(+this.refs.$angleText.text().trim());
  }

  setAngle(angle) {
    this.emit("changeGradientAngle", angle);
  }

  // Event Bindings
  move() {
    this.refreshUI(true);
  }

  [POINTERSTART("$dragAngle") + MOVE()](e) {}

  [EVENT("showGradientAngle")](angle) {
    this.angle = angle;
    this.refreshUI();

    this.$el.show();
  }

  [EVENT("hideGradientAngle")]() {
    this.$el.hide();
  }

  [EVENT("changeGradientAngle")](angle) {
    this.angle = angle;
    this.refreshUI();
  }
}
