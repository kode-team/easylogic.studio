import "./BlankStatusbar.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class BlankStatusbar extends EditorElement {
  template() {
    return (
      <div class="elf--status-bar">
        ${this.$injectManager.generate("statusbar")}
      </div>
    );
  }
}
