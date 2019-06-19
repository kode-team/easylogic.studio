import UIElement, { EVENT } from "../../../../../util/UIElement";
import ColorPickerUI from "../../../../../colorpicker/index";
import { html } from "../../../../../util/functions/func";
import { Length } from "../../../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../../../types/event";
import { CLICK } from "../../../../../util/Event";
import Dom from "../../../../../util/Dom";

export default class ColorPicker extends UIElement {
  afterRender() {
    // this.$el.hide();

    var defaultColor = "rgba(0, 0, 0, 0)";

    this.colorPicker = ColorPickerUI.create({
      type: "sketch",
      position: "inline",
      container: this.refs.$color.el,
      color: defaultColor,
      onChange: c => {
        this.changeColor(c);
      }
    });

    setTimeout(() => {
      this.colorPicker.dispatch("initColor", defaultColor);
    }, 100);
  }

  template() {
    return html`
      <div class="fill-picker">
        <div class="picker-tab-container" ref="$tabContainer">
          <div
            class="picker-tab-content selected"
            data-content-type="color"
            ref="$color"
          ></div>
        </div>
      </div>
    `;
  }

  changeColor(color) {
    this.emit(this.changeEvent, color, this.changeData);
  }

  [EVENT("showColorPicker")](config, data) {

    var opt = {
      top: Length.px(110)
    }

    if (config.right) {
      opt.right = config.right || Length.px(320)
    } else if (config.left) {
      opt.left = config.left 
    }
    this.$el
      .css(opt)
      .show();

    this.changeEvent = config.changeEvent;
    this.changeData = data;
    this.colorPicker.initColorWithoutChangeEvent(config.color);

    this.emit("hidePicker");
  }

  [EVENT("hidePicker", CHANGE_SELECTION)]() {
    this.$el.hide();
  }

  [CLICK('document')] (e) {
    var isShow = !!new Dom(e.target).closest('fill-picker')

    if (this.$el.css('display') != 'none' && !isShow) {
      this.trigger('hidePicker')
    }
  }
}
