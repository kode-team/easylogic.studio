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
        <object refClass='PathManager' />
        <object refClass='DrawManager' />
        <object refClass='SelectionManager' />
      </div>
    `;
  }
}
