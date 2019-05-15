import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { LOAD, CLICK, INPUT } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_LAYER,
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class FontColorProperty extends BaseProperty {
  getTitle() {
    return "Font Color";
  }
  getBody() {
    return `<div class='property-item font-color' ref='$color'></div>`;
  }

  [LOAD("$color")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    var it = current;
    var imageCSS = `background-color: ${it.color}`;
    return `
            <div class='fill-item'>
                <div class='preview'>
                    <div class='mini-view' style="${imageCSS}" ref='$miniView'></div>
                </div>
                <div class='color-code'>
                    <input type="text" ref='$colorCode' value='${it.color}' />
                </div>
            </div>
        `;
  }

  [CLICK("$el .preview")](e) {
    this.viewColorPicker(e.$delegateTarget);
  }

  viewColorPicker($preview) {
    var current = editor.selection.current;

    if (!current) return;

    var rect = $preview.rect();

    this.emit("hidePropertyPopup");
    this.emit("showColorPicker", {
      changeEvent: "changeFontColor",
      color: current.backgroundColor,
      left: rect.left + 90,
      top: rect.top
    });
  }

  [INPUT("$color .color-code input")](e) {
    var color = e.$delegateTarget.value;
    this.refs.$miniView.cssText(`background-color: ${color}`);

    var current = editor.selection.current;
    if (current) {
      current.color = color;
      this.emit("refreshCanvas", current);
    }
  }

  [EVENT("changeFontColor")](color) {
    this.refs.$miniView.cssText(`background-color: ${color}`);
    this.refs.$colorCode.val(color);

    var current = editor.selection.current;
    if (current) {
      current.color = color;
      this.emit("refreshCanvas", current);
    }
  }

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
  }
}
