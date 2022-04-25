import { createComponent } from "sapa";

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
      <div class="popup-manger">
        {createComponent("ExportWindow")}
        {createComponent("EmbedEditorWindow")}
        {createComponent("ProjectWindow")}
        {createComponent("ShortcutWindow")}
        {createComponent("NotificationView")}
        {this.$injectManager.generate("popup")}
      </div>
    );
  }
}
