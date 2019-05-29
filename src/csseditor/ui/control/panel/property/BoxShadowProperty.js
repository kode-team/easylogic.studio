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
import BoxShadowEditor from "../../shape/property-editor/BoxShadowEditor";

export default class BoxShadowProperty extends BaseProperty {
  components() {
    return {
      BoxShadowEditor
    }
  }
  getTitle() {
    return "Box Shadows";
  }

  getBody() {
    return html`
      <div class="property-item full box-shadow-item" ref="$shadowList">
        ${this.loadTemplate('$shadowList')}
      </div>
    `;
  }

  [LOAD("$shadowList")]() {
    var current = editor.selection.current || {};
    return `
      <BoxShadowEditor ref='$boxshadow' value="${current['box-shadow']}" onChange="changeBoxShadow" />
    `
  }

  [EVENT(CHANGE_RECT, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    this.load();
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
