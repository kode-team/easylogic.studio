import UIElement from "@core/UIElement";

import "./PathManager";
import "./DrawManager";
import { registElement } from "@core/registerElement";

export default class PageSubEditor extends UIElement {

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

registElement({ PageSubEditor })
