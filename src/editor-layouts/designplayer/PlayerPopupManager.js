
import "el/editor/ui/window-list";
import "el/editor/ui/view/NotificationView";

import { registElement } from "el/base/registElement";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class PlayerPopupManager extends EditorElement {

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

registElement({ PlayerPopupManager })