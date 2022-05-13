import { SUBSCRIBE_SELF, createComponent } from "sapa";

import ColorInformation from "./colorpicker/ColorInformation";
import Palette from "./colorpicker/ColorPalette";
import ColorView from "./colorpicker/control/ColorView";
import Hue from "./colorpicker/control/Hue";
import Opacity from "./colorpicker/control/Opacity";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import ColorManagerV2 from "plugins/color/ColorManagerV2";

export default class ColorPickerEditor extends EditorElement {
  created() {
    this.manager = new ColorManagerV2();
  }

  initState() {
    const value = this.props.value || "rgba(0, 0, 0, 1)";

    this.manager.initColor(value);

    return {
      key: this.props.key,
      value: this.manager.toString(),
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);
    this.modifyColorPicker();
  }

  modifyColorPicker() {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.state.value,
      this.props.params
    );
  }

  /**
   *
   * initialize color for colorpicker
   *
   * @param {String|Object} newColor
   * @param {String} format  hex, rgb, hsl
   */
  initColor(newColor, format) {
    this.manager.changeColor(newColor, format);

    this.refresh();
  }

  changeColor(newColor, format) {
    this.manager.changeColor(newColor, format);

    this.refresh();

    this.updateData({
      value: this.manager.toColor(),
    });
  }

  [SUBSCRIBE_SELF("selectColorAssets")](key, color) {
    this.lastUpdateColor(color);
  }

  changeFormat(format) {
    this.manager.changeFormat(format);

    this.setState(
      {
        value: this.manager.toColor(),
      },
      false
    );

    this.modifyColorPicker();
    this.changeEndColor();
  }

  lastUpdateColor(newColor, format) {
    this.manager.changeColor(newColor, format);

    this.refresh();

    this.setState(
      {
        value: this.manager.toColor(),
      },
      false
    );

    this.modifyColorPicker();
    this.changeEndColor();
  }

  changeEndColor() {
    this.parent.trigger(
      this.props.onchangeend,
      this.props.key,
      this.state.value,
      this.props.params
    );
  }

  refresh() {
    const color = this.manager.toColor();

    this.children.$palette.setValue(
      this.manager.hsv.s,
      this.manager.hsv.v,
      this.manager.getHueColor()
    );
    this.children.$opacity.setValue(this.manager.rgb, this.manager.alpha);
    this.children.$hue.setValue(this.manager.hsv.h);
    this.children.$colorview.setValue(color);

    this.children.$information.setValue();
  }

  components() {
    return {
      Hue,
      Opacity,
      ColorView,
      Palette,
      ColorInformation,
      // ColorAssetsEditor,
      // CurrentColorSets,
      // ColorSetsChooser,
      // ContextMenu
    };
  }

  template() {
    return /*html*/ `
        <div class='colorpicker sketch inline'>
            <div class='colorpicker-body'>
                ${createComponent("Palette", { ref: "$palette" })}
                <div class="control">
                    ${createComponent("Hue", { ref: "$hue" })}
                    ${createComponent("Opacity", { ref: "$opacity" })}
                    <div class="empty"></div>
                    ${createComponent("ColorView", {
                      ref: "$colorview",
                    })}                    
                </div>
                ${createComponent("ColorInformation", {
                  ref: "$information",
                })}                
                ${this.$context.injectManager.generate("colorpicker")}
                ${createComponent("ColorAssetsEditor", {
                  ref: "$colorAsset",
                  key: "colorAssets",
                  onchange: "selectColorAssets",
                })}
            </div>
        </div>
      `;
  }
}
