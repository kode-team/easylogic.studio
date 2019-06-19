import BaseProperty from "./BaseProperty";
import { LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_ARTBOARD,
  CHANGE_SELECTION
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class BoxShadowProperty extends BaseProperty {
  
  isHideHeader() {
    return true;
  }

  getBody() {
    return html`
      <div class="property-item full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <BoxShadowEditor ref='$boxshadow' value="${current['box-shadow'] || EMPTY_STRING}" title='Box Shadows' onChange="changeBoxShadow" />
    `
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  [EVENT("changeBoxShadow")](boxshadow) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        'box-shadow': boxshadow
      })

      this.emit("refreshCanvas");
    }
  }
}
