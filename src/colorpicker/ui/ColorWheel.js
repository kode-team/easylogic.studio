import Color from "../../util/Color";
import Dom from "../../util/Dom";
import Event, { POINTERSTART, POINTERMOVE, POINTEREND } from "../../util/Event";
import UIElement, { EVENT } from "../../util/UIElement";
import { getXYInCircle, calculateAngle } from "../../util/functions/math";

export default class ColorWheel extends UIElement {
  initialize() {
    super.initialize();
    this.width = 214;
    this.height = 214;
    this.thinkness = 0;
    this.half_thinkness = 0;
  }

  template() {
    return `
        <div class="wheel">
            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>
            <div class="wheel-canvas" ref="$valuewheel" ></div>
            <div class="drag-pointer" ref="$drag_pointer"></div>
        </div>
        `;
  }

  refresh(isEvent) {
    this.setColorUI(isEvent);
  }

  setColorUI(isEvent) {
    this.renderCanvas();
    this.renderValue();
    this.setHueColor(null, isEvent);
  }

  renderValue() {
    var value = 1 - this.parent.hsv.v;
    this.refs.$valuewheel.css("background-color", `rgba(0, 0, 0, ${value})`);
  }

  renderWheel(width, height) {
    if (this.width && !width) width = this.width;
    if (this.height && !height) height = this.height;

    const $canvas = Dom.create("canvas");
    const context = $canvas.el.getContext("2d");
    $canvas.el.width = width;
    $canvas.el.height = height;
    $canvas.px("width", width);
    $canvas.px("height", height);

    var img = context.getImageData(0, 0, width, height);
    var pixels = img.data;
    var half_width = Math.floor(width / 2);
    var half_height = Math.floor(height / 2);

    var radius = width > height ? half_height : half_width;
    var cx = half_width;
    var cy = half_height;

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var rx = x - cx + 1,
          ry = y - cy + 1,
          d = rx * rx + ry * ry,
          hue = calculateAngle(rx, ry);

        var rgb = Color.HSVtoRGB(
          hue, // 0~360 hue
          Math.min(Math.sqrt(d) / radius, 1), // 0..1 Saturation
          1 //  0..1 Value
        );

        var index = (y * width + x) * 4;
        pixels[index] = rgb.r;
        pixels[index + 1] = rgb.g;
        pixels[index + 2] = rgb.b;
        pixels[index + 3] = 255;
      }
    }

    context.putImageData(img, 0, 0);

    if (this.thinkness > 0) {
      context.globalCompositeOperation = "destination-out"; // destination-out 은 그리는 영역이 지워진다.
      context.fillStyle = "black";
      context.beginPath();
      context.arc(cx, cy, radius - this.thinkness, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }

    return $canvas;
  }

  renderCanvas() {
    // only once rendering
    if (this.parent.createdWheelCanvas) return;

    const $canvas = this.refs.$colorwheel;
    // console.log($canvas);
    const context = $canvas.el.getContext("2d");

    let [width, height] = $canvas.size();

    if (this.width && !width) width = this.width;
    if (this.height && !height) height = this.height;

    $canvas.el.width = width;
    $canvas.el.height = height;
    $canvas.px("width", width);
    $canvas.px("height", height);

    var $wheelCanvas = this.renderWheel(width, height);

    context.drawImage($wheelCanvas.el, 0, 0);

    this.parent.createdWheelCanvas = true;
  }

  getDefaultValue() {
    return this.parent.hsv.h;
  }

  getDefaultSaturation() {
    return this.parent.hsv.s;
  }

  getCurrentXY(e, angle, radius, centerX, centerY) {
    return e ? e.xy : getXYInCircle(angle, radius, centerX, centerY);
  }

  getRectangle() {
    var width = this.$el.width();
    var height = this.$el.height();
    var radius = this.refs.$colorwheel.width() / 2;

    var minX = this.$el.offsetLeft();
    var centerX = minX + width / 2;

    var minY = this.$el.offsetTop();
    var centerY = minY + height / 2;

    return { minX, minY, width, height, radius, centerX, centerY };
  }

  setHueColor(e, isEvent) {
    var { minX, minY, radius, centerX, centerY } = this.getRectangle();

    var { x, y } = this.getCurrentXY(
      e,
      this.getDefaultValue(),
      this.getDefaultSaturation() * radius,
      centerX,
      centerY
    );

    var rx = x - centerX,
      ry = y - centerY,
      d = rx * rx + ry * ry,
      hue = calculateAngle(rx, ry);

    if (d > radius * radius) {
      var { x, y } = this.getCurrentXY(null, hue, radius, centerX, centerY);
    }

    // saturation 을
    var saturation = Math.min(Math.sqrt(d) / radius, 1);

    // set drag pointer position
    this.refs.$drag_pointer.px("left", x - minX);
    this.refs.$drag_pointer.px("top", y - minY);

    if (!isEvent) {
      this.changeColor({
        type: "hsv",
        h: hue,
        s: saturation
      });
    }
  }

  changeColor(opt) {
    this.parent.manager.changeColor(opt || {});
  }

  [EVENT("changeColor")]() {
    this.refresh(true);
  }

  [EVENT("initColor")]() {
    this.refresh(true);
  }

  // Event Bindings
  [POINTEREND("document")](e) {
    this.isDown = false;
  }

  [POINTERMOVE("document")](e) {
    if (this.isDown) {
      this.setHueColor(e);
    }
  }

  [POINTERSTART("$drag_pointer")](e) {
    e.preventDefault();
    this.isDown = true;
  }

  [POINTERSTART()](e) {
    this.isDown = true;
    this.setHueColor(e);
  }
}
