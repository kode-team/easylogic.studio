
import "el/editor/ui/window-list";

import { EditorElement } from "el/editor/ui/common/EditorElement";
import NotificationView from "el/editor/ui/view/NotificationView";

export default class PlayerPopupManager extends EditorElement {

  components() {
    return {
      NotificationView
    }
  }

  template() {
    return /*html*/`
      <div class="popup-manger">
        <object refClass='ExportWindow' />
        <object refClass='ProjectWindow' />
        <object refClass='ShortcutWindow' />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <!-- ImageFileView / -->
        <object refClass='NotificationView' />
        ${this.$menuManager.generate('popup')}        
      </div>
    `;
  }
}