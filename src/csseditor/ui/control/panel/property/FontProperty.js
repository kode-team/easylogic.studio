import BaseProperty from "./BaseProperty";
import { INPUT, CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class FontProperty extends BaseProperty {
  getTitle() {
    return "Font";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    var current = editor.selection.current;
    if (current) {
      var font = current.font;
      if (font.size) {
        this.refs.$size.val(font.size.value);
        this.refs.$sizeNumber.val(font.size.value);
        this.refs.$sizeUnit.val(font.size.unit);
      }

      if (font.weight) {
        this.refs.$weight.val(font.weight);
      }

      if (font.style) {
        this.refs.$style.val(font.style);
      }

      if (font.lineHeight) {
        if (font.lineHeight.value === "normal") {
          this.refs.$lineHeight.attr("disabled", true);
          this.refs.$lineHeightNumber.attr("disabled", true);
          this.refs.$lineHeightUnit.val(font.lineHeight.value);
        } else {
          this.refs.$lineHeight
            .val(font.lineHeight.value)
            .removeAttr("disabled");
          this.refs.$lineHeightNumber
            .val(font.lineHeight.value)
            .removeAttr("disabled");
          this.refs.$lineHeightUnit.val(font.lineHeight.unit);
        }
      }

      if (font.family) {
        this.refs.$family.val(font.family);
      }
    }
  }

  getBody() {
    return html`
      <div class="property-item font-item">
        <label>Size</label>
        <div class="input">
          <div class="input-field">
            <input type="range" max="100" value="0" ref="$size" />
          </div>
          <div class="input-field">
            <input type="number" max="100" value="0" ref="$sizeNumber" />
          </div>
          <select ref="$sizeUnit">
            <option value="px">px</option>
            <option value="pt">pt</option>
            <option value="%">%</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>
      <div class="property-item font-item">
        <label>Style</label>
        <div class="input">
          <select ref="$style">
            <option value="normal">normal</option>
            <option value="italic">italic</option>
            <option value="oblique">oblique</option>
          </select>
        </div>
      </div>
      <div class="property-item font-item">
        <label>Weight</label>
        <div class="input">
          <select ref="$weight">
            <option value="normal">normal (400)</option>
            <option value="bold">bold (700)</option>
            <option value="lighter">lighter</option>
            <option value="bolder">bolder</option>

            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
      </div>
      <div class="property-item font-item">
        <label>line height</label>
        <div class="input">
          <div class="input-field">
            <input type="range" value="0" max="100" ref="$lineHeight" />
          </div>
          <div class="input-field">
            <input type="number" value="0" max="100" ref="$lineHeightNumber" />
          </div>
          <select ref="$lineHeightUnit">
            <option value="normal">normal</option>
            <option value=""></option>
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
          </select>
        </div>
      </div>

      <div class="property-item font-item">
        <label>Family</label>
        <div class="input">
          <select ref="$family">
            <option value=""></option>
            <option value="serif">serif</option>
            <option value="sans-serif">sans-serif</option>
            <option value="monospace">monospace</option>
            <option value="cursive">cursive</option>
            <option value="fantasy">fantasy</option>
            <option value="system-ui">system-ui</option>
          </select>
        </div>
      </div>
    `;
  }

  [INPUT("$size")](e) {
    this.refs.$sizeNumber.val(this.refs.$size.value);
    this.setContent();
  }

  [INPUT("$sizeNumber")](e) {
    this.refs.$size.val(this.refs.$sizeNumber.value);
    this.setContent();
  }

  [INPUT("$lineHeight")]() {
    this.refs.$lineHeightNumber.val(this.refs.$lineHeight.value);
    this.setContent();
  }

  [INPUT("$lineHeightNumber")]() {
    this.refs.$lineHeight.val(this.refs.$lineHeightNumber.value);
    this.setContent();
  }

  [CHANGE("$lineHeightUnit")]() {
    var unit = this.refs.$lineHeightUnit.value;

    if (unit === "normal") {
      this.refs.$lineHeight.attr("disabled", true);
      this.refs.$lineHeightNumber.attr("disabled", true);
    } else {
      this.refs.$lineHeight.removeAttr("disabled");
      this.refs.$lineHeightNumber.removeAttr("disabled");
    }

    this.setContent();
  }

  [CHANGE("$weight")]() {
    this.setContent();
  }

  [CHANGE("$family")]() {
    this.setContent();
  }

  [CHANGE("$sizeUnit")]() {
    this.setContent();
  }

  [CHANGE("$style")]() {
    this.setContent();
  }

  setContent() {
    var current = editor.selection.current;
    if (current) {
      var size = new Length(
        this.getRef("$sizeNumber").value,
        this.getRef("$sizeUnit").value
      );

      var lineHeightUnit = this.getRef("$lineHeightUnit").value;
      var lineHeight =
        lineHeightUnit === "normal"
          ? "normal"
          : new Length(this.getRef("$lineHeightNumber").value, lineHeightUnit);
      var style = this.getRef("$style").value;
      var weight = Length.string(this.getRef("$weight").value);
      var family = this.getRef("$family").value;

      current.reset({
        font: { size, lineHeight, style, weight, family }
      });

      this.emit("refreshCanvas");
    }
  }
}
