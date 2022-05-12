import { SUBSCRIBE } from "sapa";

import "./ContextMenuManager.scss";

import { OPEN_CONTEXT_MENU } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export class ContextMenuManager extends EditorElement {
  template() {
    return (
      <div class="elf--context-menu-manger">
        {this.$injectManager.generate("context.menu")}
      </div>
    );
  }

  [SUBSCRIBE(OPEN_CONTEXT_MENU)](obj) {
    this.$context.config.set("context.menu.open", obj);
  }
}
