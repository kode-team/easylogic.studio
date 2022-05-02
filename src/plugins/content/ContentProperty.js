import { INPUT, BIND, DEBOUNCE, SUBSCRIBE } from "sapa";

import "./ContentProperty.scss";

import {
  REFRESH_SELECTION,
  REFRESH_CONTENT,
  UPDATE_CANVAS,
} from "elf/editor/types/event";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }

  [SUBSCRIBE(REFRESH_SELECTION, REFRESH_CONTENT) + DEBOUNCE(100)]() {
    this.refreshShow(["text"]);
  }

  getBody() {
    return /*html*/ `
      <div class="property-item elf--content-item">
        <textarea ref="$contentItem"></textarea>
      </div>
    `;
  }

  [BIND("$contentItem")]() {
    var current = this.$context.selection.current;

    if (!current) return "";

    return {
      value: current.content || "",
    };
  }

  [INPUT("$contentItem")]() {
    this.setContent();
  }

  setContent() {
    var current = this.$context.selection.current;
    if (current) {
      var data = {
        content: this.refs.$contentItem.value,
      };
      current.reset(data);
      this.emit(UPDATE_CANVAS, current);
    }
  }
}
