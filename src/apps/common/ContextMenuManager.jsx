import { SUBSCRIBE } from "sapa";

import "./ContextMenuManager.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export class ContextMenuManager extends EditorElement {
  template() {
    return (
      <div class="elf--context-menu-manger">
        {this.$injectManager.generate("context.menu")}
      </div>
    );
  }

  [SUBSCRIBE("openContextMenu")](obj) {
    this.$context.config.set("context.menu.open", obj);
  }
}
