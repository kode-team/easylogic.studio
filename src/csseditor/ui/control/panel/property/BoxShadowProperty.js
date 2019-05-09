import BaseProperty from "./BaseProperty";
import { INPUT, CLICK, LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { BoxShadow } from "../../../../../editor/css-property/BoxShadow";
import { EMPTY_STRING } from "../../../../../util/css/types";
import {
  CHANGE_RECT,
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";

export default class BoxShadowProperty extends BaseProperty {
  getTitle() {
    return "Box Shadows";
  }

  getBody() {
    return html`
      <div class="property-item box-shadow-item" ref="$shadowList"></div>
    `;
  }

  getTools() {
    return html`
      <button type="button" ref="$add" title="add Box Shadow">
        ${icon.add}
      </button>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;

    var arr = current.boxShadows.map((shadow, index) => {
      return html`
        <div class="shadow-item real" data-index="${index}">
          <div class="inset" data-value="${shadow.inset}">${icon.check}</div>
          <div
            class="color"
            style="background-color: ${shadow.color}"
            data-index="${index}"
          ></div>
          <div class="offset-x">${shadow.offsetX.toString()}</div>
          <div class="offset-y">${shadow.offsetY.toString()}</div>
          <div class="blur-radius">${shadow.blurRadius.toString()}</div>
          <div class="spread-radius">${shadow.spreadRadius.toString()}</div>
          <div class="tools">
            <button type="button" class="remove" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
      `;
    });

    arr.push(`
    <div class="shadow-item desc">
          <div class="inset" >Inset</div>
          <div class="color"></div>
          <div class="offset-x">X</div>
          <div class="offset-y">Y</div>
          <div class="blur-radius">Blur</div>
          <div class="spread-radius">Spread</div>
          <div class="tools">
          </div>
        </div>
    `);

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
      current.addBoxShadow(new BoxShadow());

      this.emit("refreshCanvas");

      this.refresh();
    }
  }

  [CLICK("$shadowList .remove")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var current = editor.selection.current;
    if (current) {
      current.removeBoxShadow(index);
      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [CLICK("$shadowList .shadow-item.real .color")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var current = editor.selection.current;
    if (current) {
      var shadow = current.boxShadows[index];

      this.viewShadowPopup(shadow, index);
    }
  }

  viewShadowPopup(shadow, index) {
    this.selectedIndex = index;

    this.emit("showColorPicker", {
      changeEvent: "changeBoxShadowColor",
      color: shadow.color,
      hasNotHide: true
    });

    this.viewBoxShadowPropertyPopup(shadow);
  }

  viewBoxShadowPropertyPopup(shadow) {
    this.emit("showBoxShadowPropertyPopup", shadow.clone());
  }

  [EVENT("changeBoxShadowColor")](color) {
    var current = editor.selection.current;
    if (current) {
      current.updateBoxShadow(this.selectedIndex, { color });

      this.refresh();

      this.emit("refreshCanvas");
    }
  }

  [EVENT("changeBoxShadowPropertyPopup")](data) {
    var current = editor.selection.current;
    if (current) {
      current.updateBoxShadow(this.selectedIndex, data);

      this.refresh();

      this.emit("refreshCanvas");
    }
  }
}
