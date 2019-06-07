import BaseProperty from "./BaseProperty";
import { INPUT, BIND } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";

import { EVENT } from "../../../../../util/UIElement";

import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  getBody() {
    return html`
      <div class="property-item content-item">
        <textarea ref="$contentItem"></textarea>
      </div>
    `;
  }

  [BIND("$contentItem")]() {
    var current = editor.selection.current;

    if (!current) return EMPTY_STRING;

    return {
      value: current.content || ""
    };
  }

  [INPUT("$contentItem")](e) {
    this.setContent();
  }

  setContent() {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        content: this.refs.$contentItem.value
      });

      this.emit("refreshCanvas");
    }
  }
}
