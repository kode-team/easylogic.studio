import UIElement, { EVENT } from "@core/UIElement";
import Event, { POINTERSTART, POINTEREND, POINTERMOVE, PREVENT } from "@core/Event";

export default class ColorPalette extends UIElement {
  template() {
    return /*html*/`
        <div class="color-panel">
            <div ref="$saturation" class="saturation">
                <div ref="$value" class="value">
                    <div ref="$drag_pointer" class="drag-pointer"></div>
                </div>
            </div>        
        </div>        
        `;
  }

  setBackgroundColor(color) {
    this.$el.css("background-color", color);
  }

  refresh() {
    this.setColorUI();
  }

  calculateSV() {
    var pos = this.drag_pointer_pos || { x: 0, y: 0 };

    var width = this.$el.width();
    var height = this.$el.height();

    var s = pos.x / width;
    var v = (height - pos.y) / height;

    this.parent.initColor({
      type: "hsv",
      s,
      v
    });
  }

  setColorUI() {
    var x = this.$el.width() * this.parent.hsv.s,
      y = this.$el.height() * (1 - this.parent.hsv.v);

    this.refs.$drag_pointer.px("left", x);
    this.refs.$drag_pointer.px("top", y);

    this.drag_pointer_pos = { x, y };

    this.setBackgroundColor(this.parent.manager.getHueColor());
  }

  setMainColor(e) {
    // e.preventDefault();
    var pos = this.$el.offset();
    var w = this.$el.contentWidth();
    var h = this.$el.contentHeight();

    var x = Event.pos(e).pageX - pos.left;
    var y = Event.pos(e).pageY - pos.top;

    if (x < 0) x = 0;
    else if (x > w) x = w;

    if (y < 0) y = 0;
    else if (y > h) y = h;

    this.refs.$drag_pointer.px("left", x);
    this.refs.$drag_pointer.px("top", y);

    this.drag_pointer_pos = { x, y };

    this.calculateSV();
  }

  [EVENT("changeColor", 'initColor')]() {
    this.refresh();
  }

  [POINTEREND("document")](e) {
    if (this.isDown) {
      this.isDown = false;
      this.setMainColor(e);      
      // this.parent.lastUpdateColor();
    }

  }

  [POINTERMOVE("document")](e) {
    if (this.isDown) {
      this.setMainColor(e);
    }
  }

  [POINTERSTART()](e) {
    this.isDown = true;
    // this.setMainColor(e);
  }
}
