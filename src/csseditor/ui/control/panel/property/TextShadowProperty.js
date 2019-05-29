import BaseProperty from "./BaseProperty";
import { LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_RECT,
  CHANGE_LAYER,
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";
import TextShadowEditor from "../../shape/property-editor/TextShadowEditor";

export default class TextShadowProperty extends BaseProperty {
  components() {
    return {
      TextShadowEditor
    }
  }
  getTitle() {
    return "Text Shadows";
  }

  getBody() {
    return html`
      <div class="property-item full text-shadow-item" ref="$shadowList">
        ${this.loadTemplate('$shadowList')}
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <TextShadowEditor ref='$textshadow' value="${current['text-shadow']}" onChange="changeTextShadow" />
    `
  }

  [EVENT(CHANGE_RECT, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
  }

  [EVENT("changeTextShadow")](textshadow) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'text-shadow': textshadow
      })

      this.emit("refreshCanvas");
    }
  }
}
