import BaseProperty from "./BaseProperty";
import { CLICK, CHANGE, INPUT, LOAD } from "../../../../../util/Event";
import { Length } from "../../../../../editor/unit/Length";
import { editor } from "../../../../../editor/editor";
import { html } from "../../../../../util/functions/func";
import { EVENT } from "../../../../../util/UIElement";

const borderStyleLit = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
];

const borderTypeList = ["all", "top", "right", "bottom", "left"];

export default class BorderProperty extends BaseProperty {
  getTitle() {
    return "Border";
  }

  afterRender() {
    this.refresh();
  }

  [LOAD("$borderDirection")]() {
    var current = editor.selection.current || { border: {} };

    return borderTypeList.map(type => {
      return `<button type="button" data-value="${type}" ref="$${type}" has-value='${!!current
        .border[type]}'></button>`;
    });
  }

  getTemplateForBorderProperty() {
    return html`
      <div class="property-item border-item">
        <div
          class="border-direction"
          ref="$borderDirection"
          data-selected-value="all"
        ></div>
        <div class="input-group">
          <div class="input-field">
            <div class="slider">
              <label>Width</label>
            </div>
            <div class="input-ui">
              <div class="input">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value="0"
                  ref="$widthRange"
                />
              </div>
            </div>
          </div>
          <div class="input-field">
            <div class="slider">
              <label>&nbsp;</label>
            </div>
            <div class="input-ui">
              <div class="input">
                <input type="number" min="0" max="100" value="0" ref="$width" />
              </div>
              <div class="select">
                <select class="unit" ref="$unit">
                  <option value="px">px</option>
                  <option value="em">em</option>
                </select>
              </div>
            </div>
          </div>
          <div class="input-field">
            <div class="slider">
              <label>Style</label>
            </div>
            <div class="input-ui">
              <div class="style">
                <select ref="$style">
                  ${borderStyleLit.map(it => {
                    return `<option value="${it}" ${
                      it === "solid" ? "selected" : ""
                    }>${it}</option>`;
                  })}
                </select>
              </div>
            </div>
          </div>

          <div class="input-field">
            <div class="slider">
              <label>Color</label>
            </div>
            <div class="input-ui">
              <div
                class="color"
                ref="$color"
                style="background-color: black"
              ></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getBody() {
    return `
        ${this.getTemplateForBorderProperty()}
    `;
  }

  // TODO: current 객체와 데이타 연동이 필요하다.
  refresh() {
    this.load();
  }

  [CHANGE("$unit")](e) {
    this.refreshBorderInfo();
  }

  [INPUT("$widthRange")](e) {
    this.refs.$width.val(this.refs.$widthRange.value);
    this.refreshBorderInfo();
  }

  [INPUT("$width")](e) {
    this.refs.$widthRange.val(this.refs.$width.value);
    this.refreshBorderInfo();
  }

  [CHANGE("$style")](e) {
    this.refreshBorderInfo();
  }

  refreshBorderInfo() {
    var value = this.refs.$width.value;
    var type = this.refs.$borderDirection.attr("data-selected-value");
    var unit = this.refs.$unit.value;
    var style = this.refs.$style.value;
    var color = this.refs.$color.css("background-color");

    var current = editor.selection.current;

    if (current) {
      // ArtBoard, Layer 에 새로운 BackgroundImage 객체를 만들어보자.
      current.setBorder(type, {
        width: new Length(value, unit),
        style,
        color
      });

      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [CLICK("$borderDirection button")](e) {
    var type = e.$delegateTarget.attr("data-value");
    this.refs.$borderDirection.attr("data-selected-value", type);

    var current = editor.selection.current;
    if (current) {
      current.setBorder(type);
    }

    this.refresh();
  }

  [CLICK("$color")](e) {
    this.emit("showColorPicker", {
      changeEvent: "changeBorderColor",
      color: this.refs.$color.css("background-color")
    });
    this.emit("hidePropertyPopup");
    this.emit("hideGradientEditor");
  }

  [EVENT("changeBorderColor")](color) {
    this.refs.$color.css("background-color", color);
    this.refreshBorderInfo();
  }
}
