import { createComponent } from "sapa";

import "./PopupManager.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import NotificationView from "elf/editor/ui/view/NotificationView";
import "elf/editor/ui/window-list";

export class PopupManager extends EditorElement {
  components() {
    return {
      NotificationView,
    };
  }

  template() {
    return (
      <div class="elf--popup-manager">
        {createComponent("ExportWindow")}
        {createComponent("EmbedEditorWindow")}
        {createComponent("ProjectWindow")}
        {createComponent("ShortcutWindow")}
        {createComponent("NotificationView")}
        {this.$injectManager.generate("popup", true)}
      </div>
    );
  }
}
