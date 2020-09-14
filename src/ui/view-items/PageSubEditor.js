import UIElement from "@core/UIElement";

import PathManager from "./PathManager";
import DrawManager from "./DrawManager";


export default class PageSubEditor extends UIElement {

  components() {
    return {
      PathManager,
      DrawManager
    }
  }

  template() {
    return/*html*/`
      <div class='page-subeditor'>
        <PathManager />
        <DrawManager />
        <SelectionManager />
      </div>
    `;
  }
}
