import BaseProperty from "./BaseProperty";
import { CLICK, CHANGE, INPUT, LOAD } from "../../../../../util/Event";
import { Length } from "../../../../../editor/unit/Length";
import { editor } from "../../../../../editor/editor";
import { html } from "../../../../../util/functions/func";
import { EVENT } from "../../../../../util/UIElement";

const outlineStyleLit = [
  'auto',
  "none",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
];

const outlineTypeList = ["all"];

export default class OutlineProperty extends BaseProperty {
  getTitle() {
    return "Outline";
  }

  afterRender() {
    this.refresh();
  }

  [LOAD("$outlineDirection")]() {
    var current = editor.selection.current || { outline: {} };

    return outlineTypeList.map(type => {
      return `<button type="button" data-value="${type}" ref="$${type}" has-value='${!!current
        .outline[type]}'></button>`;
    });
  }

  getTemplateForOutlineProperty() {
    return html`
      <div class="property-item outline-item">
        <div
          class="outline-direction"
          ref="$outlineDirection"
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
                  ${outlineStyleLit.map(it => {
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
                class="color">
                  <div 
                    class='color-view'
                    ref="$color"
                    style="background-color: black"
                  ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getBody() {
    return `
        ${this.getTemplateForOutlineProperty()}
    `;
  }

  [CHANGE("$unit")](e) {
    this.refreshOutlineInfo();
  }

  [INPUT("$widthRange")](e) {
    this.refs.$width.val(this.refs.$widthRange.value);
    this.refreshOutlineInfo();
  }

  [INPUT("$width")](e) {
    this.refs.$widthRange.val(this.refs.$width.value);
    this.refreshOutlineInfo();
  }

  [CHANGE("$style")](e) {
    this.refreshOutlineInfo();
  }

  refreshOutlineInfo() {
    var value = this.refs.$width.value;
    var type = this.refs.$outlineDirection.attr("data-selected-value");
    var unit = this.refs.$unit.value;
    var style = this.refs.$style.value;
    var color = this.refs.$color.css("background-color");

    var current = editor.selection.current;

    if (current) {
      // ArtBoard, Layer 에 새로운 BackgroundImage 객체를 만들어보자.
      current.setOutline({
        width: new Length(value, unit),
        style,
        color
      });

      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [CLICK("$color")](e) {
    this.emit("showColorPicker", {
      changeEvent: "changeOutlineColor",
      color: this.refs.$color.css("background-color")
    });
    this.emit("hidePropertyPopup");
    this.emit("hideGradientEditor");
  }

  [EVENT("changeOutlineColor")](color) {
    this.refs.$color.css("background-color", color);
    this.refreshOutlineInfo();
  }
}
