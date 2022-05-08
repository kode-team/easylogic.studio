import { Dom, KEYDOWN, KEYUP, IF } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

const formElements = ["TEXTAREA", "INPUT", "SELECT"];

export class KeyboardManager extends EditorElement {
  template() {
    return /*html*/ `
      <div class="keyboard-manager"></div>
    `;
  }

  isNotFormElement(e) {
    var tagName = e.target.tagName;

    if (formElements.includes(tagName)) return false;
    else if (Dom.create(e.target).attr("contenteditable") === "true")
      return false;

    return true;
  }

  [KEYDOWN("document") + IF("isNotFormElement")](e) {
    this.$commands.emit("keymap.keydown", e);
  }

  [KEYUP("document") + IF("isNotFormElement")](e) {
    this.$commands.emit("keymap.keyup", e);
  }
}
