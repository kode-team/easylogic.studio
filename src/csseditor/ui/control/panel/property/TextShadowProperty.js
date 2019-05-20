import BaseProperty from "./BaseProperty";
import { INPUT, CLICK, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { TextShadow } from "../../../../../editor/css-property/TextShadow";
import { EMPTY_STRING } from "../../../../../util/css/types";
import {
  CHANGE_RECT,
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";

export default class TextShadowProperty extends BaseProperty {
  getTitle() {
    return "Text Shadows";
  }

  getBody() {
    return html`
      <div class="property-item text-shadow-item" ref="$shadowList"></div>
    `;
  }

  getTools() {
    return html`
      <button type="button" ref="$add" title="add Text Shadow">
        ${icon.add}
      </button>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;

    var arr = current.textShadows.map((shadow, index) => {
      return html`
        <div class="shadow-item real" data-index="${index}">
          <div class="color">
            <div class='color-view' style="background-color: ${shadow.color}" data-index="${index}"></div>
          </div>
          <div class="offset-x">${shadow.offsetX.toString()}</div>
          <div class="offset-y">${shadow.offsetY.toString()}</div>
          <div class="blur-radius">${shadow.blurRadius.toString()}</div>
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
      `;
    });

    if (arr.length) {
      arr.push(`
      <div class="shadow-item desc">
            <div class="color"></div>
            <div class="offset-x">X</div>
            <div class="offset-y">Y</div>
            <div class="blur-radius">Blur</div>
            <div class="tools">
            </div>
          </div>
      `);
    }
    return arr;
  }

  [EVENT(CHANGE_RECT, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
  }

  [CLICK("$add")]() {
    var current = editor.selection.current;
    if (current) {
      current.addTextShadow(new TextShadow());

      this.emit("refreshCanvas");

      this.refresh();
    }
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var current = editor.selection.current;
    if (current) {
      current.removeTextShadow(index);
      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [CLICK("$shadowList .shadow-item.real .color")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var current = editor.selection.current;
    if (current) {
      var shadow = current.textShadows[index];

      this.viewShadowPopup(shadow, index);
    }
  }

  viewShadowPopup(shadow, index) {
    this.selectedIndex = index;

    this.emit("showColorPicker", {
      changeEvent: "changeTextShadowColor",
      color: shadow.color,
      hasNotHide: true
    });

    this.viewTextShadowPropertyPopup(shadow);
  }

  viewTextShadowPropertyPopup(shadow) {
    this.emit("showTextShadowPropertyPopup", {
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
      blurRadius: shadow.blurRadius
    });
  }

  [EVENT("changeTextShadowColor")](color) {
    var current = editor.selection.current;
    if (current) {
      current.updateTextShadow(this.selectedIndex, { color });

      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [EVENT("changeTextShadowPropertyPopup")](data) {
    var current = editor.selection.current;
    if (current) {
      current.updateTextShadow(this.selectedIndex, data);

      this.refresh();

      this.emit("refreshCanvas");
    }
  }
}
