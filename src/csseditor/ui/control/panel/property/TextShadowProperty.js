import BaseProperty from "./BaseProperty";
import { LOAD } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";

export default class TextShadowProperty extends BaseProperty {

  isHideHeader() {
    return true;
  }

  getBody() {
    return `
      <div class="property-item full text-shadow-item" ref="$shadowList"></div>
    `;
  }
  
  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <TextShadowEditor ref='$textshadow' value="${current['text-shadow'] || ''}" title='Text Shadows' onChange="changeTextShadow" />
    `
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
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
