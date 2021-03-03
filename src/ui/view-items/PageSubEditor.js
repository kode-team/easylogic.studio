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
        <span refClass='PathManager' />
        <span refClass='DrawManager' />
        <span refClass='SelectionManager' />
      </div>
    `;
  }
}
