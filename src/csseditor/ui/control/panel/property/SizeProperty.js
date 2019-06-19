import BaseProperty from "./BaseProperty";
import { INPUT, CLICK, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class SizeProperty extends BaseProperty {
  getTitle() {
    return "Size";
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  getBody() {
    return html`
      <div class="property-item size-item" ref="$sizeItem"></div>
    `;
  }

  [LOAD("$sizeItem")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;

    return html`
      <div class="width">
        <input
          type="number"
          ref="$width"
          min="1"
          value="${current.width.value.toString()}"
        />
        <label>Width</label>
      </div>
      <div class="tool">
        <button type="button" data-value="fixed" ref="$fixSize">
          ${icon.arrowRight}
        </button>
      </div>
      <div class="height">
        <input
          type="number"
          ref="$height"
          min="1"
          value="${current.height.value.toString()}"
        />
        <label>Height</label>
      </div>
    `;
  }

  [INPUT("$sizeItem .width input")](e) {
    this.setSize({
      width: Length.px(+this.getRef("$width").value)
    });
  }

  [INPUT("$sizeItem .height input")](e) {
    this.setSize({
      height: Length.px(+this.getRef("$height").value)
    });
  }

  [CLICK("$sizeItem .tool button")]() {
    var width = Length.px(+this.getRef("$width").value);
    this.getRef("$height").val(+width);

    this.setSize({
      width,
      height: width
    });
  }

  setSize(data) {
    var current = editor.selection.current;
    if (current) {
      current.setSize(data);

      this.emit("setSize");
      this.emit("refreshCanvas");
    }
  }
}
