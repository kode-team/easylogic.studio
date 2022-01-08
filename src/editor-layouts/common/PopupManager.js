import "el/editor/ui/window-list";

import { EditorElement } from "el/editor/ui/common/EditorElement";
import NotificationView from "el/editor/ui/view/NotificationView";
import { createComponent } from "el/sapa/functions/jsx";


export default class PopupManager extends EditorElement {

  components(){
    return {
      NotificationView
    }
  }

  template() {
    return /*html*/`
      <div class="popup-manger">
        ${createComponent('ExportWindow')}
        ${createComponent('EmbedEditorWindow')}
        ${createComponent('ProjectWindow')}
        ${createComponent('ShortcutWindow')}
        ${createComponent('NotificationView')}
        ${this.$injectManager.generate('popup')}
      </div>
    `;
  }
}