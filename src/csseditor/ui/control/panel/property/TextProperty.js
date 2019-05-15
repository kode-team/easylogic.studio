import BaseProperty from "./BaseProperty";
import { CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class TextProperty extends BaseProperty {
  getTitle() {
    return "Text";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    var current = editor.selection.current;
    if (current) {
      var text = current.text;
      if (text.transform) {
        this.refs.$transform.val(text.transform);
      }

      if (text.decoration) {
        this.refs.$decoration.val(text.decoration);
      }
    }
  }

  templateForAlign() {
    return `
    <div class="property-item font-item">
      <label>align</label>
      <div class="input">
        <select ref="$align">
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
          <option value="justify">justify</option>
        </select>
      </div>
    </div>
    `;
  }

  templateForDecoration() {
    return `
      <div class="property-item font-item">
        <label>decoration</label>
        <div class="input">
          <select ref="$decoration">
            <option value="none">none</option>
            <option value="underline">underline</option>
            <option value="overline">overline</option>
            <option value="line-through">line-through</option>
          </select>
        </div>
      </div>
    `;
  }

  templateForTransform() {
    return `
    <div class="property-item font-item">
      <label>transform</label>
      <div class="input">
        <select ref="$transform">
          <option value="none">none</option>
          <option value="uppercase">uppercase</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">capitalize</option>
          <option value="full-width">full-width</option>
        </select>
      </div>
    </div>
    `;
  }

  getBody() {
    return html`
      ${this.templateForAlign()} ${this.templateForDecoration()}
      ${this.templateForTransform()}
    `;
  }

  [CHANGE("$transform")]() {
    this.setContent();
  }

  [CHANGE("$decoration")]() {
    this.setContent();
  }

  [CHANGE("$align")]() {
    this.setContent();
  }

  setContent() {
    var current = editor.selection.current;
    if (current) {
      var decoration = this.getRef("$decoration").value;
      var transform = this.getRef("$transform").value;
      var align = this.getRef("$align").value;

      current.reset({
        text: { decoration, transform, align }
      });

      this.emit("refreshCanvas");
    }
  }
}
