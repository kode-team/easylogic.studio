import { INPUT, BIND, DEBOUNCE, SUBSCRIBE } from "sapa";

import "./ContentProperty.scss";

import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class ContentProperty extends BaseProperty {
  getTitle() {
    return "Content";
  }

  [SUBSCRIBE("refreshSelection", "refreshContent") + DEBOUNCE(100)]() {
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
    var current = this.$selection.current;

    if (!current) return "";

    return {
      value: current.content || "",
    };
  }

  [INPUT("$contentItem")]() {
    this.setContent();
  }

  setContent() {
    var current = this.$selection.current;
    if (current) {
      var data = {
        content: this.refs.$contentItem.value,
      };
      current.reset(data);
      this.emit("refreshSelectionStyleView", current);
    }
  }
}
