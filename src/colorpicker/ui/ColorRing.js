import ColorWheel from "./ColorWheel";
import { calculateAngle } from "../../util/functions/math";

export default class ColorRing extends ColorWheel {
  initialize() {
    super.initialize();

    this.width = 214;
    this.height = 214;
    this.thinkness = 16;
    this.half_thinkness = this.thinkness / 2;
  }

  template() {
    return `<div class="wheel" data-type="ring">
            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>
            <div class="drag-pointer" ref="$drag_pointer"></div>
        </div>`;
  }

  setColorUI(isEvent) {
    this.renderCanvas();
    this.setHueColor(null, isEvent);
  }

  getDefaultValue() {
    return this.parent.hsv.h;
  }

  setHueColor(e, isEvent) {
    var { minX, minY, radius, centerX, centerY } = this.getRectangle();
    var { x, y } = this.getCurrentXY(
      e,
      this.getDefaultValue(),
      radius,
      centerX,
      centerY
    );

    var rx = x - centerX,
      ry = y - centerY,
      hue = calculateAngle(rx, ry);

    {
      var { x, y } = this.getCurrentXY(
        null,
        hue,
        radius - this.half_thinkness,
        centerX,
        centerY
      );
    }

    // set drag pointer position
    this.refs.$drag_pointer.px("left", x - minX);
    this.refs.$drag_pointer.px("top", y - minY);

    if (!isEvent) {
      this.changeColor({
        type: "hsv",
        h: hue
      });
    }
  }
}
